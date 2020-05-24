import React, { Component, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import Reorder, {
	reorder,
	reorderImmutable,
	reorderFromTo,
	reorderFromToImmutable
} from 'react-reorder';
import SortableTree, { 
	changeNodeAtPath, 
	find,
	getFlatDataFromTree,
	walk,
} from 'react-sortable-tree';

import { 
	switchDocument, 
	inspectDocument,
	queueDocumentChanges, 
	createNewDocument, 
	updateDocTree 
} from "../../store/slices/workspaceSlice";
import StoryMapFooter from "./StoryMapFooter";

class StoryMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viewedKnotId: null,
			viewedKnotContents: null,
		}
		this.flattenTree = this.flattenTree.bind(this);
		this.setViewedKnot = this.setViewedKnot.bind(this);
	}
	flattenTree() {
		let flatTree = [];
		const manuscriptNode = find({
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			treeData: this.props.treeData,
			searchMethod: (rowData) => {return(rowData.node.type === "manuscript")}
		}).matches[0];
		walk({
			treeData: manuscriptNode.node.children,
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			ignoreCollapsed: false,
			callback: (node => {
				flatTree.push(node.node);
			})
		});
		return flatTree;
	}
	setViewedKnot(docId, knotContents) {
		this.setState({
			...this.state,
			viewedKnotId: docId,
			viewedKnotContents: knotContents
		});
	}
	render() {
		let flatTree = this.flattenTree();
		return (
			<div class="map-area">
				<div className="map-wrapper">
					<div className="map-scroll">
						{
							Object.keys(this.props.threads).map((threadId, i) => {
								return(
									<MapThread
										threadId={threadId}
										colour={this.props.threads[threadId].colour}
										flatTree={flatTree}
										inspectDoc={this.props.inspectDoc}
										inspectedDoc={this.props.inspDocId}
										viewedKnotId={this.state.viewedKnotId}
										setViewedKnot={this.setViewedKnot}
									/>
								);
							})
						}

					</div>
					<div className="legend-wrapper">
						{
							this.state.viewedKnotContents ? (
								<div className="knot-viewer">{this.state.viewedKnotContents}</div>
							) : null
						}
						<MapLegend
							threads={this.props.threads}
						/>
					</div>
				</div>
				<StoryMapFooter split={this.props.split}/>
			</div>
		);
	}
}

const MapThread = (props) => {
	let knots = [];
	let rope = [];
	let onThread = false;
	props.flatTree.map((doc, i) => {
		if (doc.threads && doc.threads[props.threadId]) {
			knots.push({
				id: doc.id,
				knotId: doc.id + "-" + props.threadId,
				thread: doc.threads[props.threadId].knot,
			});
		}
	})
	props.flatTree.map((doc, i) => {
		let knot = null;
		let start = false;
		let end = false;
		if (knots.length === 0) {
			onThread = false;
		} else {
			if (knots[0].id === doc.id) {
				if (onThread === false) {
					onThread = true;
					start = true;
				}
				knot = knots.shift();
				if (knots.length === 0) {
					end = true;
				} 
			}
		}
		rope.push({
			docId: doc.id,
			onThread,
			knot,
			start,
			end,
		});
	})

	return(
		<div 
			key={props.threadId}
			className="thread-wrapper"
		>
			{
				rope.map((node, i) => {
					let knot = null;
					if (node.knot) {
						let knotViewed = props.viewedKnotId === node.knot.knotId;
						knot = (
							<div 
								className={knotViewed ? "knot selected" : "knot"}
								onClick={() => {props.setViewedKnot(node.knot.knotId, node.knot.thread)}}
							>
							</div>
						);
					}
					
					let ropePosition = "empty";
					let ropeStyle = {}
					if (node.onThread) {
						ropePosition = "rope" 
							+ (node.start ? " start" : "")
							+ (node.end ? " end" : "")
						;

						if (node.start === node.end) {
							ropeStyle.backgroundColor = props.colour;
						} else if (node.start) {
							ropeStyle.background = `linear-gradient(to right, transparent 50%, ${props.colour} 50%)`
						} else {
							ropeStyle.background = `linear-gradient(to left, transparent 50%, ${props.colour} 50%)`
						}
					}
					return (
						<div className={props.inspectedDoc === node.docId ? "rope-wrapper selected" : "rope-wrapper"}>
							<div 
								className={ropePosition}
								dataDocTitle={node.title}
								style={ropeStyle}
								onClick={() => {props.inspectDoc(node.docId)}}
							>
								{knot}
							</div>
						</div>
					);
				})
			}
		</div>
	);
}

const MapLegend = (props) => {
	return(
		<div className="map-legend">
			{
				Object.keys(props.threads).map((threadId, i) => {
					return(
						<div className="legend-row">
							<div style={{
								backgroundColor: props.threads[threadId].colour,
							}}></div>
							<div>{props.threads[threadId].name}</div>
						</div>
					);
				})
			}
		</div>
	);
}

export default StoryMap;