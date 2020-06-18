import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { saveSingleDocument, lockChangedFile } from "../store/slices/workspaceSlice";

let autoSaveTimeout;

const AutoSaveHandler = (props) => {
	const checkInterval = 1;
	const saveInterval = useSelector(state => state.settingsReducer.settings.autoSaveInterval) || 2;

	const [stopwatch, setStopwatch] = useState(0);

	const dispatch = useDispatch();
	const autoSaveEnabled = !useSelector(state => state.settingsReducer.settings.autoSaveDisabled);
	const isLoaded = useSelector(state => state.workspaceReducer.loaded);
	const changedFiles = useSelector(state => state.workspaceReducer.changedFiles);
	const saveDoc = (key) => dispatch(saveSingleDocument(key, props.documentInterface));
	const lockDoc = (key) => dispatch(lockChangedFile({key}));

	const checkSave = (changedFilesObj) => {
		const changedFileList = Object.keys(changedFilesObj);
		changedFileList.forEach(key => {
			if (
				changedFilesObj[key].lastModified < Date.now() - (saveInterval * 1000) 
				&& changedFilesObj[key].locked === false
			) {
				console.log("Auto-saving " + key)
				lockDoc(key);
				saveDoc(key);
			}
		});
	}

	// And no, before someone asks, you *can't* just use setInterval by itself here.
	useEffect(() => {
		if (isLoaded && autoSaveEnabled) {
			clearInterval(autoSaveTimeout);
			let offset = stopwatch >= 60 ? 1 : stopwatch + 1
			autoSaveTimeout = setInterval(() => setStopwatch(offset), 1000);
			if (stopwatch % checkInterval === 0) {
				checkSave(changedFiles);
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
  	}, [isLoaded, stopwatch, autoSaveEnabled]);

	return null;
}

export default AutoSaveHandler;