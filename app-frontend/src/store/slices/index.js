import { combineReducers } from 'redux';
import workspaceReducer from "./workspaceSlice";

const rootReducer = combineReducers({
	workspaceReducer,
});

export default rootReducer;