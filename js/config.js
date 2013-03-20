function getConfigs(){
	return {
		debug_tool_block_id: "Kohana-DebugTool-JSON-data",
		data_block_class_prefix: "kohana-debug-tool-",
		menu_items: [
			{
				name: "Benchmarks",
				key: "benchmarks"
			},
			{
				name: "Database Queries",
				key: "queries"
			},
			{
				name: "Vars",
				key: "vars"
			},
			{
				name: "Files",
				key: "files"
			},
			{
				name: "Modules",
				key: "modules"
			},
			{
				name: "Routes",
				key: "routes"
			},
			{
				name: "Customs",
				key: "customs"
			}
		]
	};
}
