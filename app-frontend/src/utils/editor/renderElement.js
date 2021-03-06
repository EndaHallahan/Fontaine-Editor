import React from 'react';

const Element = ({ attributes, children, element }) => {
  	switch (element.type) {
    	case 'block-quote':
      		return <blockquote {...attributes}>{children}</blockquote>
    	case 'bulleted-list':
      		return <ul {...attributes}>{children}</ul>
    	case 'heading-one':
      		return <h1 {...attributes}>{children}</h1>
    	case 'heading-two':
      		return <h2 {...attributes}>{children}</h2>
    	case 'list-item':
      		return <li {...attributes}>{children}</li>
    	case 'numbered-list':
      		return <ol {...attributes}>{children}</ol>
      	case 'align-left':
      		return <div style={{textAlign: "left"}} {...attributes}>{children}</div>
      	case 'align-right':
      		return <div style={{textAlign: "right"}} {...attributes}>{children}</div>
      	case 'align-center':
      		return <div style={{textAlign: "center"}} {...attributes}>{children}</div>
      	case 'align-justify':
      		return <div style={{textAlign: "justify"}} {...attributes}>{children}</div>
    	default:
      		return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.code) {
		children = <code>{children}</code>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	if (leaf.strikethrough) {
		children = <del>{children}</del>
	}

	if (leaf.superscript) {
		children = <sup>{children}</sup>
	}

	if (leaf.subscript) {
		children = <sub>{children}</sub>
	}

	return <span {...attributes}>{children}</span>
}

export {Element, Leaf};