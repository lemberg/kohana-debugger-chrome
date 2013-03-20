var tabId = chrome.devtools.inspectedWindow.tabId;
var port = chrome.extension.connect({
	name: "Kohana DebugTool"
});

port.postMessage({});

port.onMessage.addListener(function (msg) {
	if (tabId != msg.tabId) return;
	renderPage(msg.content);
});

function renderPage(msg){
	if (msg.errors.length){
		var errors = msg.errors;
		$('data-block').setStyle('display', 'none');
		$('errors-block').set('html', '');
		for (var i = 0; i < errors.length; i++){
			var block = new Element('div', {
				html: errors[i]
			});
			block.inject('errors-block');
		}
		$('errors-block').setStyle('display', 'block');

		return false;
	}
	$('data-block').setStyle('display', 'block');
	$('errors-block').setStyle('display', 'none');
	var configs = getConfigs();
	var menuItems = configs.menu_items;
	generateMenu(menuItems);
	updateBlocks(menuItems, msg.data);

	return true;
}

function generateMenu(menuItems){
	$('menu').set('html', '');
	for (var i = 0; i < menuItems.length; i++){
		var li = new Element('li', {
			html: menuItems[i].name
		});
		li.set('item-key', menuItems[i].key);
		if (i == 0){
			li.addClass('active');
		}
		li.inject('menu');
	}
	return true;
}

function updateBlocks(items, data){
	for (var i = 0; i < items.length; i++){
		$$("#content ." + items[i].key).set('html', '');
		if (typeof data[items[i].key] != 'undefined'){
			switch (items[i].key){
				case 'benchmarks': updateBenchmarks(data[items[i].key]); break;
				case 'queries': updateQueries(data[items[i].key]); break;
				case 'vars': updateVars(data[items[i].key]); break;
				case 'files': updateFiles(data[items[i].key]); break;
				case 'modules': updateModules(data[items[i].key]); break;
				case 'routes': updateRoutes(data[items[i].key]); break;
				case 'customs': updateCustoms(data[items[i].key]); break;
			}

			$$("#content .item-block").setStyle('display', 'none');
			$$($$("#content .item-block")[0]).setStyle('display', 'block');
		}
		else{
			$$("#content ." + items[i].key).set('html', '<div class=\"nodata\">No Data for this tab</div>');
		}
	}
}

function updateBenchmarks(data){
	var block = $$("#content .benchmarks")[0];
	var table = new Element('table', {
		"cellspacing": 0,
		"cellpadding": 0
	});
	table.inject(block);
	var tbody = new Element('tbody');
	tbody.inject(table);
	var tr = new Element('tr',{
		html: "<th align=\"left\">benchmark</th>" +
				"<th align=\"right\">count</th>" +
				"<th align=\"right\">avg time</th>" +
				"<th align=\"right\">total time</th>" +
				"<th align=\"right\">avg memory</th>" +
				"<th align=\"right\">total memory</th>"
	});
	tr.inject(tbody);
	var i = 0;
	for(var group in data){
		if (group == 'application'){
			var tr = new Element('tr', {
				'html': "<th colspan=\"2\" align=\"left\">APPLICATION</th>" +
								"<th align=\"right\">" + (data[group].avg_time * 1000).round(2) + "ms</th>" +
								"<th align=\"right\">" + (data[group].total_time * 1000).round(2) + "ms</th>" +
								"<th align=\"right\">"+ (data[group].avg_memory / 1024).round(3) + " kb</th>" +
								"<th align=\"right\">" + (data[group].total_memory / 1024).round(3) + " kb</th>"
			});
			tr.inject(tbody);
		}
		else{
			var tr = new Element('tr', {
				html: "<th colspan=\"6\">" + group + "</th>"
			});
			tr.inject(tbody);
			for(var row = 0; row < data[group].length; row++){
				i++;
				var tr = new Element('tr', {
					html: "<td align=\"left\">" + data[group][row].name + "</td>" +
						"<td align=\"right\">" + data[group][row].count + "</td>" +
						"<td align=\"right\">" + (data[group][row].avg_time * 1000).round(2) + "ms</td>" +
						"<td align=\"right\">" + (data[group][row].total_time * 1000).round(2) + "ms</td>" +
						"<td align=\"right\">" + (data[group][row].avg_memory / 1024).round(3) + " kb</td>" +
						"<td align=\"right\">" + (data[group][row].total_memory / 1024).round(3) + " kb</td>",
					"class": (i % 2 == 0) ? "even" : "odd"
				});
				tr.inject(tbody);
			}
		}
	}
}

