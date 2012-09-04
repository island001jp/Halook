/////////////////////////////////////////////////////////
//               Following is constant                 //
/////////////////////////////////////////////////////////
halook.hbase.parent;
halook.hbase.parent.id = {
	informationArea		: 'informationArea',
	legendArea			: 'legendArea',
	annotationLegendArea: 'annotationLegendArea',
	dualSliderArea		: 'dualSliderArea',
	graphArea			: 'graphArea'
};
halook.hbase.parent.css = {};
halook.hbase.parent.css.informationArea = {
	fontSize	: "14px",
	float		: "right",
	width		: "180px",
	height		: "350px",
	border		: "1px #dcdcdc solid",
	margin		: "190px 20px 0px 0px"
};
halook.hbase.parent.css.legendArea = {
	height	: "40px",
	margin	: "5px 5px 5px 5px"
};
halook.hbase.parent.css.annotationLegendArea = {
	margin	: "0px 0px 0px 0px",
	padding	: "5px 5px 5px 5px"
};
halook.hbase.parent.css.dualSliderArea = {
	float	: "left",
	width	: "600px",
	margin	: "50px 0px 0px 60px",
};
halook.hbase.parent.css.graphArea = {
	float	: "left",
	width	: "650px",
	margin	: "30px 0px 0px 10px"
};

/////////////////////////////////////////////////////////
//                       Class                         //
/////////////////////////////////////////////////////////
var HbaseParentView = wgp.AbstractView.extend({
	initialize: function(){
		this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new HbaseParentCollection();
		//this.registerCollectionEvent();
		
		// add div tag and css of
		// 'information area'
		var id = halook.hbase.parent.id;
		$("#" + this.$el.attr("id")).append(
				'<div id="' + id.informationArea + '"></div>');
		$('#' + id.informationArea).css(
				halook.hbase.parent.css.informationArea);
		
		// add div tag and css of
		// 'contents in information area'
		$('#' + id.informationArea).append(
				'<div id="' + id.legendArea + '"></div>');
		$('#' + id.legendArea).css(
				halook.hbase.parent.css.legendArea);
		$('#' + id.informationArea).append(
				'<div id="' + id.annotationLegendArea + '"></div>');
		$('#' + id.annotationLegendArea).css(
				halook.hbase.parent.css.annotationLegendArea);
		
		// add div tag and css of
		// 'dual slider area', and make dual slider
		$("#" + this.$el.attr("id")).append(
				'<div id="' + id.dualSliderArea + '"></div>');
		$('#' + id.dualSliderArea).css(
				halook.hbase.parent.css.dualSliderArea);
		var dualSliderView = new DualSliderView(
				{id: id.dualSliderArea, rootView:this});
		
		// add div tag and css of
		// 'graph area', and make graph
		$("#" + this.$el.attr("id")).append(
				'<div id="' + id.graphArea + '"></div>');
		$('#' + id.graphArea).css(
				halook.hbase.parent.css.graphArea);
		var hbaseView = new HbaseView(
				{id: id.graphArea, rootView:this});
		
		// associate with the slider and graph
		this.setEventOnDualSlider(dualSliderView, hbaseView);
		
		// add legend of annotation  
		this.setAnnotationText();
	},
	render : function(){
		console.log('call render');
	},
	onAdd : function(element){
		console.log('call onAdd');
	},
	onChange : function(element){
		console.log('called changeModel');
	},
	onRemove : function(element){
		console.log('called removeModel');
	},
	setEventOnDualSlider : function(dualSliderView, targetView){
		var dualSliderComponent = dualSliderView.getSliderComponet();
		dualSliderComponent.bind("slidechange", function(event, ui) {
			var fromto = dualSliderView.getFromToAsArray(ui.values);
			targetView.updateDisplaySpan(fromto[0], fromto[1]);
		});
	},
	setAnnotationText:function(){
		var id = halook.hbase.parent.id;
		$('#' + id.annotationLegendArea).empty();
		
		// multiple
		$('#' + id.annotationLegendArea).append(
				'<p class="graphAnnotationMultiple"><strong>Multiple events</strong><br> were occurred</p>');
		
		// minor compaction
		$('#' + id.annotationLegendArea).append(
				'<p class="graphAnnotationCompaction_minor"><strong>Minor Compaction</strong><br> was occurred</p>');
		
		// major compaction
		$('#' + id.annotationLegendArea).append(
				'<p class="graphAnnotationCompaction_major"><strong>Major Compaction</strong><br> was occurred</p>');
		
		// split
		$('#' + id.annotationLegendArea).append(
				'<p class="graphAnnotationSplit"><strong>Split</strong><br> was occurred</p>');
	
	}
	
});



/////////////////////////////////////////////////////////
//                      Comment                        //
/////////////////////////////////////////////////////////
/*
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
*/


/*
$('#annotationLegendArea').empty()
		
		// multiple
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationMultiple"><strong>Multiple events</strong><br> were occurred</p>');
		
		// minor compaction
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationCompaction_minor"><strong>Minor Compaction</strong><br> was occurred</p>');
		
		// major compaction
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationCompaction_major"><strong>Major Compaction</strong><br> was occurred</p>');
		
		// split
		$('#annotationLegendArea').append(
				'<p class="graphAnnotationSplit"><strong>Split</strong><br> was occurred</p>');
	

*/