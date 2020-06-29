function execute(args) {
	return compile(args.docList, args.options);
}

function compile(docList, options) {
	let output = "";
	docList.forEach(doc => {
		output += docToMMD(doc);
	});
	return output;
}

function docToMMD(doc) {
	let output = "";
	doc.forEach(node => {
		output += parseNode(node);
	});
	return output;
}

function parseNode(node) {
	let output = "";
	if (node.text) {
		let text = node.text;
		let {openStack, closeStack} = matchMarks(node);
		output += `${openStack.join("")}${text}${closeStack.join("")}`
	}
	if (node.children) {
		node.children.forEach(child => {
			output += parseNode(child);
		})
	}
	if (node.type === "paragraph") {
		output += "\n";
	}
	return output;
}

function matchMarks(node) {
	openStack = [];
	closeStack = [];

	if (node.bold && node.italic) {
		openStack.unshift("***");
		closeStack.push("***");
	}

	if (node.bold && !node.italic) {
		openStack.unshift("**");
		closeStack.push("**");
	}

	if (!node.bold && node.italic) {
		openStack.unshift("*");
		closeStack.push("*");
	}

	return {openStack, closeStack}
	
}

module.exports = {execute, compile}