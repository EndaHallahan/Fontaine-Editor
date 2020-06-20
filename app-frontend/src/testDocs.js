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
			{type: "folder", isDirectory: true, title: "Test Folder", id: "339b5bc4-6869-4f6b-802d-4179d1deab71", threads: {
					"484039d5-b3d8-4e48-a2a7-36fb136c2630": {knot: "First event."}
				},

			children: [
				{type: "file", title: "File 0", id: "d53e22d3-b743-414d-beab-8ea40c56adef", summary: "Test summary.", threads: {
						"3da52b10-d982-4f30-8c02-7fbafb8a353d": {knot: "He is now implementing a feature that will later make him go bald."}
					},},
				{type: "file", title: "File 1", id: "156989b0-ffff-4ff1-9228-23f0f5c414d8", threads: {
					"484039d5-b3d8-4e48-a2a7-36fb136c2630": {knot: "Second event."}
				},}
			]},
			{type: "file", title: "File 2", id: "f5bfb84b-7f56-4028-9bac-53f3e9b5af9b", summary: "Stay calm; this is just a test.", status: "Rough Draft", threads: {
					"3da52b10-d982-4f30-8c02-7fbafb8a353d": {knot: "He goes bald."},
					"484039d5-b3d8-4e48-a2a7-36fb136c2630": {knot: "third event."}
				},
			}
		]},
		{type: "trash", title: "Trash", permanent: true, id:"04279288-7cdc-486c-a279-9c0f7a698a31"}
	],
	lastDocument: "f5bfb84b-7f56-4028-9bac-53f3e9b5af9b",
	projectTags: [
		"pov:Abigail",
		"pov:John",
		"pov:Benjamin",
		"time:Evening",
		"time:Afternoon",
		"Needs Revising",
	],
	threads: {
		"3da52b10-d982-4f30-8c02-7fbafb8a353d": {
			name: "A befuddled programmer attempts to write a program that's way over his head.",
			colour: "#ff0000",
		},
		"484039d5-b3d8-4e48-a2a7-36fb136c2630": {
			name: "Second thread of arbitrary nature.",
			colour: "#00ff00",
		}
	},
}

let themeIndex = ["Light", "Warm", "Terminal", "AmberTerminal", "WhiteTerminal",];

let themes = {
	Light: {
		description: "Default light theme.",
		author: "",
		theme: {
			"accent-colour": "#1E90FF",
			"accent-colour-contrast": "#FFFFFF",
			"primary-colour": "#fcfcfc",
			"primary-colour-contrast": "Black",
			"primary-colour-shade": "#E6E6EA",
			"primary-colour-highlight": "#999999",
			"primary-colour-lowlight": "#888888",
		}
	},
	Warm: {
		description: "Default warm theme.",
		author: "",
		theme: {
			"accent-colour": "#1E90FF",
			"accent-colour-contrast": "#FFFFFF",
			"primary-colour": "#FFFFE9",
			"primary-colour-contrast": "Black",
			"primary-colour-shade": "#FDECAA",
			"primary-colour-highlight": "#999900",
			"primary-colour-lowlight": "#888800",
			"appbar-colour": "#FDDC88",
			"footer-colour": "#FDDC88",
		}
	},
	Terminal: {
		description: "Yes, like in The Matrix.",
		author: "",
		theme: {
			"primary-colour": "#1F1F1F",
			"primary-colour-contrast": "limegreen",
			"primary-colour-shade": "#1F1F1F",
			"primary-colour-lowlight": "limegreen",
			"primary-colour-highlight": "limegreen",
			"secondary-colour": "#1F1F1F",
			"secondary-colour-contrast": "limegreen",
			"secondary-colour-shade": "limegreen",
			"accent-colour": "white",
			"accent-colour-contrast": "#1F1F1F",
			"editor-container-colour": "#1F1F1F",
			"editor-background-colour": "#1F1F1F",
			"editor-text-colour": "limegreen",
			"editor-drop-shadow": "none",
			"editor-border-colour": "limegreen",
			"dropdown-colour": "limegreen",
		}
	},
	AmberTerminal: {
		description: "Creator's choice.",
		author: "",
		theme: {
			"primary-colour": "#1F1F1F",
			"primary-colour-contrast": "#FCB831",
			"primary-colour-shade": "#1F1F1F",
			"primary-colour-lowlight": "#FCB831",
			"primary-colour-highlight": "#FCB831",
			"secondary-colour": "#1F1F1F",
			"secondary-colour-contrast": "#FCB831",
			"secondary-colour-shade": "#FCB831",
			"accent-colour": "white",
			"accent-colour-contrast": "#1F1F1F",
			"editor-container-colour": "#1F1F1F",
			"editor-background-colour": "#1F1F1F",
			"editor-text-colour": "#FCB831",
			"editor-drop-shadow": "none",
			"editor-border-colour": "#FCB831",
			"dropdown-colour": "#FCB831",
		}
	},
	WhiteTerminal: {
		description: "Ultra dark.",
		author: "",
		theme: {
			"primary-colour": "#1F1F1F",
			"primary-colour-contrast": "#FFFFFF",
			"primary-colour-shade": "#1F1F1F",
			"primary-colour-lowlight": "#FFFFFF",
			"primary-colour-highlight": "#FFFFFF",
			"secondary-colour": "#1F1F1F",
			"secondary-colour-contrast": "#FFFFFF",
			"secondary-colour-shade": "#FFFFFF",
			//"accent-colour": "white",
			"accent-colour-contrast": "#1F1F1F",
			"editor-container-colour": "#1F1F1F",
			"editor-background-colour": "#1F1F1F",
			"editor-text-colour": "#FFFFFF",
			"editor-drop-shadow": "none",
			"editor-border-colour": "#FFFFFF",
			"dropdown-colour": "#FFFFFF",
		}
	}
}

export {documents, documentIndex, themeIndex, themes};