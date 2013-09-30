document.addEvent('domready', function(){
	var Table = new Class({
		content: null,

		toElement: function(){
			return this.content;
		},

		initialize: function(headers, data){
			this.content = new Element('table').addClass('data');
			var head = new Element('tr').inject(new Element('thead').inject(this.content));
			headers.forEach(function(name){
				var td = new Element('th').set('text', name.name).inject(head);
				if(name.styles){
					td.setStyles(name.styles);
				}
			});

			var body = new Element('tbody').inject(this.content);
			data.forEach(function(row){
				var tr = new Element('tr');
				headers.forEach(function(name){
					var value = row[name.identifier];
					var td = new Element('td').inject(tr);

					if(name.callback){
						value = name.callback(value);
					}

					td.set('text', value);
				});
				tr.inject(body);
			});
		}
	});

	var OpenableTable = new Class({
		Extends: Table,

		header: null,

		initialize: function(headers, data, title, open){
			this.parent(headers, data);

			var accordion = new Element('div.accordion');
			this.header = new Element('div.title').set('text', title).inject(accordion);

			this.content.inject(accordion);
			this.content = accordion;

			if(open){
				this.open();
			}

			this.header.addEvent('click', function(e){
				e.stop();
				if(this.hasClass('open')){
					this.close();
				} else {
					this.open();
				}
			});
		},

		open: function(){
			this.header.addClass('open');
		},

		close: function(){
			this.header.removeClass('open');
		}
	});

	var Block = new Class({
		Implements: [Events],
		content: null,
		elements: {},
		tabs: {},
		activeTab: null,

		toElement: function(){
			return this.content;
		},

		initialize: function(){
			this.content = document.getElement('.right-box.template').clone().removeClass('template');
			this.elements.menu = this.content.getElement('.list-box ul');

			this.content.getElement('a.close').addEvent('click', function(e){
				e.stop();
				this.hide();
			}.bind(this));
		},

		addTab: function(name, tab){
			this.tabs[this.name(name)] = tab;
			this.tabs[this.name(name)].toElement().inject(this.content);

			var $this = this;

			// menu item
			new Element('a').set({
				'data-button': this.name(name),
				'text': name
			}).addEvent('click', function(e){
				e.stop();
				if(this.hasClass('active')) return;

				$this.setActive(this.get('data-button'));
			}).inject(new Element('li').inject(this.elements.menu));

			return this;
		},

		setActive: function(name){
			if(this.activeTab){
				this.tabs[this.activeTab].hide();
				this.elements.menu.getElement('a.active').removeClass('active');
			}

			this.activeTab = this.name(name);
			this.tabs[this.name(name)].show();
			this.elements.menu.getElement('a[data-button="' + this.name(name) + '"]').addClass('active');

			return this;
		},

		name: function(name){
			return name.trim().toLowerCase().replace(/\s/g, '-');
		},

		show: function(){
			this.content.getParent('.split-view').addClass('split-view-open');
			this.content.removeClass('hide');
			this.fireEvent('show');

			return this;
		},

		hide: function(){
			this.content.getParent('.split-view').removeClass('split-view-open');
			this.content.addClass('hide');
			this.fireEvent('hide');

			return this;
		}
	});

	var Tab = new Class({
		content: null,

		toElement: function(){
			return this.content;
		},

		initialize: function(){
			this.content = document.getElement('.right-box.template .tab.template').clone().removeClass('template').removeClass('tab');

			if(Object.getLength(arguments)){
				this.content.getElement('.no_data').destroy();
				Object.values(arguments).forEach(function(el){
					if(!el.toElement) return;
					el.toElement().inject(this.content.getElement('.text'));
				}.bind(this));
			}

			window.addEvent('resize', function(){
				this.content.getElement('.text').setStyle('height', (window.getSize().y - 42) + 'px');
			}.bind(this)).fireEvent('resize');
		},

		add: function(el){
			if(typeOf(el) == 'element'){
				el.inject(this.content.getElement('.text'));
			} else if(typeOf(el) == 'object') {
				el.toElement().inject(this.content.getElement('.text'));
			}

			var no_data = this.content.getElement('.no_data')
			if(no_data) no_data.destroy();

			return this;
		},

		show: function(){
			this.content.removeClass('hide');
			return this;
		},

		hide: function(){
			this.content.addClass('hide');
			return this;
		}
	});

	var Panel = new new Class({
		content: null,
		elements: {},
		blocks: {},
		activeBlock: null,
		count: 0,

		initialize: function(){
			this.content = document.getElement('.split-view');
			this.elements.requests = this.content.getElement('#requests-grid');
		},

		push: function(request){
			var data = this.headersParse(request);
			if(!data) return this;

			this.count++;
			var index = 'block-' + this.count;
			this.createRow(data, index);
			this.addBlock(data, index);

			this.blocks[index].setActive('Banchmarks');
		},

		addBlock: function(data, index){
			this.blocks[index] = new Block();
			this.blocks[index].toElement().inject(this.content);
			this.blocks[index].addEvent('hide', function(){
				var el = this.content.getElement('td.td-pointer.selected');
				if(el) el.removeClass('selected');
			}.bind(this));

			var benchmarksTab = new Tab(new OpenableTable([
				{name: 'Count', identifier: 'count'},
				{name: 'Total Time', identifier: 'total_time', callback: function(value){ return value.round(4) + ' s'; }},
				{name: 'Total Memory', identifier: 'total_memory', callback: function(value){ return (value / 1024).round(2) + ' KiB'; }},
			], [data.data.benchmarks.application], 'Application', true));

			Object.each(data.data.benchmarks, function(stats, name){ console.log(stats, typeOf(stats), name, name == 'application');
				if(name == 'application') return;
				benchmarksTab.add(new OpenableTable([
					{name: 'Name', identifier: 'name'},
					{name: 'Count', identifier: 'count'},
					{name: 'Time', identifier: 'total_time', callback: function(value){ return value.round(4) + ' s'; }},
					{name: 'Memory', identifier: 'total_memory', callback: function(value){ return (value / 1024).round(2) + ' KiB'; }},
				], stats, name, true));
			});

			this.blocks[index].addTab('Banchmarks', benchmarksTab);

			if(data.data.queries.count){
				var queriesTab = new Tab();

				Object.each(data.data.queries.data, function(database, name){console.log(database, name);
					queriesTab.add(new OpenableTable([
						{name: 'Query', identifier: 'name'},
						{name: 'Time', identifier: 'time', styles: {width: '100px'}, callback: function(value){ return value.round(4) + ' s'; }},
						{name: 'Memory', identifier: 'memory', styles: {width: '100px'}, callback: function(value){ return (value / 1024).round(2) + ' KiB'; }},
					], database.list, name, true));
				}.bind(this));

				this.blocks[index].addTab('DB Queries', queriesTab);
			}
			else
			{
				this.blocks[index].addTab('DB Queries', new Tab());
			}

			if(data.data.routes.list.length){
				this.blocks[index].addTab('Routes', new Tab(new Table([
					{name: 'Route', identifier: 'name'},
					{name: 'Current', identifier: 'current', styles: {width: '100px'}, callback: function(value){ return value ? 'yes' : ''; }},
				], data.data.routes.list)));
			}
			else
			{
				this.blocks[index].addTab('Routes', new Tab());
			}

			if(data.data.files.list.length){
				this.blocks[index].addTab('Files', new Tab(new Table([
					{name: 'Path', identifier: 'name'},
					{name: 'Lines', identifier: 'lines', styles: {width: '100px'}},
					{name: 'Size', identifier: 'size', styles: {width: '100px'}, callback: function(value){ return (value / 1024).round(2) + ' KiB'; }},
				], data.data.files.list)));
			}
			else
			{
				this.blocks[index].addTab('Files', new Tab());
			}

			if(data.data.files.list.length){
				this.blocks[index].addTab('Modules', new Tab(new Table([
					{name: 'Name', identifier: 'name', styles: {width: '150px'}},
					{name: 'Path', identifier: 'path'}
				], data.data.modules.list)));
			}
			else
			{
				this.blocks[index].addTab('Modules', new Tab());
			}
		},

		createRow: function(data, index){
			var row = this.elements.requests.getElement('tr.template').clone().removeClass('hide').removeClass('template');
			row.store('index', index);
			row.getElement('.data-path').set('text', data.request.request.url);
			row.getElement('.data-method').set('text', data.request.request.method);
			row.getElement('.data-status').set('text', data.request.response.status);
			row.getElement('.data-status-text').set('text', data.request.response.statusText);
			row.getElement('.data-type').set('text', data.headers['Content-Type']);
			row.getElement('.data-memory').set('text', (data.data.benchmarks.application.total_memory / 1024).round(2) + ' KiB');
			row.getElement('.data-time').set('text', data.data.benchmarks.application.total_time.round(4) + ' s');
			row.inject(this.elements.requests.getElement('tbody'));

			var $this = this;

			row.getElement('td.td-pointer').addEvent('click', function(e){
				e.stop();
				if(this.hasClass('selected')) return;

				if($this.activeBlock){
					$this.blocks[$this.activeBlock].hide();
				}

				$this.activeBlock = this.getParent('tr').retrieve('index');
				$this.blocks[$this.activeBlock].show();

				this.getParent('table').getElements('td.selected').removeClass('selected');
				this.addClass('selected');
			});

			return this;
		},

		headersParse: function(request){
			var headers = request.response.headers;
			var data = null;
			var hdrs = {};

			for(var i=0; i<headers.length; i++){
				if(headers[i].name == 'X-Kohana-Debugger'){
					data = JSON.parse(headers[i].value);
				}

				hdrs[headers[i].name] = headers[i].value;
			}

			if(data){
				return {
					request: request,
					headers: hdrs,
					data: data
				};
			}

			return null;
		}
	});

	chrome.devtools.network.getHAR(function(result){
		var entries = result.entries;

		if (!entries.length) return;

		for (var i = 0; i < entries.length; ++i){
			Panel.push(entries[i]);
		}
	});

	chrome.devtools.network.onRequestFinished.addListener(function(request){
		Panel.push(request);
	});
});
