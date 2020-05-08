import React, { Component } from 'react';

import Workspace from "./components/Workspace";

class App extends Component {
	render() {
		return (
			<div className="App">
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
