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




  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = Helpers.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },

  toggleCodeBlock(editor) {
    const isActive = Helpers.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    )
  },
}

export default Helpers;