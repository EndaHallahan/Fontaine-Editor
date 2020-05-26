import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { Icon, InlineIcon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';
import plusSquare from '@iconify/icons-feather/plus-square';
import minusSquare from '@iconify/icons-feather/minus-square';

import { addProjectThread, updateProjectThreads } from "../../store/slices/workspaceSlice";
import ColourPicker from "../ColourPicker"; 
import { Input } from "../StatefulInputs"; 
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomSubwindow from "../CustomSubwindow";

const ThreadsModal = (props) => {
	const dispatch = useDispatch();
	const threads = useSelector(state => state.workspaceReducer.threads);
	const updateThreads = (threads) => {dispatch(updateProjectThreads({threads}));}
	const addThread = (id) => {dispatch(addProjectThread({id}));}
	return (
		<ThreadsModalChild
			threads={threads}
			updateThreads={updateThreads}
			addThread={addThread}
			onRequestClose={props.onRequestClose}
		/>
	);
}

class ThreadsModalChild extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
		this.modifyThread = this.modifyThread.bind(this);
		this.removeThread = this.removeThread.bind(this);
	}
	modifyThread(id, newThread) {
		let newThreads = {...this.props.threads, [id]: newThread}
		console.log(newThreads)
		this.props.updateThreads(newThreads);
	}
	removeThread(id) {
		const {[id]: removed, ...otherThreads} = this.props.threads;
		this.props.updateThreads(otherThreads)
		console.log(otherThreads)
	}
	render() {
		return(
			<CustomSubwindow
				modalClass="small"
				onRequestClose={this.props.onRequestClose}
	          	onAfterOpen={this.props.afterOpenModal}
	          	contentLabel="Threads Popup"
	          	title="Project Threads"
	          	style={{
	          		width: "20rem",
	          		height: "auto",
	          	}}
	        >
	       		<div class="threads-modal">
	       			<div class="scroll-wrapper">
	       			{
	       				Object.keys(this.props.threads).map((threadId, i) => {
	       					let thread = this.props.threads[threadId];
	       					return (
	       						<div>
	       							<ColourPicker
										colour={
											thread.colour
											|| "#ff0000"
										}
										onColourChange={(colour) => {
											let newThread = {...thread, colour: colour.hex}
											this.modifyThread(threadId, newThread);
										}}
										disableAlpha={true}
									/>
									<Input
										value={thread.name}
										onChange={(e) => {
											let newThread = {...thread, name: e.target.value}
											this.modifyThread(threadId, newThread);
										}}
									/>
									<KeyboardFocusableButton
										onClick={() => this.removeThread(threadId)}
										//disabled={!this.state.value.trim()}
										title="Delete Thread"
									><Icon icon={minusSquare} /></KeyboardFocusableButton>
	       						</div>
	       					);
	       				})
	       			}
	       			</div>
	       			<div>
	       				<KeyboardFocusableButton
							onClick={() => this.props.addThread(uuidv4())}
							//disabled={!this.state.value.trim()}
							title="New Thread"
						><Icon icon={plusSquare} /></KeyboardFocusableButton>
	       			</div>
	       		</div>
	        </CustomSubwindow>
		);
	}
}

export default ThreadsModal;