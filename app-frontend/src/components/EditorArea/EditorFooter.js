import React from "react";

import ModeSelector from "./ModeSelector";
import WordcountDisplay from "./WordcountDisplay";

const EditorFooter = (props) => {
	return(
		<div className="editor-area-footer editor-footer">
			<span>
				<WordcountDisplay 
					curDocRow={props.curDocRow} 
					docList={props.docList} 
					split={props.split} 
				/>
			</span>
			<span></span>
			<span>
				<ModeSelector split={props.split} />
			</span>
		</div>
	);
}

export default EditorFooter;