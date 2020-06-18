import { Editor, Transforms } from "slate";

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const ALIGN_TYPES = ["align-left", "align-right", "align-center", "align-justify"]

const Helpers = {
	isBlockActive(editor, format) {
		const [match] = Editor.nodes(editor, {
		    match: n => n.type === format,
		});
		return !!match;
	},

	isBlockGroupActive(editor, formats) {
		const [match] = Editor.nodes(editor, {
		    match: n => formats.includes(n.type),
		});
		return !!match;
	},

	toggleBlock(editor, format) {
		const isActive = this.isBlockActive(editor, format);
		const isList = LIST_TYPES.includes(format);
		const isAlign = ALIGN_TYPES.includes(format);
		Transforms.unwrapNodes(editor, {
			match: n => LIST_TYPES.includes(n.type) || ALIGN_TYPES.includes(n.type),
			split: true,
		})
		let setType;
		if (isActive) {
			setType = "paragraph";
		} else if (isList) {
			setType = "list-item";
		} else if (isAlign) {
			setType = "paragraph";
		} else {
			setType = format;
		}
		Transforms.setNodes(editor, {
			type: setType,
		})
		if (!isActive && (isList || isAlign)) {
			const block = { type: format, children: [] }
			Transforms.wrapNodes(editor, block)
		}
	},

	isMarkActive(editor, format) {
		const marks = Editor.marks(editor);
		return marks ? marks[format] === true : false;
	},

	toggleMark(editor, format) {
		const isActive = this.isMarkActive(editor, format)
	  	if (isActive) {
	    	Editor.removeMark(editor, format)
	  	} else {
	    	Editor.addMark(editor, format, true)
	  	}
	},

	tabHandler(editor) {
		const orderedListActive = this.isBlockActive(editor, "numbered-list");
		const unorderedListActive = this.isBlockActive(editor, "bulleted-list");
		if (orderedListActive) {
			this.lists.increaseListDepth(editor, "numbered-list");
		} else if (unorderedListActive) {
			this.lists.increaseListDepth(editor, "bulleted-list");
		} else {
			editor.insertText("\t");
		}
	},

	lists: {
		increaseListDepth(editor, type) {
			Transforms.setNodes(editor, {type: "list-item"});
			Transforms.wrapNodes(editor, {type})
		},

		decreaseListDepth(editor, type) {
			Transforms.unwrapNodes(editor, {
				match: n => LIST_TYPES.includes(n.type),
				split: true,
			});
		}
	}
}

export default Helpers;