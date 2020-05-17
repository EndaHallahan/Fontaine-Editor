import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Resizable } from "re-resizable";
import { Icon, InlineIcon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';


import { toggleSplitEditor } from "../../store/slices/uiSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

class SplitEditorChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: this.props.width || "50%"
		}
	}
	render() {
		return (
			<Resizable
				size={{width: this.state.width, height: "100%"}}
				minWidth={190}
				maxWidth={"80%"}
				onResizeStop={(e, direction, ref, d) => {
				    this.setState({
				    	...this.state,
				     	width: this.state.width + d.width
				    }); 
				}}
				enable={{ 
					top:false, 
					right:false, 
					bottom:false, 
					left:true, 
					topRight:false, 
					bottomRight:false, 
					bottomLeft:false, 
					topLeft:false 
				}}
				className="split-editor"
			>
				<div className="split-bar">
					<KeyboardFocusableButton
						onClick={this.props.switchSplitEditor}
						title="Close the split Editor"
						//className={editorMode === "editor" ? "active" : null}
					><Icon icon={xCircle} /></KeyboardFocusableButton>
				</div>
				{this.props.children}
			</Resizable>
			
		);
	}
}

const SplitEditor = (props) => {
	const dispatch = useDispatch();

	//const mainEditorMode = useSelector(state => state.uiReducer.editorMode);
	const switchSplitEditor = () => dispatch(toggleSplitEditor());

	return(
		<SplitEditorChild
			{...props}
			switchSplitEditor={switchSplitEditor} 
		/>
	);
}

export default SplitEditor;