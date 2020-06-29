const compile = require("./index.js").compile

const testDocs = [
	[{"type":"paragraph","children":[{"text":"Gandalf","bold":true},{"text":" the "},{"text":"Grey","color":"#aaa"}]}],
	[
		{"type":"paragraph","children":[{"text":"Gandalf the Dead."}]},
		{"type":"paragraph","children":[{"text":"Second paragraph—the Balrog of paragraphs."}]}
	]
]

console.log(compile(testDocs));

