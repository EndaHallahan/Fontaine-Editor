import React, { Component } from 'react';

import ModalHandler from "./components/ModalHandler";
import Workspace from "./components/Workspace";

class App extends Component {
	render() {
		return (
			<div className="App">
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
