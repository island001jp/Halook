/////////////////////////////////////////////////////////
//               Following is constant                 //
/////////////////////////////////////////////////////////
/*
halook.hbase.parent;
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
*/

/////////////////////////////////////////////////////////
//                       Class                         //
/////////////////////////////////////////////////////////
var HbaseParentView = wgp.AbstractView.extend({
	initialize: function(arguments, treeSettings){
		this.viewtype 	= wgp.constants.VIEW_TYPE.VIEW;
		this.viewId 	= '#' + this.$el.attr('id');
		var idDict 		= halook.hbase.parent.id;
		var cssDict		= halook.hbase.parent.css;
		
		// css
		$(this.viewId).css({
			//background		: "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
			//background		: "#dcdcdc"
		});
		
		
		// logo area 
		$(this.viewId).append('<div id="logo"></div>');
		$('#logo').append('<h1>Hbase Region Number, Event Occurrence</h1>');
		$('#logo').append('<img src="/WebDashboard/resources/images/halook_120x30.png">');
		$('#logo'). css({
			overflow	: 'auto',
			margin		: '10px 0px 0px 10px',
			border		: '1px #dcdcdc solid',
			background	: "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
		});
		$('#logo h1').css({
			fontSize	: '25px',
			width	: '600px',
			margin	: '10px 0px 10px 20px',
			float	: 'left'
		});
		$('#logo img').css({
			width	: '120px',
			height	: '30px',
			margin	: '5px 10px 10px 0px',
			float	: 'right'
		});
		
		
		// dual slider area (add div and css, and make slider)
		$(this.viewId).append('<div id="'+ idDict.dualSliderArea +'"></div>');
		$('#' + idDict.dualSliderArea).css(cssDict.dualSliderArea);
		this.dualSliderView = new DualSliderView(
				{id: idDict.dualSliderArea, rootView:this});
		
		// information area (add div and css)
		$(this.viewId).append('<div id="'+ idDict.informationArea +'"></div>');
		$('#' + idDict.informationArea).css(cssDict.informationArea);
		
		// graph legend area (add div and css)
		$('#' + idDict.informationArea).append(
				'<div id="'+ idDict.legendArea +'"></div>');
		$('#' + idDict.legendArea).css(cssDict.legendArea);
		
		// annotation legend area (add div and css)
		$('#' + idDict.informationArea).append(
				'<div id="'+ idDict.annotationLegendArea +'"></div>');
		$('#' + idDict.annotationLegendArea).css(cssDict.annotationLegendArea);
		
		// graph area (add div and css, and make graph)
		$(this.viewId).append('<div id="'+ idDict.graphArea +'"></div>');
		$('#' + idDict.graphArea).css(cssDict.graphArea);
		this.hbaseView = new HbaseView({
			id				: idDict.graphArea, 
			rootView		: this,
			treeSettings 	: treeSettings
		});
		
		// associate with the slider and graph
		var instance = this;
		this.dualSliderView.setScaleMovedEvent(
			function(fromMillisecond, toMillisecond){
				instance.hbaseView.updateDisplaySpan(fromMillisecond, 
													 toMillisecond);
		});
		
		console.log('initialize (parent)');
	},
	render : function(){
		console.log('call render (parent)');
	},
	onAdd : function(element){
		console.log('call onAdd (parent)');
	},
	onChange : function(element){
		console.log('called changeModel (parent)');
	},
	onRemove : function(element){
		console.log('called removeModel (parent)');
	},
	getTermData : function() {
		// データの整形などの処理   データ取ってきたとき呼ばれる
		console.log('called getTermData (parent)');
	},
	destroy : function(){
		// ツリー移動時に呼ばれる
		console.log('called destroy (parent)');
		this.stopRegisterCollectionEvent();
	}
});

