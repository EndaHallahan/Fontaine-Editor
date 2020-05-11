import { Editor, Transforms, Text } from "slate";

const Helpers = {
	isBlockActive(editor, format) {

	},

	toggleBlock(editor, format) {

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
}

export default Helpers;