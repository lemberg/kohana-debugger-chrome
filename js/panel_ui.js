$(document).addEvent('domready', function(){
	$("menu").addEvent("click:relay(li)", function(){
		$$("#content .item-block").setStyle('display', 'none');
		$$("#menu li").removeClass('active');
		this.addClass('active');
		$$("#content ." + this.get('item-key')).setStyle('display', 'block');
	});

	$('content').addEvent('click:relay(.varmenu li)', function(){
		$$('#content .varmenu li').removeClass('active');
		this.addClass('active');
		$$('#content .var-item').setStyle('display', 'none');
		$$('#content #vars-' + this.get('vars-name')).setStyle('display', 'block');
	});

	$('content').addEvent('click:relay(.sectionmenu li)', function(){
		$$('.sectionmenu li').removeClass('active');
		this.addClass('active');
		$$('.customs div').setStyle('display', 'none');
		$(this.get('tab-id')).setStyle('display', 'block');
	});
});
