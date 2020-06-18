import React, { useEffect, useRef } from 'react';
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Range } from 'slate'
import { Icon } from '@iconify/react';

import formatBold from '@iconify/icons-mdi/format-bold';
import formatItalic from '@iconify/icons-mdi/format-italic';
import formatUnderline from '@iconify/icons-mdi/format-underline';
import formatStrikethrough from '@iconify/icons-mdi/format-strikethrough';

import Helpers from "../../utils/editor/Helpers";

const MarkButton = (props) => {
  return (
    <button
      	className={Helpers.isMarkActive(props.editor, props.format) ? "active" : null}
      	onMouseDown={event => {
      		event.preventDefault();
        	Helpers.toggleMark(props.editor, props.format);
        	ReactEditor.focus(props.editor);
      	}}
    >
      	{props.children}
    </button>
  );
}

const PopupToolbar = (props) => { 
	const editor = useSlate();
	const ref = useRef();

	useEffect(() => {
	    const el = ref.current;
	    const { selection } = editor;

	    if (!el) {
	    	return;
	    }

	    if (
			!selection ||
			!ReactEditor.isFocused(editor) ||
			Range.isCollapsed(selection) ||
			Editor.string(editor, selection) === ''
	    ) {
	    	el.removeAttribute('style');
	      	return;
	    }

	    const domSelection = window.getSelection();
	    const domRange = domSelection.getRangeAt(0);
	    const rect = domRange.getBoundingClientRect();
	    el.style.opacity = 1;
	    el.style.top = `${rect.top - el.offsetHeight - 10}px`;
	    el.style.left = `${rect.left - el.offsetWidth/2 + rect.width/2}px`;
	})

	return (
		<div 
			className="popup-editor-toolbar"
			ref={ref}
		>
			<MarkButton 
				format="bold" 
				editor={editor} 
			>
				<Icon icon={formatBold} />
			</MarkButton>

			<MarkButton 
				format="italic" 
				editor={editor} 
			>
				<Icon icon={formatItalic} />
			</MarkButton>

			<MarkButton 
				format="underline" 
				editor={editor} 
			>
				<Icon icon={formatUnderline} />
			</MarkButton>

			<MarkButton 
				format="strikethrough" 
				editor={editor} 
			>
				<Icon icon={formatStrikethrough} />
			</MarkButton>
		</div>
	);
}

export default PopupToolbar;