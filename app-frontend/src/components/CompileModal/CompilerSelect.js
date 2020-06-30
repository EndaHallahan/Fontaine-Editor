import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
	find,
	walk,
} from 'react-sortable-tree';

import { Select } from "../StatefulInputs";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const CompilerSelect = (props) => {
	const docTree = useSelector(state => state.workspaceReducer.docTree);

	let [compilerList, setCompilerList] = useState([{value: "", name: "None"}]);
	let [selectedCompiler, setSelectedCompiler] = useState("");

	const loadCompilerList = async () => {
		let localCompilers = await props.documentInterface.getCompilerList();
		let optList = [];
		localCompilers.forEach(comp => {
			optList.push({value: comp, name: comp});
		});
		setCompilerList(optList);
		setSelectedCompiler(localCompilers[0]); //Change to last used compiler, save in index?
	}

	const flattenTree = async () => {
		let flatTree = [];
		const manuscriptNode = find({
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			treeData: docTree,
			searchMethod: (rowData) => {return(rowData.node.type === "manuscript")},
		}).matches[0];
		if (manuscriptNode) {
			walk({
				treeData: manuscriptNode.node.children,
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				ignoreCollapsed: false,
				callback: (node => {
					flatTree.push(node.node);
				})
			});
		}
		return flatTree;
	}

	const getAllDocuments = async () => {
		let outList = [];
		let flatTree = await flattenTree();
		for (const node of flatTree) {
			if (node && !node.exclude) {
				const doc = await props.documentInterface.getDocument(node.id);
				if (doc) {
					outList.push(doc);
				}
			}
		}
		return outList;
	}

	const compile = async () => {
		const docList = await getAllDocuments();
		let result = await props.documentInterface.runCompiler(selectedCompiler, docList, {});
		console.log(result);
	}

	useEffect(() => {
		loadCompilerList();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Select
				options={compilerList}
				value={selectedCompiler}
				onChange={e => {
					const comp = e.target.value;
                	setSelectedCompiler(comp);
				}}
			/>
			<KeyboardFocusableButton
				onClick={compile}
				title="Compile"
			>Compile</KeyboardFocusableButton>
		</div>
	);
}

export default CompilerSelect;