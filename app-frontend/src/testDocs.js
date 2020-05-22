//Remove me eventually!

let documents = {
	"d53e22d3-b743-414d-beab-8ea40c56adef": {
		ops: [
     		{
		      type: 'paragraph',
		      children: [
		      	{ text: 'Gandalf', bold: true },
		      	{ text: ' the ' },
		      	{ text: 'White', color: '#aaa' }
		      ],
		    },
   		]
	},
	"156989b0-ffff-4ff1-9228-23f0f5c414d8": {
		ops: [
			{
		      type: 'paragraph',
		      children: [
		      	{ text: 'Gandalf', bold: true },
		      	{ text: ' the ' },
		      	{ text: 'Grey', color: '#aaa' }
		      ],
		    },
   		]
	},
	"f5bfb84b-7f56-4028-9bac-53f3e9b5af9b": {
		ops: [
     		{
		      type: 'paragraph',
		      children: [{ text: 'Gandalf the Dead.' }],
		    },
		    {
		      type: 'paragraph',
		      children: [{ text: 'Second paragraph—the Balrog of paragraphs.' }],
		    },
   		]
	}
}

let documentIndex = {
	projectTitle: "Test",
	documents: [
		{type: "manuscript", title: "Manuscript", permanent: true, expanded: true, id:"d12d04aa-7f82-48d6-a39d-362eade665f9", children: [
			{type: "folder", isDirectory: true, title: "Test Folder", id: "339b5bc4-6869-4f6b-802d-4179d1deab71", children: [
				{type: "file", title: "File 0", id: "d53e22d3-b743-414d-beab-8ea40c56adef", summary: "Test summary."},
				{type: "file", title: "File 1", id: "156989b0-ffff-4ff1-9228-23f0f5c414d8"}
			]},
			{type: "file", title: "File 2", id: "f5bfb84b-7f56-4028-9bac-53f3e9b5af9b", summary: "Stay calm; this is just a test.", status: "Rough Draft"}
		]},
		{type: "trash", title: "Trash", permanent: true, id:"04279288-7cdc-486c-a279-9c0f7a698a31"}
	],
	lastDocument: "d12d04aa-7f82-48d6-a39d-362eade665f9",
	projectTags: [
		"pov:Abigail",
		"pov:John",
		"pov:Benjamin",
		"time:Evening",
		"time:Afternoon",
		"Needs Revising",
	],
}

export {documents, documentIndex};