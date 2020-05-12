import { combineReducers } from 'redux';
import workspaceReducer from "./workspaceSlice";
import modalReducer from "./modalSlice";
import settingsReducer from "./settingsSlice";

const rootReducer = combineReducers({
	workspaceReducer,
	modalReducer,
	settingsReducer,
});

export default rootReducer;