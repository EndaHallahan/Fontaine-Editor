import React, { Fragment } from 'react';
import { ReactEditor } from 'slate-react'
import { Icon } from '@iconify/react';

import formatBold from '@iconify/icons-mdi/format-bold';
import formatItalic from '@iconify/icons-mdi/format-italic';
import formatUnderline from '@iconify/icons-mdi/format-underline';
import formatStrikethrough from '@iconify/icons-mdi/format-strikethrough';

import formatListNumbered from '@iconify/icons-mdi/format-list-numbered';
import formatListBulleted from '@iconify/icons-mdi/format-list-bulleted';

import formatAlignRight from '@iconify/icons-mdi/format-align-right';
import formatAlignCenter from '@iconify/icons-mdi/format-align-center';
import formatAlignJustify from '@iconify/icons-mdi/format-align-justify';

import formatSuperscript from '@iconify/icons-mdi/format-superscript';
import formatSubscript from '@iconify/icons-mdi/format-subscript';

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

const BlockButton = (props) => {
	return (
		<button
			className={Helpers.isBlockActive(props.editor, props.format) ? "active" : null}
			onMouseDown={event => {
				event.preventDefault();
	        	Helpers.toggleBlock(props.editor, props.format);
	        	ReactEditor.focus(props.editor);
	      	}}
		>
			{props.children}
		</button>
	)
}

const EditorToolbar = (props) => { 
	const editor = props.editor;
	return (
		<div className="editor-toolbar">
			{editor
				? (
					<Fragment>
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

						<div className="divider" />

						<MarkButton
							format="superscript" 
							editor={editor} 
						>
							<Icon icon={formatSuperscript} />
						</MarkButton>

						<MarkButton
							format="subscript" 
							editor={editor} 
						>
							<Icon icon={formatSubscript} />
						</MarkButton>

						<div className="divider" />

						<BlockButton
							format="numbered-list" 
							editor={editor} 
						>
							<Icon icon={formatListNumbered} />
						</BlockButton>

						<BlockButton
							format="bulleted-list" 
							editor={editor} 
						>
							<Icon icon={formatListBulleted} />
						</BlockButton>

						<div className="divider" />

						<BlockButton
							format="align-center" 
							editor={editor} 
						>
							<Icon icon={formatAlignCenter} />
						</BlockButton>

						<BlockButton
							format="align-right" 
							editor={editor} 
						>
							<Icon icon={formatAlignRight} />
						</BlockButton>

						<BlockButton
							format="align-justify" 
							editor={editor} 
						>
							<Icon icon={formatAlignJustify} />
						</BlockButton>
					</Fragment>
				) : null
			}
			
		</div>
	);
}

export default EditorToolbar;


/*const colorIcon = `
<svg viewBox="0 0 18 18"> 
	<line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15" style="stroke: red;"></line> 
	<svg y="-2.5" x="-3" width="24.000000000000004" height="24.000000000000004" xmlns="http://www.w3.org/2000/svg">
		  <path class=".ql-stroke" d="m9.5,12.8l5,0l0.9,2.2l2.1,0l-4.75,-11l-1.5,0l-4.75,11l2.1,0l0.9,-2.2zm2.5,-6.82l1.87,5.02l-3.74,0l1.87,-5.02z"/>
	</svg>
</svg>`

const backgroundIcon = `
<svg viewBox="0 0 18 18"> 
	<line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15" style="stroke: red;"></line>
	<svg style="width:24px;height:24px" viewBox="0 0 24 24">
	    <path fill="currentColor" d="M19,11.5C19,11.5 17,13.67 17,15A2,2 0 0,0 19,17A2,2 0 0,0 21,15C21,13.67 19,11.5 19,11.5M5.21,10L10,5.21L14.79,10M16.56,8.94L7.62,0L6.21,1.41L8.59,3.79L3.44,8.94C2.85,9.5 2.85,10.47 3.44,11.06L8.94,16.56C9.23,16.85 9.62,17 10,17C10.38,17 10.77,16.85 11.06,16.56L16.56,11.06C17.15,10.47 17.15,9.5 16.56,8.94Z" />
	</svg>
</svg>

`*/