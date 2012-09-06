/////////////////////////////////////////////////////////
//               Following is constant                 //
/////////////////////////////////////////////////////////

halook.common = {};
halook.common.dualslider = {};
halook.common.dualslider.scaleUnitString= 'hours';
halook.common.dualslider.scaleUnit		= 60 * 60 * 1000; //millisecond
halook.common.dualslider.groupString	= 'days';
halook.common.dualslider.groupUnitNum	= 24;
halook.common.dualslider.groupMaxNum	= 7;
halook.common.dualslider.groupDefaultNum= 2;
halook.common.dualslider.idFrom 		= 'dualSliderFromValue';
halook.common.dualslider.idTo 			= 'dualSliderToValue';

var DualSliderView = wgp.AbstractView.extend({
	initialize: function(){
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		
		this.sliderComponent= null;
		this.scaleMovedEventFunc = null;
		this.scaleUnitString= halook.common.dualslider.scaleUnitString;
		this.scaleUnit		= halook.common.dualslider.scaleUnit;
		this.groupString	= halook.common.dualslider.groupString;
		this.groupUnitNum	= halook.common.dualslider.groupUnitNum;
		this.groupMaxNum	= halook.common.dualslider.groupMaxNum;
		this.groupNum		= halook.common.dualslider.groupDefaultNum;
		this.idFrom			= halook.common.dualslider.idFrom;
		this.idTo			= halook.common.dualslider.idTo;
		this.viewId			= '#' + this.$el.attr('id');
		this.fromScale		= this.groupUnitNum * this.groupNum - 1;
		this.toScale		= this.groupUnitNum * this.groupNum;
		
		// add slider
		//$(this.viewId).append('<div id="scaleArea"></div>');
		var htmlString = this._getScaleHtml(this.scaleUnitString, 
										this.groupUnitNum * this.groupNum, 
										this.groupString, this.groupUnitNum);
		$(this.viewId).append(htmlString);
		this._selectSliderScale(this.idFrom, this.fromScale);
		this._selectSliderScale(this.idTo, this.toScale);
		this.sliderComponent = 
			$(this.viewId + ' select#' + this.idFrom + ',' +
			  this.viewId + ' select#' + this.idTo).selectToUISlider();
		
		// adjust slider visual
		$(this.viewId + ' form#scaleArea').css({
			width	: '600px',
			float	: 'left'
		});
		$(this.viewId + ' fieldset').css({
			height	: '80px',
			padding	: '60px 40px 0px 20px',
			border	: '1px #dcdcdc solid'
		});
		
		// adjust label on slider
		$(this.viewId + ' span.ui-slider-label-show').css({
			display		: "block",
			fontSize	: "14px",
			textAlign	: "left",
			width		: "100px",
			marginLeft	: "2px"//,
			//border: "1px black solid"
		});
		
		// adjust label of group on slider
		$(this.viewId + ' dl.ui-slider-scale dt').css({
			top			: '-70px'
		});
		$(this.viewId + ' dl.ui-slider-scale dt span').css({
			color		: 'red',
			fontSize	: '14px'
		});
		
		//hide pull down menu
		$(this.viewId + ' select#' + this.idTo).hide();
		$(this.viewId + ' select#' + this.idFrom).hide();
		
		
		
		// group
		var htmlString = this._getGroupHtml(this.groupMaxNum, this.groupString);
		$(this.viewId).append(htmlString + '<hr class="clearFloat">');
		console.log('initialize (dual slider)');

		$(this.viewId + ' form#groupArea').css({
			width	: '100px',
			float	: 'right'
		});
		$(this.viewId + ' .clearFloat').css({
			diplay	: 'block',
			border	: '0px transparent solid',
			clear	: 'both'
		});
		
		
		
		
		
		
		
		
		var instance = this;
		$(this.viewId + ' #groupArea select').change(function(){
			alert("aa");
			console.log($("#groupArea select option:selected").attr('value'));
			console.log($(this).val());
			$('form#scaleArea').remove();
			
			var tmp1 = instance.groupNum;
			instance.groupNum = $(this).val();
			var htmlString = instance._getScaleHtml(instance.scaleUnitString, 
					instance.groupUnitNum * instance.groupNum, 
					instance.groupString, instance.groupUnitNum);
			$(instance.viewId).prepend(htmlString);
			
			
			instance.fromScale = instance.groupUnitNum * instance.groupNum - (instance.groupUnitNum * tmp1 - instance.fromScale)
			instance.toScale = instance.groupUnitNum * instance.groupNum - (instance.groupUnitNum * tmp1 - instance.toScale)
			
			
			instance._selectSliderScale(instance.idFrom, instance.fromScale);
			instance._selectSliderScale(instance.idTo, instance.toScale);
			
			//instance
			instance.sliderComponent = 
				$(instance.viewId + ' select#' + instance.idFrom + ',' +
						instance.viewId + ' select#' + instance.idTo).selectToUISlider();

			
			// adjust slider visual
			$(instance.viewId + ' form#scaleArea').css({
				width	: '600px',
				float	: 'left'
			});
			$(instance.viewId + ' fieldset').css({
				height	: '80px',
				padding	: '60px 40px 0px 20px',
				border	: '1px #dcdcdc solid'
			});
			
			// adjust label on slider
			$(instance.viewId + ' span.ui-slider-label-show').css({
				display		: "block",
				fontSize	: "14px",
				textAlign	: "left",
				width		: "100px",
				marginLeft	: "2px"//,
				//border: "1px black solid"
			});
			
			// adjust label of group on slider
			$(instance.viewId + ' dl.ui-slider-scale dt').css({
				top			: '-70px'
			});
			$(instance.viewId + ' dl.ui-slider-scale dt span').css({
				color		: 'red',
				fontSize	: '14px'
			});
			
			
			console.log("aaa");
			console.log($(instance.viewId + ' select#' + instance.idTo));
			console.log(instance.idFrom);
			console.log(instance.idTo);
			console.log(instance.fromScale);
			console.log(instance.toScale);
			
			
			//$(instance.viewId + ' select#' + instance.idFrom)

			
			$(instance.viewId + ' select#' + instance.idTo).hide();
			$(instance.viewId + ' select#' + instance.idFrom).hide();
			instance._setScaleMovedEvent();
			
			
		});
		
		
	},
	render : function(){
		console.log('call render (dual slider)');
	},
	onAdd : function(element){
		console.log('call onAdd (dual slider)');
	},
	onChange : function(element){
		console.log('called changeModel (dual slider)');
	},
	onRemove : function(element){
		console.log('called removeModel (dual slider)');
	},
	_getScaleHtml : function(scaleUnitString, scaleNum, groupString, groupNum){
		var htmlStr = '';
		htmlStr += '<form id="scaleArea">\n';
		htmlStr += '<fieldset>\n';
		htmlStr += '  <select id="' + this.idFrom + '">\n';
		
		var _htmlStr = '';
		for(var scale=scaleNum; scale>0; scale--){
			if(scale % groupNum == 0){
				var _groupString = (scale / groupNum) + ' ' + 
									groupString + ' ago';
				_htmlStr += '    <optgroup label="' + _groupString + '">\n';
			};
			_htmlStr += '    <option value="' + scale + '<br>' + 
							 scaleUnitString + ' ago">' + 
							 scale + ' ' + scaleUnitString + ' ago</option>\n';
		};
		_htmlStr += '    <option value="Now">Now</option>\n';
		
		htmlStr += _htmlStr
		htmlStr += '  </select>\n';
		htmlStr += '  <select id="' + this.idTo + '">\n';
		htmlStr += _htmlStr
		htmlStr += '  </select>\n';
		htmlStr += '</fieldset>\n';
		htmlStr += '</form>\n';
		
		return htmlStr;
	},
	_getGroupHtml : function(groupMaxNum, groupString){
		var htmlStr = '';
		htmlStr += '<form id="groupArea">\n';
		htmlStr += '  <select>\n';
		
		for(var groupNum=1; groupNum<=groupMaxNum; groupNum++){
			htmlStr += '    <option value="' + groupNum + '">' + 
						groupNum + ' ' + groupString + ' ago' + '</option>\n';
		};
		htmlStr += '  </select>\n';
		htmlStr += '</form>\n';
		
		return htmlStr;
	},
	_selectSliderScale : function(idName, value){
		$('#' + idName + ' option:eq(' + value + ')').attr(
														"selected","selected");
	},
	_getFromToAsArray : function(values){
		// values	: .ui-slider values 
		// 	  		  Ex: [4, 6]
		// return	: [fromMillisecond, toMillisecond]
		//			  the time which means how long ago from now
		
		var fromMillisecond = (this.groupUnitNum * this.groupNum - values[0]) * 
																this.scaleUnit;
		var toMillisecond = (this.groupUnitNum * this.groupNum - values[1]) * 
																this.scaleUnit;
		return [fromMillisecond, toMillisecond];
	},
	_setScaleMovedEvent : function(){
		var instance = this;
		this.sliderComponent.bind("slidechange", function(event, ui) {
			instance.fromScale = ui.values[0];
			instance.toScale = ui.values[1];
			var fromtoMillisecond = instance._getFromToAsArray(ui.values);
			var fromMillisecond = fromtoMillisecond[0];
			var toMillisecond = fromtoMillisecond[1];
			instance.scaleMovedEventFunc(fromMillisecond, toMillisecond);
		});
	},
	setScaleMovedEvent : function(func){
		var instance = this;
		this.scaleMovedEventFunc = func;
		this.sliderComponent.bind("slidechange", function(event, ui) {
			instance.fromScale = ui.values[0];
			instance.toScale = ui.values[1];
			var fromtoMillisecond = instance._getFromToAsArray(ui.values);
			var fromMillisecond = fromtoMillisecond[0];
			var toMillisecond = fromtoMillisecond[1];
			instance.scaleMovedEventFunc(fromMillisecond, toMillisecond);
		});
	}
});

