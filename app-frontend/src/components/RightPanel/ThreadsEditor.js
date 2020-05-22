import React, { Component, Fragment } from "react";

import CollapsableDiv from "../CollapsableDiv";
import { TextArea } from "../StatefulInputs";

class ThreadsEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	render() {
		return (
			<Fragment>
				{
					Object.keys(this.props.threadList).map((threadId, i) => {

						let projThread = this.props.threadList[threadId];

						let myThread;
						if (this.props.threads[threadId] !== undefined) {
							myThread = this.props.threads[threadId];
						}

						return(
							<CollapsableDiv
								openHeight={null}
								defaultOpen={!!myThread}
								title={projThread.name}
							>
								<TextArea
									placeholder="Continue a thread..."
									//key={this.props.inspRow.notes}
									onChange={e => {
										let modThread = e.target.value;
										let newThreads = {
											...this.props.threads,
											[threadId]: {
												...this.props.threads[threadId],
												knot: modThread,
											}
										}
										this.props.onChange(newThreads);
									}}
									value={myThread ? myThread.knot : null}
								/>
							</CollapsableDiv>
						);
					})
				}
			</Fragment>
		);
	}
}

export default ThreadsEditor;