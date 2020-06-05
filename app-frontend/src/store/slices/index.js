import { combineReducers } from 'redux';
import workspaceReducer from "./workspaceSlice";
import modalReducer from "./modalSlice";
import settingsReducer from "./settingsSlice";
import uiReducer from "./uiSlice";
import statusReducer from "./statusSlice";

const rootReducer = combineReducers({
	workspaceReducer,
	modalReducer,
	settingsReducer,
	uiReducer,
	statusReducer,
});

export default rootReducer;