import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Interface from "./Interface";

import "./indexStyles.css";

ReactDOM.render(
  	<React.StrictMode>
		<App 
			documentInterface={Interface}
		/>
  	</React.StrictMode>,
  	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
