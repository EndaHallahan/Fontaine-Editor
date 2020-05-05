import React, { Component } from 'react';

import Workspace from "./components/Workspace";

class App extends Component {
	render() {
		return (
			<div className="App">
				<header>
					<h1>Fontaine</h1>
				</header>
				<main>
					<Workspace />
				</main>
			</div>
		);
	}
}

export default App;
