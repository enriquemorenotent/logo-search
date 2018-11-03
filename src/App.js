import React, { Component } from "react";
import "./App.css";

class App extends Component {
	state = {
		keywords: "",
		logos: [],
		loading: false,
		error: false
	};

	handleKeywordsChange = ({ target }) =>
		this.setState({ keywords: target.value });

	url = keyword =>
		`https://autocomplete.clearbit.com/v1/companies/suggest?query=${keyword}`;

	updateLogos = async response => {
		const results = await response.json();
		this.setState({ logos: results, loading: false });
	};

	setError = error => this.setState({ error: error, loading: false });

	unexpectedError = () => this.setError("Something unexpected happened...");

	emptyStringError = () =>
		this.setError(
			<span>
				Did you just try to send an empty query?&nbsp;&nbsp;&nbsp;{" "}
				<strong>¬_¬</strong>
			</span>
		);

	handleSubmit = async e => {
		e.preventDefault();

		if (this.state.keywords === "") {
			this.emptyStringError();
			return;
		}

		this.setState({ loading: true, error: false });

		const response = await fetch(this.url(this.state.keywords));

		response.status === 200
			? this.updateLogos(response)
			: this.unexpectedError();
	};

	render = () => (
		<div className="App">
			<header>
				<div className="container">
					<h1>Logo finder</h1>
				</div>
			</header>

			<main>
				<div className="container">
					{this.state.error && (
						<div className="columns">
							<div className="column">
								<div className="notification is-danger">
									<h1>Error</h1>
									{this.state.error}
								</div>
							</div>
						</div>
					)}
					<div className="columns">
						<div className="column">
							<form onSubmit={this.handleSubmit}>
								<div className="field">
									<label className="label">Name</label>
									<div className="control">
										<input
											className="input"
											type="text"
											placeholder="Logo name"
											onChange={this.handleKeywordsChange}
											value={this.state.keywords}
										/>
									</div>
								</div>
								<div className="field is-grouped">
									<div className="control">
										<button
											className={`button is-link ${this.state.loading &&
												"is-loading"}`}
										>
											Search
										</button>
									</div>
								</div>
							</form>
						</div>
						<div className="column">
							{this.state.logos.map((logo, index) => (
								<img className="logo" key={index} src={logo.logo} alt="" />
							))}
						</div>
					</div>
				</div>
			</main>
			<footer class="footer">
				<div class="content has-text-centered">
					<p>
						Logo search powered by{" "}
						<strong>
							<a href="https://clearbit.com/logo">Clearbit</a>
						</strong>
					</p>
				</div>
			</footer>
		</div>
	);
}

export default App;
