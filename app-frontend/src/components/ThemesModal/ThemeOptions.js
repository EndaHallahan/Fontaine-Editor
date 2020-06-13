import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from "../../store/slices/settingsSlice";

import ColourPicker from "../ColourPicker"; 
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const ThemeOptions = (props) => {
	const dispatch = useDispatch();
	const currentTheme = useSelector(state => state.settingsReducer.currentTheme);
	
	let [themeList, setThemeList] = useState(["Default"]);
	let [previewedThemeName, setPreviewedThemeName] = useState(currentTheme);
	let [previewedTheme, setPreviewedTheme] = useState({});

	const setTheme = () => {dispatch(changeTheme(previewedThemeName, props.documentInterface))};

	const loadThemeList = async () => {
		let localThemes = await props.documentInterface.getThemeList();
		setThemeList([...themeList, ...localThemes]);
	}
	const loadTheme = async (themeName) => {
		let newTheme;
		if (themeName !== "Default") {
			newTheme = await props.documentInterface.getTheme(themeName);
		} else {
			newTheme = {};
		}
		setPreviewedTheme(newTheme);
		setPreviewedThemeName(themeName);
	}

	useEffect(() => {
		loadThemeList();
	}, []);

	return (
		<div className="theme-settings-tab">
			<div className="theme-preview">
				<div 
					className="editor-preview"
					style={{
						backgroundColor: previewedTheme["primary-colour"]
					}}
				></div>
			</div>

			<div className="theme-selector">
				{

					themeList.map((theme) => {
						return (
							<div
								className={theme === currentTheme ? "active" : null}
								onClick={() => {loadTheme(theme)}}
							>{theme}</div>
						);
					})
				}
			</div>

			<span className="confirm-wrapper">
				<button
					onClick={setTheme}
				>Set Theme</button>
			</span>
		</div>
	);
}

/*class ThemeOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pendingChanges: {},
			areChanges: false,
			themeList: props.documentInterface.getThemeList(),
		}
		this.changeSetting = this.changeSetting.bind(this);
		this.setChanges = this.setChanges.bind(this);
		this.resetChanges = this.resetChanges.bind(this);
		this.resetToDefaults = this.resetToDefaults.bind(this);
	}
	changeSetting(setting, value) {
		this.setState({
			...this.state,
			areChanges: true,
			pendingChanges: {
				...this.state.pendingChanges,
				[setting]: value
			}
		})
	}
	setChanges() {
		this.props.updateSettings(this.state.pendingChanges);
		this.setState({
			...this.state,
			areChanges: false,
			pendingChanges: {}
		})
	}
	resetChanges() {
		this.setState({
			...this.state,
			areChanges: false,
			pendingChanges: {}
		})
	}
	resetToDefaults() {
		this.props.resetToDefaults();
		this.resetChanges();
	}
	render() {
		console.log("THEMELIST", this.state.themeList)
		//console.log(this.state.pendingChanges)
		return (
			<div className="theme-settings-tab">
				<div className="theme-preview">
				</div>

				<div className="theme-selector">
					{

						this.state.themeList.map((theme) => {return (<div>{theme}</div>)})
					}
				</div>

				<span className="confirm-wrapper">
					<span>
						<KeyboardFocusableButton 
							onClick={this.resetToDefaults}
							className="defaults-button border warning"
						>Reset Defaults</KeyboardFocusableButton>
					</span>
					<span className="right"> 
						<KeyboardFocusableButton 
							disabled={!this.state.areChanges}
							onClick={this.resetChanges}
							className="reset-button border"
						>Clear Changes</KeyboardFocusableButton>
						<KeyboardFocusableButton 
							disabled={!this.state.areChanges}
							onClick={this.setChanges}
							className="confirm-button border"
						>Confirm</KeyboardFocusableButton>
					</span>
				</span>
			</div>
		);
	}
}*/

export default ThemeOptions;