function updateQueries(data){
	var block = $$("#content .queries")[0];
	var table = new Element('table', {
		"cellspacing": 0,
		"cellpadding": 0
	});
	table.inject(block);
	var tbody = new Element('tbody');
	tbody.inject(table);
	var tr = new Element('tr',{
		align: "left",
		html: "<th>#</th>" +
				"<th>query</th>" +
				"<th>time</th>" +
				"<th>memory</th>"
	});
	tr.inject(tbody);

	var counter = 0;
	var data_length = 0;
	for (var db_profile in data.data){
		data_length++;
		var tr = new Element('tr', {
			align: "left",
			html: "<th colspan=\"4\">DATABASE \"" + db_profile.toUpperCase() + "\"</th>"
		});
		tr.inject(tbody);
		for (var i in data.data[db_profile]){
			if (!data.data[db_profile].hasOwnProperty(i)){
				continue;
			}

			var tr;
			if (i == 'total'){
				tr = new Element('tr', {
					html: "<th>&nbsp;</th>" +
							"<th>" + data.data[db_profile][i][0] + " total</th>" +
							"<th>" + (data.data[db_profile][i][1] * 1000).round(3) + " ms</th>" +
							"<th>" + (data.data[db_profile][i][2] / 1024).round(3) + " kb</th>"
				});
			}
			else{
				counter++;
				tr = new Element('tr', {
					html: "<td>" + (parseInt(i) + 1) + "</td>" +
							"<td>" + data.data[db_profile][i].name + "</td>" +
							"<td>" + (data.data[db_profile][i].time * 1000).round(3) + " ms</td>" +
							"<td>" + (data.data[db_profile][i].memory / 1024).round(3) + " kb</td>",
					"class": (counter % 2 == 0) ? "even" : "odd"
				});
			}
			tr.inject(tbody);
		}
	}
	if (data_length > 1){
		tr = new Element('tr', {
			html: "<th colspan=\"2\" align=\"left\">" + data.count + " TOTAL</th>" +
					"<th>" + (data.time * 1000).round(3) + " ms</th>" +
					"<th>" + (data.memory / 1024).round(3) + " kb</th>"
		});
		tr.inject(tbody);
	}
}

function updateVars(data){
	var block = $$("#content .vars")[0];
	var ul = new Element('ul', {
		html: "<li class=\"active\" vars-name=\"post\">POST</li>" +
				"<li vars-name=\"get\">GET</li>" +
				"<li vars-name=\"files\">FILES</li>" +
				"<li vars-name=\"server\">SERVER</li>" +
				"<li vars-name=\"cookie\">COOKIE</li>" +
				"<li vars-name=\"session\">SESSION</li>",
		"class": "varmenu"
	});
	ul.inject(block);

	var first = true;
	for (var i in data){
		var style = "display: none;";
		if (first){
			first = false;
			style = "";
		}
		var div = new Element("div", {
			"class": "var-item",
			style: style,
			html: data[i],
			id: "vars-" + i
		});
		div.inject(block);
	}
}

function updateFiles(data){
	var block = $$("#content .files")[0];
	var table = new Element('table', {
		"cellspacing": 0,
		"cellpadding": 0
	});
	table.inject(block);
	var tbody = new Element('tbody');
	tbody.inject(table);

	var tr = new Element("tr", {
		align: "left",
		html: "<th>#</th>" +
				"<th>file</th>" +
				"<th>size</th>" +
				"<th>lines</th>"
	});
	tr.inject(tbody);

	for (var i = 0; i < data.list.length; i++){
		var tr = new Element('tr', {
			"class": ((i + 1) % 2 == 0) ? "even" : "odd",
			html: "<td>" + (i + 1) + "</td>" +
					"<td>" + data.list[i].name + "</td>" +
					"<td>" + data.list[i].size + "</td>" +
					"<td>" + data.list[i].lines + "</td>"
		});
		tr.inject(tbody);
	}
	var tr = new Element("tr", {
		align: "left",
		html: "<th colspan=\"2\">total</th>" +
				"<th>" + (data.total_size / 1000).round(2) + " kB</th>" +
				"<th>" + data.total_lines + "</th>"
	});
	tr.inject(tbody);
}

function updateModules(data){
	var block = $$("#content .modules")[0];
	var table = new Element('table', {
		"cellspacing": 0,
		"cellpadding": 0
	});
	table.inject(block);
	var tbody = new Element('tbody');
	tbody.inject(table);

	var tr = new Element("tr", {
		align: "left",
		html: "<th>#</th>" +
				"<th>name</th>" +
				"<th>rel path</th>" +
				"<th>abs path</th>"
	});
	tr.inject(tbody);

	for (var i = 0; i < data.list.length; i++){
		var tr = new Element('tr', {
			"class": ((i + 1) % 2 == 0) ? "even" : "odd",
			html: "<td>" + (i + 1) + "</td>" +
					"<td>" + data.list[i].name + "</td>" +
					"<td>" + data.list[i].path + "</td>" +
					"<td>" + data.list[i].abs_path + "</td>"
		});
		tr.inject(tbody);
	}
}

function updateRoutes(data){
	var block = $$("#content .routes")[0];
	var table = new Element('table', {
		"cellspacing": 0,
		"cellpadding": 0
	});
	table.inject(block);
	var tbody = new Element('tbody');
	tbody.inject(table);

	var tr = new Element("tr", {
		align: "left",
		html: "<th>#</th>" +
				"<th>name</th>"
	});
	tr.inject(tbody);

	for (var i = 0; i < data.list.length; i++){
		var tr = new Element('tr', {
			"class": ((i + 1) % 2 == 0) ? "even" : "odd",
			html: "<td>" + (i + 1) + "</td>" +
					"<td>" + data.list[i].name + "</td>"
		});
		if (data.list[i].current){
			tr.addClass('current');
		}
		tr.inject(tbody);
	}
}


function updateCustoms(data){
	var block = $$("#content .customs")[0];
	var ul = new Element('ul', {
		"class": "sectionmenu"
	});
	ul.inject(block);

	var counter = 0;
	for (var tab in data){
		var style = 'display: none;';
		if (counter == 0){
			style = '';
		}
		var tabId = 'customs-' + counter++;
		var li = new Element('li', {
			"tab-id": tabId,
			html: tab
		});
		if (counter - 1 == 0){
			li.addClass('active');
		}
		li.inject(ul);

		var div = new Element('div', {
			style: style,
			id: tabId,
			html: "<pre>" + data[tab] + "</pre>"
		});
		div.inject(block);
	}
}