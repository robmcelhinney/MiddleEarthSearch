import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MiddleEarth from "./../MiddleEarth.json"
import Typography from "@material-ui/core/Typography";

class Search extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			query: '',
			chapters: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({query: event.target.value});
	}

	handleSubmit(event) {
		console.log(this.state.query);
        this.query_json();
        console.log("chapters: ", this.state.chapters)
		// console.log("cool beans")
		// this.query_sql();
		this.setState({query: ""});
		event.preventDefault();
	}

	componentDidMount() {

	}

    render() {
		console.log(this.state.chapters.length);
        return (
        	<div>
				<section id="section">
					<section className="query">Search Middle Earth</section>
					<form id="form" onSubmit={this.handleSubmit}>
						<input type="text" value={this.state.query}
								onChange={this.handleChange}
								placeholder="type query here" id="search"/>
						<input type="submit" value='Search' id="searchbox" />
				</form>
				</section>
				{this.state.chapters.map(item => (
					<Card>
						<CardContent>
							<Typography gutterBottom variant="h6" component="h2">
								{item['book_name']} - {item['chapter_name']}
							</Typography>
							<div dangerouslySetInnerHTML={{__html: item['paragraph']}} />
						</CardContent>
					</Card>
				))}

			</div>
        );
	}

    query_json() {
		// Gandalf the Grey
		let results = [];
		for(let book in MiddleEarth)
		{
			for(let section in MiddleEarth[book])
			{
				if(new RegExp(this.state.query, 'gi').
						test(MiddleEarth[book][section]['paragraph'])) {
					// MiddleEarth[book][section]['paragraph'] =
					// 		MiddleEarth[book][section]['paragraph'].
					// 		replace(this.state.query, "<b>" + this.state.query + "</b>")
					MiddleEarth[book][section]['paragraph'] =
						MiddleEarth[book][section]['paragraph'].replace(new RegExp(`(${this.state.query})`, 'gi'), '<b>$&</b>')

					console.log("matching: ", MiddleEarth[book][section]['paragraph'])
					results.push(MiddleEarth[book][section]);
				}
			}
		}
		console.log("results.length: ", results.length)
		this.state.chapters = results;
	}

	// query_sql() {
	// 	<script src='src/js/sql.js'></script>
	// 	<script>
	// 	const db_file = "../../MiddleEarth.db";
	// 	const contents = "SELECT text FROM chapters WHERE bookname='ROTK' and text LIKE '%Gandalf the Grey%';";
	// 	// contents[0].values.forEach((row) => { console.log(row); });
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.open('GET', db_file, true);
	// 	xhr.responseType = 'arraybuffer';
	// 	xhr.onload = function(e) {
	// 		var uInt8Array = new Uint8Array(this.response);
	// 		var db = new sql.Database(uInt8Array);
	// 		var stmt = db.prepare(contents);
	// 		// Bind values to the parameters and fetch the results of the query
	// 		while (stmt.step()) console.log(stmt.get());
	// 	};
	// 	xhr.send();
	// 	</script>
	// }
}

export default Search;
