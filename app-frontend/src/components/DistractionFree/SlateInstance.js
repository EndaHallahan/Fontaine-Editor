import React, { Component, Fragment, useEffect, useMemo, useState, useCallback} from 'react';
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { useSelector, useDispatch } from 'react-redux'
import { HotKeys } from 'react-hotkeys';

import { queueDocumentChanges, updateWorkingDoc } from "../../store/slices/workspaceSlice";
import { Element, Leaf } from "../../utils/editor/renderElement";
import Helpers from "../../utils/editor/Helpers";

const keyMap = {
  	//INDENT: "tab"
};

const SlateInstance = React.forwardRef((props, ref) => {
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
  		INDENT: e => {
			e.preventDefault();
			editor.insertText("\t")
		},
  	}
  	return (
  		<HotKeys keyMap={keyMap} handlers={handlers}>
	  		<div 
	  			className="slate-wrapper" 
	  			ref={ref}
	  			onFocus={() => props.setActive(props.docId)}
	    	>
		    	<Slate 
		    		editor={editor} 
		    		value={value} 
		    		onChange={updateDocument}
		    	>
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