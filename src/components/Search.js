import React, {createRef} from 'react';
import Card from "@material-ui/core/Card";
import MiddleEarth from "./../MiddleEarth.json"
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
		if (this.props.query && this.props.query !== undefined) {
			// console.log("query not null in search");
			this.setState({query: this.props.query});
			this.query_json();
			this.edit_title();
		}
	}

	reset_and_search = () => {
		//TODO ignore reset state from history.listen
		this.resetState();
		if (this.state.query) {
            this.query_json();
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
        const checked = event.target.checked;
        if (checked && !this.state.books.includes(event.target.name)) {
            // add book to state
            let joined = this.state.books.concat(event.target.name);
            // console.log("add book. joined: ", joined);
            this.setState({books: joined})
            // this.state.bookcs = joined;
        }
        else if (!checked && this.state.books.includes(event.target.name)){
            // remove book from state
            let array = [...this.state.books];
            const index = this.state.books.indexOf(event.target.name);
            array.splice(index, 1);
            // console.log("removed [index]: ", this.state.books[index]);
            // console.log("removed: ", array)
            this.setState({books: array})
        }
        // console.log("checked books ", this.state.books);
    }

	render() {
		const { classes } = this.props;
		const { books, chapters } = this.state;
        return (
        	<>
        	<div id={"search"}>
				<Card id="search_container_default">
					<section id="section">
						<section className="query">Search Middle Earth</section>
						<SearchBar
							onChange={(e) => this.setState({query: e})}
							onRequestSearch={() => this.reset_and_search()}
							style={{
								margin: '0 auto',
								maxWidth: 800
							}}
							value={this.state.query || ""}
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
								{/*<FormGroup aria-label="position" name="position" row>*/}
									{/*<FormControlLabel*/}
										{/*value="TABA"*/}
										{/*control={<Checkbox style={{color: 'white'}} />}*/}
										{/*label={*/}
											{/*<Typography*/}
												{/*style={{color: 'white'}}>*/}
												{/*The Hobbit*/}
											{/*</Typography>}*/}
										{/*labelPlacement="end"*/}
										{/*name="TABA"*/}
										{/*defaultChecked={books.includes("TABA")}*/}
										{/*onChange={this.handleChangeBooks}*/}
										{/*className={classes.label}*/}
									{/*/>*/}
								{/*</FormGroup>*/}
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
				/>
			</div>
			</>
        );
	}

    query_json = (freshSearch=true) => {
        // console.log("querying json");
		let query = this.state.query.replace(/[.,/#!$%^&*;:{}=\-_~()/"/']/g, "");
		query = query.trim();
		if (query == null) {
			return;
		}
		const MiddleEarthObj = JSON.parse(JSON.stringify(MiddleEarth));
	    let count = 0;
	    let results = [];
	    let currCount = 1;
	    if (!freshSearch) {
		    results = this.state.chapters;
		    currCount = this.state.currCount;
	    }
		let maxCount = currCount + MAXCARDS;
	    let perBookCount = {};

		for(let book in MiddleEarth) {
			let countPerBook = 0;
            if (this.state.books.length === 0 || this.state.books.includes(book)) {
                for (let section in MiddleEarthObj[book]) {
                    let para = MiddleEarthObj[book][section]['paragraph'].replace(/[.,/#!$%^&*;:{}=\-_`~()/"/']/g, "");
                    if (new RegExp(query, 'gi').test(para)
                        && !new RegExp(query).test("<b>")) {
						countPerBook++;
                        count++;
                        if (currCount === maxCount || count < currCount) {
                            continue;
                        }
                        currCount++;
                        MiddleEarthObj[book][section]['paragraph'] =
                            this.boldText(MiddleEarthObj[book][section]['paragraph'], query);

                        if (Number(section) > 0 &&
                            MiddleEarthObj[book][section]['chapter_num']
                            === MiddleEarthObj[book][Number(section) - 1][
                                'chapter_num']) {
                            MiddleEarthObj[book][section]['paragraphPrev'] =
                                MiddleEarthObj[book][Number(section) - 1][
                                    'paragraph'].replace(/(<b>|<\/b>)/g, "");
                        }
                        if (Number(section) + 1 < MiddleEarthObj[book].length &&
                            MiddleEarthObj[book][section]['chapter_num']
                            === MiddleEarthObj[book][Number(section) + 1][
                                'chapter_num']) {
                            MiddleEarthObj[book][section]['paragraphNext'] =
                                MiddleEarthObj[book][Number(section) + 1][
                                    'paragraph']
                        }
                        results.push(MiddleEarthObj[book][section]);
                    }
                }
				perBookCount[book] = countPerBook;
            }
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
		// I am very fond indeed of
		query = this.basic_words(query);
		let words = query.split(" ");
		for (let s = 0; s < words.length; s += 1)
		{
			let pattern = new RegExp('\\b' + this.preg_quote(words[s], "/") + '\\b','gi');
			// console.log("pattern: ", pattern);
			strSubject = strSubject.replace(pattern, "<b>$&</b>","\n");
		}
		return strSubject;
	}

	preg_quote = (str, delimiter) => {
		return (str + '').replace(
				new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' +
				(delimiter || '') + '-]', 'g'), '\\$&');
	}

	basic_words = (query) => {
		let keyword_array = ['a','about','an','are','as','at','be', 'by','com','for','from','how','i','in','is','it','la','of','on','or', 'that','the','this','to','was','what','when','where', 'who','will','with'];
		query = query.replace('/\b(' + keyword_array.join('|') + ')\b/i', '');
		let replaced = query.replace(/\b\w+\b/g, function ($m) {
			let key = keyword_array.indexOf($m);
			return (key !== -1)? '' : $m;
		});
		replaced = replaced.replace(/\s+/g,' ');
		replaced = replaced.trim();
		return replaced
	}

	edit_url = () => {
	    let book_param = "";
	    if (this.state.books && this.state.books.length > 0) {
	        book_param = this.state.books.map(a => "&books[]=" + a).join('');
            // console.log("book param: ", book_param);
            // console.log("book_param: ", book_param);
        }
		window.history.pushState({}, document.title, "/MiddleEarthSearch/#/?q=" + this.state.query + book_param);
		this.edit_title();
	}

	edit_title = () => {
		document.title = constants.title + ' - ' + this.state.query;
	}
}

Search.propTypes = {
	classes: PropTypes.object.isRequired,
};

// export default Search;
export default withStyles(styles)(Search);
