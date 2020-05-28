import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import ModalHandler from "./components/ModalHandler";
import Workspace from "./components/Workspace";
import SettingsHandler from "./components/SettingsHandler";
import ShortcutHandler from "./components/ShortcutHandler";
import DistractionFree from "./components/DistractionFree";

import "./styles/index.scss";

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<div className="App">
					<SettingsHandler />
					<ModalHandler />
					<ShortcutHandler />
					<DistractionFree />
					<main>
						<Workspace 
							documentInterface={this.props.documentInterface}
						/>
					</main>
					<footer>
					</footer>
				</div>
			</Provider>
		);
	}
}

export default App;
