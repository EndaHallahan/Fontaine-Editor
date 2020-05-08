import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { IconContext } from "react-icons";
import * as serviceWorker from './serviceWorker';

import "./styles/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    	<IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      		<App />
      	</IconContext.Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
