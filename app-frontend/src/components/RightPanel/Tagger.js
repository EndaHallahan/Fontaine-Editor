import React, { Component, Fragment} from "react";
import { Icon, InlineIcon } from '@iconify/react';
import xIcon from '@iconify/icons-feather/x';
import plusSquare from '@iconify/icons-feather/plus-square';

import KeyboardFocusableButton from "../KeyboardFocusableButton";

class Tagger extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
		this.addTag = this.addTag.bind(this);
		this.removeTag = this.removeTag.bind(this);
	}
	addTag(tag) {
		let newTags = [...this.props.tags, tag];
		newTags.sort((a, b) => {
			let aScore = a.includes(":") ? -1 : 1;
			let bScore = b.includes(":") ? 1 : -1;
			let alph = a > b ? 1 : -1;
			return (alph + aScore + bScore);
		});
		this.props.onChange(newTags);
		if (!this.props.tagList.includes(tag)) {
			this.props.onNewTag(tag);
		}
	}
	removeTag(tagIndex) {
		let newTags = [...this.props.tags];
		newTags.splice(tagIndex, 1);
		this.props.onChange(newTags);
	}
	render() {
		return (
			<div className="tagger">
				<TagInput 
					addTag={this.addTag} 
					tagList={this.props.tagList}
				/>
				<div className="tag-space">
					{
						this.props.tags.map((tag, i) => 
							<Tag key={i} tag={tag} index={i} removeTag={this.removeTag}/>
						)
					}
				</div>
			</div>
		);
	}
}

class TagInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
			highlightedSuggestion: 0,
			suggestionsOpen: false,
			activeSuggestions: this.props.tagList || []
		}
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.setSuggestion = this.setSuggestion.bind(this);
		this.setHighlightedSuggestion = this.setHighlightedSuggestion.bind(this);
		this.submitTag = this.submitTag.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.inputEle = React.createRef();
	}
	handleKeyPress(e) {
		if (this.state.activeSuggestions.length) {
			switch(e.keyCode) {
				case 13:
					this.setSuggestion(this.state.highlightedSuggestion);
					break;
				case 38:
					this.advanceHighlightedSuggestion(-1);
			    	break;
			    case 40:
					this.advanceHighlightedSuggestion(1);
			    	break;
			    case 27:
			    	this.setState({
						...this.state,
						activeSuggestions: [],
						highlightedSuggestion: 0
					});
			    	break;		
			}
		} else {
			if (e.keyCode === 13){
				this.submitTag(this.state.value);
			}
		}
	}
	handleInputChange(e) {
		const inputValue = (e.target.value && e.target.value.trim().toLowerCase()) || "";
		const inputLength = inputValue.length;
		if (!inputLength) {
			this.setState({
				...this.state,
				highlightedSuggestion: 0,
				value: e.target.value,
				activeSuggestions: this.props.tagList || [],
			});
			return;
		}
		let suggestions = this.props.tagList.filter((tag) => {
			return tag.toLowerCase().slice(0, inputLength) === inputValue;
		});
		this.setState({
			...this.state,
			highlightedSuggestion: 0,
			value: e.target.value,
			activeSuggestions: suggestions || [],
		});
	}
	handleFocus() {
		this.setState({
			...this.state,
			suggestionsOpen: true
		})
	}
	handleBlur() {
		this.setState({
			...this.state,
			suggestionsOpen: false
		})
	}
	setSuggestion(index) {
		let suggestion = this.state.activeSuggestions[index];
		this.inputEle.current.focus();
		this.setState({
			...this.state,
			value: suggestion,
			activeSuggestions: [],
			highlightedSuggestion: 0
		});
	}
	setHighlightedSuggestion(index) {
		this.setState({
			...this.state,
			highlightedSuggestion: index,
		});
	}
	advanceHighlightedSuggestion(step) {
		let len = this.state.activeSuggestions.length;
		let curIndex = this.state.highlightedSuggestion;
		if (curIndex + step >= len || curIndex + step < 0) {
			return;
		}
		this.setState({
			...this.state,
			highlightedSuggestion: curIndex + step
		});
	}
	submitTag(tag) {
		if (this.state.value.trim()) {
			this.props.addTag(tag);
			this.setState({
				...this.state,
				value: "",
				activeSuggestions: this.props.tagList || [],
				highlightedSuggestion: 0
			});
		}
	}
	componentDidUpdate(prevProps) {
		if (
			prevProps.tagList !== this.props.tagList
			&& this.state.activeSuggestions === prevProps.tagList 
		) {
			this.setState({
				...this.state,
				activeSuggestions: this.props.tagList || [],
			});
		}
	}
	render() {
		return(
			<Fragment>
				<div>
					<input
						ref={this.inputEle}
						value={this.state.value}
						onChange={this.handleInputChange}
						onKeyDown={this.handleKeyPress}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						placeholder="Add a tag..."
					/>
					<KeyboardFocusableButton
						onClick={() => this.submitTag(this.state.value)}
						disabled={!this.state.value.trim()}
						title="Add Tag"
					><Icon icon={plusSquare} /></KeyboardFocusableButton>
				</div>
				{
					this.state.suggestionsOpen && this.state.activeSuggestions.length ? (
						<div className="tag-suggestions">
							<div>Tag Search</div>
							<div className="sug-wrapper">
								{
									this.state.activeSuggestions.map((sug, i) => (
										<Suggestion
											key={i}
											index={i}
											selected={this.state.highlightedSuggestion === i}
											suggestion={sug}
											highlight={this.setHighlightedSuggestion}
											setSuggestion={this.setSuggestion}
										/>
									))
								}
							</div>
						</div>
					) : null
				}
				
			</Fragment>
		);
	}
}

const Suggestion = (props) => {
	return(
		<div 
			className={props.selected ? "selected" : null}
			onMouseEnter={() => props.highlight(props.index)}
			onMouseDown={(e) => {
				props.setSuggestion(props.index)
				e.preventDefault();
			}}
		>
			{props.suggestion}
		</div>
	);
}

const Tag = (props) => {
	return(
		<div className="tag">
			{props.tag}
			<KeyboardFocusableButton 
				onClick={() => props.removeTag(props.index)}
				title="Remove Tag"
			>
				<Icon icon={xIcon} />
			</KeyboardFocusableButton>
		</div>
	);
}

export default Tagger;

