$(document).addEvent('domready', function(){
	$("requests").addEvent("click:relay(.menu li)", function(e){
		if (!e.target.match('.delete')){
			var activeTab = $$("#requests .menu li.active");
			if (activeTab.length) {
				var activeInfoTab = $$("#requests-info-wrapper ." + activeTab[0].get('tab-selector') + ' .menu .active');
				if (activeInfoTab.length) {
					var needToActivate = $$("#requests-info-wrapper ." + this.get('tab-selector') + " .menu li").filter('[item-key=\"' + activeInfoTab[0].get('item-key') + "\"]");
					if (needToActivate.length){
						activateInfoTab(needToActivate[0]);
					}

					var activeVarsTab = $$("#requests-info-wrapper ." + activeTab[0].get('tab-selector') + ' .content .varmenu li.active');
					if (activeVarsTab.length) {
						var varsName = activeVarsTab[0].get('vars-name');
						var selectTab = $$("#requests-info-wrapper ." + this.get('tab-selector') + " .varmenu li").filter('[vars-name=\"' + varsName + "\"]");
						if (selectTab.length) {
							activateVarsTab(selectTab[0]);
						}
					}

					var activeCustomsTab = $$("#requests-info-wrapper ." + activeTab[0].get('tab-selector') + ' .content .sectionmenu li.active');
					if (activeCustomsTab.length) {
						var tabSelector = activeCustomsTab[0].get('tab-selector');
						var parent = $$("#requests-info-wrapper ." + this.get('tab-selector'))[0];
						var selectTab = parent.getElements('.sectionmenu li').filter('[tab-selector=\"' + tabSelector + "\"]");
						if (selectTab.length) {
							activateCustomsTab(selectTab[0]);
						}
					}
				}
			}
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
		activateInfoTab(this);
	});

	$("requests-info-wrapper").addEvent('click:relay(.content .varmenu li)', function(){
		activateVarsTab(this);
	});

	$("requests-info-wrapper").addEvent('click:relay(.content .sectionmenu li)', function(){
		activateCustomsTab(this);
	});
});

function activateInfoTab(menuItem) {
	var parent = menuItem.getParent('.request-info');
	parent.getElements(".content .item-block").setStyle('display', 'none');
	parent.getElements(".menu li").removeClass('active');
	menuItem.addClass('active');
	parent.getElements(".content ." + menuItem.get('item-key')).setStyle('display', 'block');
}


function activateVarsTab(menuItem) {
	var parent = menuItem.getParent('.request-info');
	parent.getElements('.content .varmenu li').removeClass('active');
	menuItem.addClass('active');
	parent.getElements('.content .var-item').setStyle('display', 'none');
	parent.getElements('.content .vars-' + menuItem.get('vars-name')).setStyle('display', 'block');
}

function activateCustomsTab(menuItem) {
	var parent = menuItem.getParent('.request-info');
	parent.getElements('.sectionmenu li').removeClass('active');
	menuItem.addClass('active');
	parent.getElements('.customs div').setStyle('display', 'none');
	parent.getElements('.' + menuItem.get('tab-selector')).setStyle('display', 'block');
}
