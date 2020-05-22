import React, {createRef} from 'react';
import Card from "@material-ui/core/Card";
import MiddleEarth from "../MiddleEarth.json"
import * as constants from "../constants";
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import SearchBar from 'material-ui-search-bar';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/styles';
import Typography from "@material-ui/core/Typography";
import Content from "./Content";

let MAXCARDS = 10;

const styles = () => ({
	label: {
		color: 'white',
	},
});

// Gandalf the Grey
// fly you fools
// even as it fell it swung it's
//saruman the white
// This tale grew in the telling
//tom bombadil

class Search extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			MiddleEarthJson: {},
			query: this.props.query,
			chapters: [],
			count: 0,
			perBookCount: {},
			currCount: 1,
			books: this.props.books,
		};
		this.myRef = createRef();

		this.props.history.listen((location) => {
			const search = location.search;
			const params = new URLSearchParams(search);
			const q = params.get('q');
			const books = params.getAll('books[]');
			this.setState({
				query: q,
				books: books
			});
			this.reset_and_search();
		});
	}

	componentDidMount() {
		const MiddleEarthObj = JSON.parse(JSON.stringify(MiddleEarth));
		this.setState({
			MiddleEarthJson: MiddleEarthObj
		})
		if (this.props.query && this.props.query !== undefined) {
			this.setState({query: this.props.query});
			this.query_json(true, MiddleEarthObj);
			this.edit_title();
		}
	}

	reset_and_search = () => {
		//TODO ignore reset state from history.listen
		this.resetState();
		if (this.state.query) {
			this.query_json(true);
			this.edit_url();
		}
	}

	resetState = () => {
		this.setState({
			chapters: [],
			count: 0,
			currCount: 1,
			perBookCount: {}
		});
	}

	handleChangeBooks = (event) => {
		const { books } = this.state;
		const checked = event.target.checked;
		if (checked && !books.includes(event.target.name)) {
			// add book to state
			let joined = books.concat(event.target.name);
			this.setState({books: joined})
		}
		else if (!checked && books.includes(event.target.name)){
			// remove book from state
			let array = [...books];
			const index = books.indexOf(event.target.name);
			array.splice(index, 1);
			this.setState({books: array})
		}
	}

	render() {
		const { classes } = this.props;
		const { books, chapters, query } = this.state;
		return (
			<>
			<div id={"search"}>
				<Card id="search_container_default">
					<section id="section">
						<section className="title">{constants.title}</section>
						<SearchBar
							onChange={(e) => this.setState({query: e})}
							onRequestSearch={() => this.reset_and_search()}
							style={{
								margin: '0 auto',
								maxWidth: 800
							}}
							placeholder={"type query here..."}
							value={query || ""}
						/>
						<section>
							<FormControl component="fieldset">
								<FormGroup aria-label="position" name="position" row>
									<FormControlLabel
										value="TFOTR"
										control={<Checkbox style={{color: 'white'}} defaultChecked={books.includes("TFOTR")}/>}
										label={
											<Typography
													style={{color: 'white'}}>
												The Fellowship of the Ring
											</Typography>}
										labelPlacement="end"
										name="TFOTR"
										defaultChecked={books.includes("TFOTR")}
										onChange={this.handleChangeBooks}
										className={classes.label}
									/>
									<FormControlLabel
										value="TTT"
										control={<Checkbox style={{color: 'white'}} defaultChecked={books.includes("TTT")}/>}
										label={
											<Typography
													style={{color: 'white'}}>
												The Twin Towers
											</Typography>}
										labelPlacement="end"
										name="TTT"
										defaultChecked={books.includes("TTT")}
										onChange={this.handleChangeBooks}
										className={classes.label}
									/>
									<FormControlLabel
										value="ROTK"
										control={<Checkbox style={{color: 'white'}} defaultChecked={books.includes("ROTK")}/>}
										label={
											<Typography
													style={{color: 'white'}}>
												The Return of the King
											</Typography>}
										labelPlacement="end"
										name="ROTK"
										defaultChecked={books.includes("ROTK")}
										onChange={this.handleChangeBooks}
										className={classes.label}
									/>
								</FormGroup>
								{/* <FormGroup aria-label="position" name="position" row>
									<FormControlLabel
										value="TABA"
										control={<Checkbox style={{color: 'white'}} />}
										label={
											<Typography
												style={{color: 'white'}}>
												The Hobbit
											</Typography>}
										labelPlacement="end"
										name="TABA"
										defaultChecked={books.includes("TABA")}
										onChange={this.handleChangeBooks}
										className={classes.label}
									/>
								</FormGroup> */}
							</FormControl>
						</section>
					</section>
				</Card>
			</div>
			<div ref={this.myRef}>
				<Content
					query_json={this.query_json}
					chapters={chapters}
					currCount={this.state.currCount}
					count={this.state.count}
					perBookCount={this.state.perBookCount}
					query={this.state.query}
				/>
			</div>
			</>
		);
	}

	query_json = (freshSearch=true, MiddleEarthJson=null) => {
		// uses regex to find query in books.
		// freshSearch means to search from scratch or to continue on 
		// from previous search by remembering where it stopped.
		const { books } = this.state;
		if (MiddleEarthJson === null){
			MiddleEarthJson = this.state.MiddleEarthJson;
		}
		let query = this.state.query.replace(/[.,/#!$%^&*;:{}=\-_~()/"/']/g, "");
		query = query.trim();
		if (query == null) {
			return;
		}
		let count = 0;
		let results = [];
		let currCount = 1;

		if (!freshSearch) {
			// Get where last search stopped.
			results = this.state.chapters;
			currCount = this.state.currCount;
		}
		let maxCount = currCount + MAXCARDS;
		let perBookCount = {};

		console.log("MiddleEarthJson: ", MiddleEarthJson)

		// Stores changes from MiddleEarthJson so it doesn't change on 
		// each search.
		let resultJson = {}
		let bookNum = 1
		for(let book in MiddleEarthJson) {
			let countPerBook = 0;
			if (books.length === 0 || books.includes(book)) {
				resultJson[book] = {}
				let paraNum = 1
				for (let section in MiddleEarthJson[book]) {
					let para = MiddleEarthJson[book][section]['paragraph'].replace(/[.,/#!$%^&*;:{}=\-_`~()/"/']/g, "");
					
					if (new RegExp(query, 'giu').test(para)
							&& !new RegExp(query).test("<b>")) {
						
						resultJson[book][section] = Object.assign({}, MiddleEarthJson[book][section])
						resultJson[book][section]["para_num"] = paraNum
						resultJson[book][section]["book_num"] = bookNum
						countPerBook++;
						count++;
						if (currCount === maxCount || count < currCount) {
							continue;
						}
						currCount++;
						
						// Get current paragraph
						resultJson[book][section]["paragraph"] =
							this.boldText(MiddleEarthJson[book][section]["paragraph"], query);

						// Get previous paragraph if it exists
						if (Number(section) > 0 &&
								MiddleEarthJson[book][section]["chapter_num"]
								=== MiddleEarthJson[book][Number(section) - 1][
									"chapter_num"]) {
							resultJson[book][section]["paragraphPrev"] =
									MiddleEarthJson[book][Number(section) - 1][
									"paragraph"].replace(/(<b>|<\/b>)/g, "");
						}

						// Get next paragraph if it exists
						if (Number(section) + 1 < MiddleEarthJson[book].length &&
								MiddleEarthJson[book][section]["chapter_num"]
								=== MiddleEarthJson[book][Number(section) + 1][
								"chapter_num"]) {
							resultJson[book][section]["paragraphNext"] =
									MiddleEarthJson[book][Number(section) + 1][
									"paragraph"]
						}
						results.push(resultJson[book][section]);
					}
					paraNum++
				}
				perBookCount[MiddleEarthJson[book][0]["book_name"]] = countPerBook;
			}
			bookNum++
		}

		if (freshSearch) {
			this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}

		this.setState({
			count: count,
			currCount: currCount,
			chapters: results,
			perBookCount: perBookCount,
		});
	}

	boldText = (strSubject, query) => {
		// Bold query inside strSubject and return result 
		query = this.basic_words(query);
		let words = query.split(" ");
		for (let s = 0; s < words.length; s += 1){
			const pattern = new RegExp(
					'\\b' + this.preg_quote(words[s]) + '\\b','gi');
			strSubject = strSubject.replace(pattern, "<b>$&</b>","\n");
		}
		return strSubject;
	}

	preg_quote = (str) => {
		// takes str and puts a backslash in front of every character 
		// that is part of the regular expression syntax
		return (str + '').replace(
				new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\/-]", 'g'),
				'\\$&');
	}

	basic_words = (query) => {
		// Takes common words out of query
		const keyword_array = ['a','about','an','are','as','at','be', 'by',
				'com','for','from','how','i','in','is','it','la','of','on',
				'or', 'that','the','this','to','was','what','when','where', 
				'who','will','with']
		query = query.replace('/\b(' + keyword_array.join('|') + ')\b/i', '');
		let replaced = query.replace(/\b\w+\b/g, function ($m) {
			const key = keyword_array.indexOf($m);
			return (key !== -1)? '' : $m;
		});
		// replaces any any whitespace character with single space
		replaced = replaced.replace(/\s+/g,' ')
		// strip trailing whitespaces
		replaced = replaced.trim()
		return replaced
	}

	edit_url = () => {
		// Edits url for SPA.
		const { books, query } = this.state;
		let book_param = "";
		if (books && books.length > 0) {
			book_param = books.map(a => "&books[]=" + a).join('');
		}
		window.history.pushState({}, document.title, "/MiddleEarthSearch/#/?q=" + query + book_param);
		this.edit_title();
	}

	edit_title = () => {
		// Updates page title with current query.
		document.title = constants.title + ' - ' + this.state.query;
	}
}

Search.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
