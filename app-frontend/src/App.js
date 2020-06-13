import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import ModalHandler from "./components/ModalHandler";
import Workspace from "./components/Workspace";
import SettingsHandler from "./components/SettingsHandler";
import ShortcutHandler from "./components/ShortcutHandler";
import DistractionFree from "./components/DistractionFree";
import AutoSaveHandler from "./components/AutoSaveHandler";
import StatusDisplay from "./components/StatusDisplay";

import "./styles/index.scss";

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<div className="App">
					<SettingsHandler documentInterface={this.props.documentInterface} />
					<ModalHandler documentInterface={this.props.documentInterface} />
					<ShortcutHandler documentInterface={this.props.documentInterface} />
					<DistractionFree documentInterface={this.props.documentInterface} />
					<AutoSaveHandler documentInterface={this.props.documentInterface} />
					<main>
						<Workspace 
							documentInterface={this.props.documentInterface}
						/>
					</main>
					<footer>
						<StatusDisplay />
					</footer>
				</div>
			</Provider>
		);
	}
}

export default App;
