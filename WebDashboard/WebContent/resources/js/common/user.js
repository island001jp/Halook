var graphViewElement = {
	viewClassName : "wgp.DygraphElementView",
	viewAttribute : {
		term : 1800,
		noTermData : false
	}
};

var mapTabElement = {
	viewClassName : "wgp.MapView",
	tabTitle : "Map",
};

var graphAreaTabElement = { 
	viewClassName : "wgp.MultiAreaView",
	tabTitle : "Graph",
	collection :[graphViewElement]
};

var tabViewElement = {
	viewClassName: "wgp.TabView",
	collection:[mapTabElement, graphAreaTabElement]
};


var hbaseGrowthGraphParentView = { 
		viewClassName	: "HbaseParentView"
};
var hbaseGrowthGraphField = {
		viewClassName	: "wgp.MultiAreaView",
		rootView		: appView,
		collection		: [hbaseGrowthGraphParentView]
};

wgp.constants.VIEW_SETTINGS = {
	"default" : graphViewElement,
	"/usage/" : tabViewElement,
	"/hbase/event" : hbaseGrowthGraphParentView,
	//"/hdfs" : hbaseGrowthGraphField,
	"/total/" : graphViewElement,
	"/system/" : graphViewElement,
	"/user/" : graphViewElement
};