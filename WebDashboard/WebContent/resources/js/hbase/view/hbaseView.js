wgp.DygraphAttribute = [
    "colors",
    "labels",
    "valueRange",
    "xlabel",
    "ylabel",
    "strokeWidth",
    "legend",
    "labelsDiv",
    "labelsDivWidth",
    "labelsDivStyles",
    "hideOverlayOnMouseOut",
    "width",
    "height",
    "zoomCallback",
    "drawCallback",
    "dateWindow"
];

//var HbaseView = wgp.DygraphElementView.extend({
var HbaseView = wgp.AbstractView.extend({
	initialize: function(){
		var instance = this;
		this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new HbaseCollection;
		//this.registerCollectionEvent();
		
		this.width = 650;
		this.height = 300;
		//this.graphId = "contents_area_0";
		this.attributes = {
			xlabel: 	"Time",
			ylabel: 	"number of region",
			labels: 	["time","number of region", "amount"],
			legend: 	"always",
			labelsDiv: 	"legendArea",
			labelsDivWidth: 100,
            labelsDivStyles: {
            	'top': 'auto',
            	'left': '30px',
            	'backgroundColor': 'rgba(200, 200, 255, 0.75)',
            	'padding': '4px',
            	'border': '1px solid black',
            	'borderRadius': '10px',
            	'boxShadow': '4px 4px 4px #888'
            },
			hideOverlayOnMouseOut: false,
			zoomCallback: function(){
				instance.setAnnotationCss();
			},
			/*
			drawCallback: function(){
				alert("test");
				instance.setAnnotationCss();
			},*/
			dateWindow:	null
		};
		this.maxId = 0;
		
		// test data
		this.annotationArray = [];
		dataArray = halook.hbase.dataArray;
		this.nowtime = null;
		
		// 
		var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }else{
        	realTag.width(this.width);
        }
        if (this.height == null) {
            this.height = realTag.height();
        }else{
        	realTag.height(this.height);
        }
        
        if(dataArray && dataArray.length > 0){
        	this.addCollection(dataArray);
            this.render();
        }
        
		console.log('hello, instance: HbaseView');
	},
	render : function(){
		// get data
		var data = this.getData();
		
		// adjust display span
		var earliest = data[0][0];
		var latest = data[data.length-1][0];
		if(data.length > 60){
			var earliest = data[data.length-61][0];
		};
		this.attributes.dateWindow = [earliest, latest];
		this.nowtime = latest.getTime();
		
		// make graph
		this.entity = new Dygraph(
			document.getElementById(this.$el.attr("id")),
			data,
			this.getAttributes(wgp.DygraphAttribute)
		);
		
		// set annotation
		this.entity.setAnnotations(this.annotationArray);
		this.setAnnotationCss();
		
		console.log('call render');
	},
	onAdd : function(element){
		
		var dataArray = [];
		if(this.collection.length > graphMaxNumber){
			this.collection.shift(wgp.constants.BACKBONE_EVENT.SILENT);
		}
		
		_.each(this.collection.models, function(model,index){
			//dataArray.push(model.get("data"));
			
			var modelData = model.get("data");
			var array = [];
			//array.push(modelData);
			array.push(modelData.timestamp);
			array.push(modelData.data.region_number);
			dataArray.push(array);
			
		});
		if(this.entity == null){
			this.render();
		}else{
			this.entity.updateOptions({file: dataArray});
		}
		
		console.log('call onAdd');
	},
	onChange : function(element){
		console.log('called changeModel');
	},
	onRemove : function(element){
		console.log('called removeModel');
	},
	addCollection:function(dataArray){
		if(dataArray != null){
			var instance = this;
			_.each(dataArray, function(data, index){
				var model = new instance.collection.model({dataId: instance.maxId, data:data});
				instance.collection.add(model, wgp.constants.BACKBONE_EVENT.SILENT);
				instance.maxId++;
			});
		}
	},
	getData:function(){
		var instance = this;
		var data = [];
		var series = this.attributes.ylabel;
		
		_.each(this.collection.models, function(model, index){
			var modelData = model.get("data");
			var timestamp = modelData.timestamp;
			var region_number = modelData.data.region_number;
			var eventString = modelData.event;
			
			// push data
			var tmpArray = [];
			tmpArray.push(new Date(timestamp));
			tmpArray.push(region_number);
			data.push(tmpArray);
			
			// push annotation 
			if (eventString != ""){
				var annotationElement = instance._getAnnotationElement(
																timestamp, 
																eventString, 
																series);
				instance.annotationArray.push(annotationElement);
			}
		});
		
		return data;
	},
	_getAnnotationElement: function(timestamp, eventString, series){
		var annotationElement = {};
		var shortText = null;
		var text = null;
		var styleNameSuffix = null;
		eventNameList = eventString.split(",");
		
		// adjust annotation text
		if(eventNameList.length > 1){
			shortText = "*";
			text = eventNameList.join("\n");
			styleNameSuffix = 'Multiple';
		}else{
			shortText = eventNameList[0][0];
			text = eventNameList[0];
			styleNameSuffix = text;
		}
		
		annotationElement.series 		= series;
		annotationElement.x				= timestamp;
		annotationElement.shortText		= shortText;
		annotationElement.text			= text;
		annotationElement.cssClass		= 'graphAnnotation' + styleNameSuffix;
		
		return annotationElement
	},
	getRegisterId : function(){
		return this.graphId;
	},
	setAnnotationCss:function(){
		$('#annotationLegendArea').empty()
		
		// multiple
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationMultiple"><strong>Multiple events</strong><br> were occurred</p>');
		$(".graphAnnotationMultiple").css({
			color : "red",
			backgroundColor: "black",
			border: "0px black solid"	
		});
		
		// minor compaction
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationCompaction_minor"><strong>Minor Compaction</strong><br> was occurred</p>');
		$(".graphAnnotationCompaction_minor").css({
			color : "black",
			backgroundColor: "#00E7F2",
			border: "0px #00E7F2 solid"	
		});
		
		// major compaction
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationCompaction_major"><strong>Major Compaction</strong><br> was occurred</p>');
		$(".graphAnnotationCompaction_major").css({
			color : "black",
			backgroundColor: "#0079F2",
			border: "0px #0079F2 solid"	
		});
		
		// split
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationSplit"><strong>Split</strong><br> was occurred</p>');
		$(".graphAnnotationSplit").css({
			color : "black",
			backgroundColor: "#36F200",
			border: "0px #36F200 solid"	
		});
	},
	getGraphObject : function(){
		return this.entity;
	},
	updateDisplaySpan: function(from, to){
		var earliest = this.nowtime - from;
		var latest = this.nowtime - to;
		
		this.getGraphObject().updateOptions({
			dateWindow : [earliest, latest]
		});
		
		this.setAnnotationCss();
	}
	
	
});

