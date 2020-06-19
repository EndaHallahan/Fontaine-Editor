import { Editor, Operation, Path } from 'slate';

function createHistory(ops) {
	return {
		undo: [...ops],
		redo: [],
	}
}

function withReduxHistory(editor, docId) {
	const extEditor = editor;
	const {apply} = extEditor;
	return editor;
}

export default withReduxHistory;