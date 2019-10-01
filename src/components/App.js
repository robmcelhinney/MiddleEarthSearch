import React from 'react';
import Search from './Search';
import theme from '../Theme';
import {MuiThemeProvider} from '@material-ui/core/styles';

class App extends React.Component {

	constructor(props) {
		super(props);

		const search = this.props.location.search;
		const params = new URLSearchParams(search);
		const books = params.getAll('books[]');
		const query = params.get('q');

		this.state = {
			query: query,
			books: books,
		};
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<div id={"app"}>
					<Search query={this.state.query} books={this.state.books}
							history={this.props.history}/>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
