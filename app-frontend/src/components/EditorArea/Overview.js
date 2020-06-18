import React, { Component } from 'react';
import Reorder, {
	reorder,
} from 'react-reorder';

//import { updateDocTree } from "../../store/slices/workspaceSlice";
import OverviewItem from "./OverviewItem";
import CorkboardFooter from "./CorkboardFooter";

class Overview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
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
			<div class="overview-area">
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Summary</th>
							<th>Status</th>
							{
								this.props.mdFields.map(field => 
									<th>{field}</th>
								)
							}
						</tr>
					</thead>
						<Reorder 
							reorderId= {this.props.split ? "split-overview" : "overview"}
							itemKey="id"
							list={this.props.curDocRow.node ? this.props.curDocRow.node.children : []}
							template={OverviewItem}
							onReorder={this.onReorder}
							component="tbody"
							holdTime={300}
							autoScroll={false} // False *significantly* improves performance here—look into alternatives?
						>
							{
								this.props.curDocRow.node && this.props.curDocRow.node.children
								? (
									this.props.curDocRow.node.children.map((item, i) => (
								      	<OverviewItem
											key={item.id}
											docIndex={i}
											card={item}
											onCardChange={this.onCardChange}
											inspectDoc={this.props.inspectDoc}
											isInspected={this.props.inspDocId === item.id}
											mdFields={this.props.mdFields}
										/>
								    ))
								) : null
								}
						</Reorder>
				</table>
				</div>
				<CorkboardFooter split={this.props.split}/>
			</div>
		);
	}
}

export default Overview;