import React, { Component } from 'react';
import Reorder, {
	reorder,
} from 'react-reorder';

import IndexCard from "./IndexCard";
import CorkboardFooter from "./CorkboardFooter";

class Corkboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			freeForm: false,
		}
		this.onReorder = this.onReorder.bind(this);
		this.onCardChange = this.onCardChange.bind(this);
	}
	onReorder (event, previousIndex, nextIndex, fromId, toId) {
		let reorderedNode = {
			...this.props.curDocRow.node, 
			expanded: true, 
			children: reorder(this.props.curDocRow.node.children, previousIndex, nextIndex)
		}
		this.props.replaceCurRow(reorderedNode);
	}
	onCardChange(newCard, index) {
		let newList = Array.from(this.props.curDocRow.node.children);
		newList[index] = newCard;
		let modifiedNode = {...this.props.curDocRow.node, expanded: true, children: [...newList]}
		this.props.replaceCurRow(modifiedNode);
	}
	render() {
		return (
			<div class="corkboard-area">
				<div className="board">
					<Reorder 
						reorderId= {this.props.split ? "split-corkboard" : "corkboard"}
						itemKey="id"
						list={this.props.curDocRow.node ? this.props.curDocRow.node.children : []}
						template={IndexCard}
						onReorder={this.onReorder}
						component="div"
						holdTime={300}
						autoScroll={false} // False *significantly* improves performance here—look into alternatives?
					>
						{
							this.props.curDocRow.node && this.props.curDocRow.node.children 
							? (
								this.props.curDocRow.node.children.map((item, i) => (
							      	<IndexCard 
										key={item.id}
										docIndex={i}
										card={item}
										onCardChange={this.onCardChange}
										inspectDoc={this.props.inspectDoc}
										isInspected={this.props.inspDocId === item.id}
									/>
							    ))
							) : null
							}
					</Reorder>
				</div>
				<CorkboardFooter split={this.props.split}/>
			</div>
		);
	}
}

export default Corkboard;