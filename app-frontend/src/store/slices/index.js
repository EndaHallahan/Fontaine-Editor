import { combineReducers } from 'redux';
import workspaceReducer from "./workspaceSlice";
import modalReducer from "./modalSlice";
import settingsReducer from "./settingsSlice";
import uiReducer from "./uiSlice";

const rootReducer = combineReducers({
	workspaceReducer,
	modalReducer,
	settingsReducer,
	uiReducer,
});

export default rootReducer;