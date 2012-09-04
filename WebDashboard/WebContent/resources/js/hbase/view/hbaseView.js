/////////////////////////////////////////////////////////
//               Following is constant                 //
/////////////////////////////////////////////////////////
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
halook.hbase.graph;
halook.hbase.graph.attributes = {
	//width		: "650",
	height		: "400",
	xlabel		: "Time",
	ylabel		: "Number of region",
	labels		: ["Time","Number of region", "Amount"],
	legend		: "always",
	labelsDiv	: halook.hbase.parent.id.legendArea,
	labelsDivWidth			: 100,
	hideOverlayOnMouseOut	: false,
	dateWindow	:	null
};
halook.hbase.graph.annotation = {
	shortTextClassName	: 'annotationShortText'
};
halook.hbase.graph.eventType = {
	multiple	: {
		className		: 'multiple',
		shortText		: '*',
		text			: 'Multiple Events were occured',
		css				: {
			color			: 'red',
			backgroundColor : 'black',
			border			: '0px white solid'			
		}
	},
	majorCompaction	: {
		className		: 'majorCompaction',
		shortText		: 'M',
		text			: 'Major Compaction was occured',
		css				: {
			color			: 'black',
			backgroundColor : '#0079F2',
			border			: '0px white solid'
		}
	},
	minorCompaction	: {
		className		: 'minorCompaction',
		shortText		: 'M',
		text			: 'Minor Compaction was occured',
		css				: {
			color			: 'black',
			backgroundColor : '#00E7F2',
			border			: '0px white solid'
		}
	},
	split	: {
		className		: 'split',
		shortText		: 'S',
		text			: 'Split was occured',
		css				: {
			color			: 'black',
			backgroundColor : '#36F200',
			border			: '0px white solid'
		}
	}
};


/////////////////////////////////////////////////////////
//                       Class                         //
/////////////////////////////////////////////////////////
var HbaseView = wgp.AbstractView.extend({
	initialize: function(){
		this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new HbaseCollection;
		this.maxId = 0;
		//this.registerCollectionEvent();
		//this.width = 650;
		//this.height = 300;
		//this.graphId = "contents_area_0";
		
		// set the attributes of the graph
		var instance = this;
		this.attributes = halook.hbase.graph.attributes;
		this.attributes.zoomCallback = function(){
			instance.setAnnotationCss();
		};
		
		// set the size of this area
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
        
        // initialize the test data
        this.nowtime = null;
		this.annotationArray = [];
		var dataArray = halook.hbase.graph._dataArray;
		
		// draw the graph
        if(dataArray && dataArray.length > 0){
        	this.addCollection(dataArray);
            this.render();
        };
        
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
		};this.attributes.dateWindow = [earliest, latest];
		this.nowtime = latest.getTime();
		
		// make graph
		this.entity = new Dygraph(
			document.getElementById(this.$el.attr("id")),
			data,
			this.getAttributes(wgp.DygraphAttribute)
		);
		
		// set annotation
		this.entity.setAnnotations(this.annotationArray);
		this.setAnnotationLegend();
		this.setAnnotationCss();
		
		console.log('call render');
	},
	onAdd : function(element){
		
		var dataArray = [];
		if(this.collection.length > graphMaxNumber){
			this.collection.shift(wgp.constants.BACKBONE_EVENT.SILENT);
		}
		
		_.each(this.collection.models, function(model,index){
			var modelData = model.get("data");
			var array = [];
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
				var model = new instance.collection.model({
					dataId	: instance.maxId, 
					data	: data
				});
				instance.collection.add(model, 
										wgp.constants.BACKBONE_EVENT.SILENT);
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
			if (eventString != ''){
				var annotationElement = instance._getAnnotationElement(
																timestamp, 
																eventString, 
																series);
				instance.annotationArray.push(annotationElement);
			};
		});
		
		return data;
	},
	_getAnnotationElement: function(timestamp, eventString, series){
		var annotationElement = {
				series		: series,
				x			: timestamp,
				shortText	: null,
				text		: null,
				tickHeight	: 5 + Math.random() * 50,
				cssClass	: null
		};
		
		// split event String 
		var delimin = halook.hbase.graph._dataDelimin;
		eventNameList = eventString.split(delimin);
		
		// adjust annotation text and css
		var eventTypeDict = halook.hbase.graph.eventType;
		if(eventNameList.length > 1){
			annotationElement.shortText = eventTypeDict.multiple.shortText;
			annotationElement.text = eventNameList.join("\n");
			var eventClassName = eventTypeDict.multiple.className;
		}else{
			var eventName = eventNameList[0];
			annotationElement.shortText = eventTypeDict[eventName].shortText;
			annotationElement.text = eventTypeDict[eventName].text;
			var eventClassName = eventTypeDict[eventName].className;
		};
		annotationElement.cssClass		= 
			halook.hbase.graph.annotation.shortTextClassName + ' ' +
			eventClassName;
		
		return annotationElement
	},
	setAnnotationLegend:function(){
		// initialize the area
		var targetId = halook.hbase.parent.id.annotationLegendArea;
		$('#' + targetId).empty();
		
		// add legend of all events
		var eventTypeDict = halook.hbase.graph.eventType;
		var annotationShortTextClassName = 
					halook.hbase.graph.annotation.shortTextClassName;
		for (var typeKey in eventTypeDict) {
			$('#' + targetId).append(
				'<p class="' + 
				annotationShortTextClassName + ' ' +
				eventTypeDict[typeKey].className + '">' +
				eventTypeDict[typeKey].text + '</p>');
		};
	},
	setAnnotationCss : function(){
		var shortTextClassName = 
					halook.hbase.graph.annotation.shortTextClassName;
		
		var eventTypeDict = halook.hbase.graph.eventType;
		for (var typeKey in eventTypeDict) {
			// make css attributes
			var cssAttributes = {};
			for (var cssKey in eventTypeDict[typeKey].css){
				cssAttributes[cssKey] = eventTypeDict[typeKey].css[cssKey];
			};
			
			// add css
			$('.' + shortTextClassName + 
			  '.' + eventTypeDict[typeKey].className).css(cssAttributes);
		}
	},
	getRegisterId : function(){
		return this.graphId;
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

