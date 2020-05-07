import {Quill} from 'react-quill';

let Block = Quill.import('blots/block');

class DocumentDivider extends Block {
	static create(id) {
		let node = super.create();
		node.contentEditable = 'false';
	}
}
DocumentDivider.blotName = "documentDivider";
DocumentDivider.className = "document-container";

export default DocumentDivider; 