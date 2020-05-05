import { combineReducers } from 'redux';
import workspaceReducer from "./workspaceSlice";
import editorReducer from "./editorSlice";

const rootReducer = combineReducers({
	workspaceReducer,
	editorReducer
});

export default rootReducer;