import React from 'react';
import ReactDOM from 'react-dom';
import App from '@fontaine/app-frontend';

/*import './fonts/Open_Sans/OpenSans-Regular.ttf';
import './fonts/Open_Sans/OpenSans-Bold.ttf';
import './fonts/Open_Sans/OpenSans-Italic.ttf';*/
import "./indexStyles.css";

import Interface from "./Interface";

ReactDOM.render(
  	<React.StrictMode>
		<App 
			documentInterface={Interface}
		/>
  	</React.StrictMode>,
  	document.getElementById('root')
);