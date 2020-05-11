import React, { Component, Fragment, useEffect, useMemo, useState, useCallback } from 'react';

import Helpers from "../editor/helpers";

import { Icon, InlineIcon } from '@iconify/react';
import formatBold from '@iconify/icons-mdi/format-bold';
import formatItalic from '@iconify/icons-mdi/format-italic';
import formatUnderline from '@iconify/icons-mdi/format-underline';
import formatStrikethrough from '@iconify/icons-mdi/format-strikethrough';

const MarkButton = (props) => {
  return (
    <button
      	//active={isMarkActive(editor, format)}
      	className={Helpers.isMarkActive(props.editor, props.format) ? "active" : null}
      	onClick={event => {
        	Helpers.toggleMark(props.editor, props.format);
        	props.editorEle.focus();
      	}}
    >
      	{props.children}
    </button>
  );
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
							editorEle={props.editorEle}
						>
							<Icon icon={formatBold} />
						</MarkButton>

						<MarkButton 
							format="italic" 
							editor={editor} 
							editorEle={props.editorEle}
						>
							<Icon icon={formatItalic} />
						</MarkButton>

						<MarkButton 
							format="underline" 
							editor={editor} 
							editorEle={props.editorEle}
						>
							<Icon icon={formatUnderline} />
						</MarkButton>

						<MarkButton 
							format="strikethrough" 
							editor={editor} 
							editorEle={props.editorEle}
						>
							<Icon icon={formatStrikethrough} />
						</MarkButton>

						<div className="divider" />

					</Fragment>
				) : null
			}
			
		</div>
	);
}

export default EditorToolbar;