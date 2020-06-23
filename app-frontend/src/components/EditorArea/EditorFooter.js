import React from "react";

import ModeSelector from "./ModeSelector";
import WordcountDisplay from "./WordcountDisplay";

const EditorFooter = (props) => {
	return(
		<div className="editor-area-footer editor-footer">
			<span></span>
			<span><WordcountDisplay docList={props.docList}/></span>
			<span><ModeSelector split={props.split}/></span>
		</div>
	);
}

export default EditorFooter;