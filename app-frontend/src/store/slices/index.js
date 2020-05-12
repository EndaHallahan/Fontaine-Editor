import { combineReducers } from 'redux';
import workspaceReducer from "./workspaceSlice";
import modalReducer from "./modalSlice";

const rootReducer = combineReducers({
	workspaceReducer,
	modalReducer,
});

export default rootReducer;