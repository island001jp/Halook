// set static variables 
var _hbaseParentView = {};
_hbaseParentView.id = {
	InformationArea		: '',
	legendArea			: '',
	annotationLegendArea: '',
	dualSliderArea		: '',
	hbaseGraphArea		: ''
};
_hbaseParentView.InformationAreaCss = {
	fontSize	: "14px",
	float		: "right",
	width		: "180px",
	border		: "1px #dcdcdc solid",
	margin		: "190px 20px 0px 0px"
};
_hbaseParentView.legendAreaCss = {
	height	: "40px",
	margin	: "5px 5px 5px 5px"
};
_hbaseParentView.annotationLegendAreaCss = {
	margin	: "0px 0px 0px 0px",
	padding	: "5px 5px 5px 5px"
};
_hbaseParentView.dualSliderAreaCss = {
	float	: "left",
	width	: "600px",
	margin	: "50px 0px 0px 60px",
};
_hbaseParentView.hbaseGraphArea = {
	float	: "left",
	margin	: "30px 0px 0px 10px"
};
	
	
var HbaseParentView = wgp.AbstractView.extend({
	initialize: function(){
		this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new HbaseParentCollection();
		//this.registerCollectionEvent();
		
		// add area of information
		$("#" + this.$el.attr("id")).append('<div id="InformationArea"></div>');
		$("#InformationArea").append('<div id="legendArea"></div>');
		$("#InformationArea").append('<div id="annotationLegendArea"></div>');
		$("#InformationArea").css(_hbaseParentView.InformationAreaCss);
		$("#legendArea").css(_hbaseParentView.legendAreaCss);
		$("#annotationLegendArea").css(_hbaseParentView.annotationLegendAreaCss);
		
		// add area of dual slider 
		$("#" + this.$el.attr("id")).append('<div id="dualSliderArea"></div>');
		var dualSliderView = new DualSliderView({id:"dualSliderArea", rootView:this});
		$("#dualSliderArea").css(_hbaseParentView.dualSliderAreaCss);
		
		// add area of graph
		$("#" + this.$el.attr("id")).append('<div id="hbaseGraphArea"></div>');
		var hbaseView = new HbaseView({id:"hbaseGraphArea", rootView:this});
		$("#hbaseGraphArea").css(_hbaseParentView.hbaseGraphArea);
		
		// get component of slider
		var dualSliderComponent = dualSliderView.getSliderComponet();
		
		// add event on dual slider
		dualSliderComponent.bind("slidechange", function(event, ui) {
			var fromto = dualSliderView.getFromToAsArray(ui.values);
			hbaseView.updateDisplaySpan(fromto[0], fromto[1]);
		});
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
	}
	
});

