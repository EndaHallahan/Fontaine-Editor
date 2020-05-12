import React, { Component } from 'react';

import ModalHandler from "./components/ModalHandler";
import Workspace from "./components/Workspace";
import SettingsHandler from "./components/SettingsHandler";

class App extends Component {
	render() {
		return (
			<div className="App">
				<SettingsHandler />
				<ModalHandler />
				<main>
					<Workspace />
				</main>
				<footer>
				</footer>
			</div>
		);
	}
}

export default App;
