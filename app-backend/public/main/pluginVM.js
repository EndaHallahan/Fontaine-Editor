const vm = require('vm');

/* 
-- NOTE: THIS IS UNSAFE! --

This uses Node's built-in vm module at the moment, which is not great for security! 
A better alternative would be VM2: https://github.com/patriksimek/vm2. However, I 
was not able to get VM2 to require modules by relative paths, and I've about given up. 
More than six lines of documentation on how to do this would have been nice!

So, for now, we're using plain ol' vm with the intention to FIX THIS LATER.
*/

async function runPlugin(pluginPath, pluginArgs) {
	console.log("ARGS: ", pluginArgs)
	let context = {pluginArgs, require, result: undefined}
	pPluginPath = pluginPath.replace(/\\/g, "/");
	const code = `
		const plugin = require('${pPluginPath}');
		result = plugin.execute(pluginArgs);
	`;
	vm.createContext(context);
	vm.runInContext(code, context);
	return context.result;
}

module.exports = {runPlugin}