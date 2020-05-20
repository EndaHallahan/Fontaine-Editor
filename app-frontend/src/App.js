import React, { Component } from 'react';

import ModalHandler from "./components/ModalHandler";
import Workspace from "./components/Workspace";
import SettingsHandler from "./components/SettingsHandler";
import ShortcutHandler from "./components/ShortcutHandler";
import DistractionFree from "./components/DistractionFree";

class App extends Component {
	render() {
		return (
			<div className="App">
				<SettingsHandler />
				<ModalHandler />
				<ShortcutHandler />
				<DistractionFree />
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
