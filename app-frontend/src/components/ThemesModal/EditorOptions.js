import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setThemeSettings, resetSpecificThemeSettings, saveSettings } from "../../store/slices/settingsSlice";

import ColourPicker from "../ColourPicker"; 
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const EditorOptions = (props) => {
	const dispatch = useDispatch();

	const theme = useSelector(state => state.settingsReducer.theme);
	const themeOverrides = useSelector(state => state.settingsReducer.themeOverrides);
	
	let [pendingChanges, setPendingChanges] = useState({});
	let [areChanges, setAreChanges] = useState(false);
	const setThemeChanges = async (settingsObj) => {
		await dispatch(setThemeSettings({settingsObj}));
		dispatch(saveSettings(props.documentInterface));
	};
	const resetThemeChanges = async (settingsList) => {
		await dispatch(resetSpecificThemeSettings({settingsList}));
		dispatch(saveSettings(props.documentInterface));
	};

	const getCurSettingVal = (setting) => {
		return pendingChanges[setting]
			|| themeOverrides[setting]
			|| theme[setting]
			|| `var(--${setting})`;
	}

	const addPendingChange = (setting, value) => {
		setPendingChanges({
			...pendingChanges,
			[setting]: value
		});
		setAreChanges(true);
	}

	const setChanges = () => {
		setThemeChanges(pendingChanges);
		setPendingChanges({});
		setAreChanges(false);
	}
	const resetChanges = () => {
		setPendingChanges({});
	}
	const resetToDefaults = () => {
		resetThemeChanges([
			"editor-container-colour",
			"editor-background-colour",
			"editor-text-colour",
			"editor-drop-shadow",
		]);
	}

	return (
		<div className="editor-settings-tab">
			<div 
				className="editor-preview"
				style={{
					backgroundColor: getCurSettingVal("editor-container-colour"),
				}}
			>
				<div
					style={{
						backgroundColor: getCurSettingVal("editor-background-colour"),
						color: getCurSettingVal("editor-text-colour"),
						boxShadow: getCurSettingVal("editor-drop-shadow"),
					}}
				>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia porttitor erat vel luctus. Maecenas eleifend turpis sed eros convallis lobortis.</p>
					<p>Sed commodo mattis imperdiet. Curabitur tincidunt ac turpis sit amet vestibulum. Nunc elementum rhoncus arcu eu pretium. Nulla dapibus nibh rhoncus est hendrerit, nec ornare neque rhoncus. Nunc vulputate commodo semper. Morbi mattis euismod neque vel venenatis. Ut pulvinar enim ac tortor eleifend ultricies.</p>
					<p> Nunc varius ut urna a fermentum. Nullam vitae pharetra lectus. Quisque porta, metus sit amet aliquam vulputate, ex nulla sollicitudin dolor, sed imperdiet diam dui et diam. Mauris convallis, sapien ut consectetur scelerisque, elit mauris finibus metus, non placerat elit est ut neque.</p>
				</div>
			</div>
			<div className="options-list">

				<div>
					<span>Paper Colour</span>
					<ColourPicker
						className="open-reverse"
						colour={getCurSettingVal("editor-background-colour")}
						onColourChange={(color) => {
							addPendingChange("editor-background-colour", color.hex);
						}}
						disableAlpha={true}
					/>
				</div>
				
				<div>
					<span>Background Colour</span>
					<ColourPicker
						className="open-reverse"
						colour={getCurSettingVal("editor-container-colour")}
						onColourChange={(color) => {
							addPendingChange("editor-container-colour", color.hex);
						}}
						disableAlpha={true}
					/>
				</div>

				<div>
					<span>Default Text Colour</span>
					<ColourPicker
						className="open-reverse"
						colour={getCurSettingVal("editor-text-colour")}
						onColourChange={(color) => {
							addPendingChange("editor-text-colour", color.hex);
						}}
						disableAlpha={true}
					/>
				</div>

				<div>
					<span>Show Drop Shadow</span>
					<input 
						type="checkbox"
						checked={
							getCurSettingVal("editor-drop-shadow")
							&& getCurSettingVal("editor-drop-shadow") !== "none"
						}
						onChange={((e) => {
							console.log()
							addPendingChange("editor-drop-shadow", e.target.checked ? 
								"10px 10px 8px black"
								: "none"
							);
						})}
					/>
				</div>
			
			</div>
			<span className="confirm-wrapper">
				<span>
					<KeyboardFocusableButton 
						onClick={resetToDefaults}
						className="defaults-button border warning"
					>Reset Defaults</KeyboardFocusableButton>
				</span>
				<span className="right"> 
					<KeyboardFocusableButton 
						disabled={!areChanges}
						onClick={resetChanges}
						className="reset-button border"
					>Clear Changes</KeyboardFocusableButton>
					<KeyboardFocusableButton 
						disabled={!areChanges}
						onClick={setChanges}
						className="confirm-button border"
					>Confirm</KeyboardFocusableButton>
				</span>
			</span>
		</div>
	);
}

export default EditorOptions;