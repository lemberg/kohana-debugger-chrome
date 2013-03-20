var configs = getConfigs();
var BLOCK_ID = configs.debug_tool_block_id;

function getData(){
	var result = {
		errors: [],
		data: {}
	};

	var block = $(BLOCK_ID);
	if (block){
		if (!parseInt(block.get('nodata'))){
			var items = configs.menu_items;
			for (var i = 0; i < items.length; i++){
				var blocks = $$('#' + BLOCK_ID + ' .' + configs.data_block_class_prefix + items[i].key);
				if (!blocks.length){
					continue;
				}

				var jsonString = blocks[0].get('html');
				try{
					result.data[items[i].key] = JSON.decode(jsonString);
				}
				catch(e){}
			}
		}
		else {
			result.errors.push('No Data for this page');
		}
	}
	else {
		result.errors.push('Kohana DebugTool Plugin isn\'t active on this page');
	}
	return result;
}

chrome.extension.onMessage.addListener(function (message, sender) {
	chrome.extension.sendMessage(getData());
});
chrome.extension.sendMessage(getData());
