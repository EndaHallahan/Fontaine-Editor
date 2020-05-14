import { combineReducers } from 'redux';
import workspaceReducer from "./workspaceSlice";
import modalReducer from "./modalSlice";
import settingsReducer from "./settingsSlice";
import editorAreaReducer from "./editorAreaSlice";

const rootReducer = combineReducers({
	workspaceReducer,
	modalReducer,
	settingsReducer,
	editorAreaReducer,
});

export default rootReducer;