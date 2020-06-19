import React, { useMemo, useCallback, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { HotKeys } from 'react-hotkeys';
import _ from "lodash";

import { Element, Leaf } from "../utils/editor/renderElement";
import Helpers from "../utils/editor/Helpers";

const keyMap = {
  	
};

const SlateInstance = React.memo((props) => {
	const editor = useMemo(() => withReact(withHistory(createEditor())), []);
	props.createHoistedEditor(props.docId, editor);
	const defaultContents = [{
	  	type: 'paragraph',
	  	children: [{ text: ''}],
	}];
  	let value = props.value && props.value.ops ? props.value.ops : defaultContents;
  	const updateDocument = (inValue) => {
  		if (inValue !== value) {
  			props.updateDoc(props.docId, inValue);
  		}
  		if (props.touchToolbar) {
  			props.touchToolbar();
  		}
  	}
  	const renderElement = useCallback(props => <Element {...props} />, []);
  	const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  	useEffect(() => {
  		if (props.history[props.docId]) {
			editor.history = _.cloneDeep(props.history[props.docId]);
		}
  		return () => {
  			props.updateHistory(props.docId, editor.history);
  		}
  	}, [])

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
		    	{props.toolbarComponent ? <props.toolbarComponent /> : null}
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