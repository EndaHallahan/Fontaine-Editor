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
			newTheme = {theme:{}};
		}
		setPreviewedTheme(newTheme.theme);
		setPreviewedThemeName(themeName);
	}

	useEffect(() => {
		loadThemeList();
	}, []);

	return (
		<div className="theming-tab">
			<div className="theme-preview">
				{/* TODO: Add little blocks to represent text colour in preview. */}
				<div 
					className="head"
					style={{
						backgroundColor: previewedTheme["appbar-colour"] || previewedTheme["primary-colour-shade"] || null,
					}}
				></div>
				<div 
					className="nav"
					style={{
						backgroundColor: previewedTheme["navigator-colour"] || previewedTheme["primary-colour"] || null,
					}}
				></div>
				<div 
					className="edit"
					style={{
						backgroundColor: previewedTheme["editor-background-colour"] || null,
						borderColor: previewedTheme["editor-container-colour"] || null,
					}}
				></div>
				<div 
					className="insp"
					style={{
						backgroundColor: previewedTheme["inspector-colour"] || previewedTheme["primary-colour"] || null,
					}}
				></div>
				<div 
					className="foot"
					style={{
						backgroundColor: previewedTheme["footer-colour"] || previewedTheme["primary-colour-shade"] || null,
					}}
				></div>
			</div>
			<div className="selection-list">
				{
					themeList.map((theme, i) => {
						return (
							<div
								className={
									theme === currentTheme ? "active" : (
										theme === previewedThemeName ? "selected" : null
									)
								}
								onClick={() => {loadTheme(theme)}}
								key={i}
							>{theme.replace(".json", "")}</div>
						);
					})
				}
			</div>

			<span className="confirm-wrapper">
				<span>
					<KeyboardFocusableButton
						className="border"
						//onClick={setTheme}
					>Save Current Theme</KeyboardFocusableButton>
				</span>
				<span className="right">
					<KeyboardFocusableButton
						className="border"
						onClick={setTheme}
					>Set Theme</KeyboardFocusableButton>
				</span>
			</span>
		</div>
	);
}

export default ThemeOptions;