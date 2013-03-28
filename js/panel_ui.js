$(document).addEvent('domready', function(){
	$("requests").addEvent("click:relay(.menu li)", function(e){
		if (!e.target.match('.delete')){
			$$("#requests-info-wrapper .request-info").setStyle('display', 'none');
			$$("#requests .menu li").removeClass('active');
			this.addClass('active');
			$$("#requests-info-wrapper ." + this.get('tab-selector')).setStyle('display', 'block');
		}
	});
	$("requests").addEvent("click:relay(.menu .delete)", function(){
		var menuItem = this.getParent('li');
		var isActive = menuItem.hasClass('active');
		$$("#requests-info-wrapper ." + menuItem.get('tab-selector')).destroy();
		menuItem.destroy();
		var menuItems = $$('#requests .menu li');
		if (menuItems.length){
			if (isActive){
				menuItems[0].addClass('active');
				$$("#requests-info-wrapper ." + menuItems[0].get('tab-selector')).setStyle('display', 'block');
			}
		}
		else{
			$('data-block').setStyle('display', 'none');
			$('errors-block').setStyle('display', 'block');
			$('errors-block').set('html', '<div>No requests</div>');
		}
	});
	$("requests-info-wrapper").addEvent("click:relay(.menu li)", function(){
		var parent = this.getParent('.request-info');
		parent.getElements(".content .item-block").setStyle('display', 'none');
		parent.getElements(".menu li").removeClass('active');
		this.addClass('active');
		parent.getElements(".content ." + this.get('item-key')).setStyle('display', 'block');
	});

	$("requests-info-wrapper").addEvent('click:relay(.content .varmenu li)', function(){
		var parent = this.getParent('.request-info');
		parent.getElements('.content .varmenu li').removeClass('active');
		this.addClass('active');
		parent.getElements('.content .var-item').setStyle('display', 'none');
		parent.getElements('.content .vars-' + this.get('vars-name')).setStyle('display', 'block');
	});

	$("requests-info-wrapper").addEvent('click:relay(.content .sectionmenu li)', function(){
		var parent = this.getParent('.request-info');
		parent.getElements('.sectionmenu li').removeClass('active');
		this.addClass('active');
		parent.getElements('.customs div').setStyle('display', 'none');
		parent.getElements('.' + this.get('tab-selector')).setStyle('display', 'block');
	});
});
