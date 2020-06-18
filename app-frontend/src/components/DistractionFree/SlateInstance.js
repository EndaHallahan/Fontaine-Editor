import React, { useCallback, useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { HotKeys } from 'react-hotkeys';

import { Element, Leaf } from "../../utils/editor/renderElement";
import Helpers from "../../utils/editor/Helpers";
import PopupToolbar from "./PopupToolbar";

const keyMap = {
  	
};

const SlateInstance = React.memo((props) => {
	const editor = useMemo(() => withReact(createEditor()), []);
	props.createHoistedEditor(props.docId, editor);
	const defaultContents = [{
	  	type: 'paragraph',
	  	children: [{ text: '' }],
	}];
  	let value = props.value && props.value.ops ? props.value.ops : defaultContents;
  	const updateDocument = (inValue) => {
  		if (inValue !== value) {
  			props.updateDoc(props.docId, inValue);
  		}
  	}
  	const renderElement = useCallback(props => <Element {...props} />, []);
  	const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  	const handlers = {
  		
  	}
  	return (
  		<HotKeys keyMap={keyMap} handlers={handlers}>
	  		<div 
	  			className="slate-wrapper"
	  			onFocus={() => props.setActive(props.docId)}
	    	>
		    	<Slate 
		    		editor={editor} 
		    		value={value} 
		    		onChange={updateDocument}
		    	>
		    		<PopupToolbar />
		      		<Editable 
		      			renderElement={renderElement}
	        			renderLeaf={renderLeaf}
	        			spellCheck
	        			onKeyDown={e => {
	        				// Keeps tab focus from escaping editor.
	        				// Add a mode switch for this later!
	        				// https://ux.stackexchange.com/a/41425 for example.
				          	if (e.keyCode === 9) {
					            e.preventDefault();
					            Helpers.tabHandler(editor);
				          	}
        				}}
		      		/>
		    	</Slate>
	    	</div>
    	</HotKeys>
  	)
});

export default SlateInstance;