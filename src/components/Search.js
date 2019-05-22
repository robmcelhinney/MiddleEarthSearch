import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MiddleEarth from "./../MiddleEarth.json"
import * as constants from "../constants";
import * as queryString from "query-string";

let MAXCARDS = 10;

class Search extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			query: this.props.query || "",
			chapters: [],
			count: null,
			currCount: 1,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.resetState = this.resetState.bind(this);

		this.props.history.listen((location) => {
			let values = queryString.parse(location.search);
			this.setState({query: values.q});
			this.reset_and_search();
		});
	}

	handleChange(event) {
		this.setState({query: event.target.value});
	}

	handleSubmit(event) {
		this.reset_and_search();
		event.preventDefault();
	}

	reset_and_search() {
		this.resetState();
		this.edit_url();
		this.query_json();
	}

	resetState() {
		this.state.chapters = [];
		this.state.count = 0;
		this.state.currCount = 1;
	};

	componentDidMount() {
		console.log("mounted search: ", this.props.query);
		if (this.props.query !== undefined) {
			// console.log("query not null in search");
			this.setState({query: this.props.query});
			this.query_json();
			this.edit_title();
		}
	}

	render() {
        return (
        	<div id={"search"}>
				<div id="search_container">
					<section id="section">
						<section className="query">Search Middle Earth</section>
						<form id="form" onSubmit={this.handleSubmit}>
							<input type="text" value={this.state.query}
									onChange={this.handleChange}
									placeholder="type query here" id="searchtext"/>
							<input type="submit" value='Search' id="searchbox" />
					</form>
					</section>
				</div>

				<div id="content">
					<div id="cards">
						{this.count()}
						{this.state.chapters.map(item => (
							<Card className={'card'} key={item['paragraph']}>
								<CardContent>
									<div className={"book_chap"}>
										{item['chapter_name']} - {item['book_name']}
									</div>
									{Search.paragraph(item)}
								</CardContent>
							</Card>
						))}
						{this.loadMore()}
					</div>
					<div id={"footer"}><a href={"https://twitter.com/RMcElhinney"}>Rob McElhinney</a></div>
				</div>
			</div>
        );
	}

    query_json() {
		// Gandalf the Grey
		// fly you fools
		// even as it fell it swung it's
		//saruman the white
		// This tale grew in the telling
		//tom bombadil
		let query = this.state.query.replace(/[.,\/#!$%\^&\*;:{}=\-_~()/"/']/g, "");
		query = query.trim();
		console.log("query: ", query);
		let results = this.state.chapters;
		let MiddleEarthObj = JSON.parse(JSON.stringify(MiddleEarth));
		let count = 0;
		let currCount = this.state.currCount;
		let maxCount = currCount + MAXCARDS;

		for(let book in MiddleEarth) {
			for(let section in MiddleEarthObj[book]) {
				let para = MiddleEarthObj[book][section]['paragraph'].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()/"/']/g,"");
				if(new RegExp(query, 'gi').test(para)
						&& !new RegExp(query).test("<b>")) {

					count++;
					if (currCount === maxCount || count < currCount) {
						continue;
					}
					currCount++;


					MiddleEarthObj[book][section]['paragraph'] =
						this.boldText(MiddleEarthObj[book][section]['paragraph'], query);

					if(Number(section) > 0 &&
							MiddleEarthObj[book][section]['chapter_num']
							=== MiddleEarthObj[book][Number(section) - 1][
							'chapter_num']) {
						MiddleEarthObj[book][section]['paragraphPrev'] =
								MiddleEarthObj[book][Number(section) - 1][
								'paragraph'].replace(/(<b>|<\/b>)/g,"");
					}
					if(Number(section) + 1 < MiddleEarthObj[book].length &&
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
		}
		this.setState({count: count});
		this.setState({currCount: currCount});
		this.setState({chapters: results});
	}

	count() {
		if(this.state.count !== null) {
			let result = "result";
			if(this.state.count > 1) {
				result += "s";
			}
			return (
				<Card  className={"card results_found"} key="count">
					<CardContent>
						<section>{this.state.count} {result} found.</section>
					</CardContent>
				</Card>
			);
		}
	}

	loadMore() {
		console.log("this.state.count: ", this.state.count);
		console.log("this.state.currCount: ", this.state.currCount);
		if(this.state.count !== null && this.state.count >= this.state.currCount) {
			return (
				<Card className={"card load_more clickable"} key="loadMore"
						onClick={e => this.handleLoadMore(e)}>
					<CardContent>
						<section>Load More</section>
					</CardContent>
				</Card>
			);
		}
	}

	handleLoadMore(event) {
		event.preventDefault();
		this.query_json();
	}

	static paragraph(item) {
		return (
			<div className={"paragraphs"}>
				{this.otherParagraphs(item['paragraphPrev'], "prev")}
				<div className={"results curr"} dangerouslySetInnerHTML={{__html: item['paragraph']}}/>
				{this.otherParagraphs(item['paragraphNext'], "next")}
			</div>
		)
	}

	static otherParagraphs(para, side) {
		if (para) {
			if (side === "prev") {
				return (
					<div className={"results prev"}>{para}</div>
				)
			}
			else {
				return (
					<div className={"results next"}>{para}</div>
				)
			}
		}
	}

	boldText(strSubject, query)
	{
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

	preg_quote(str, delimiter){
		return (str + '').replace(
				new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' +
				(delimiter || '') + '-]', 'g'), '\\$&');
	}

	basic_words(query) {
		let keyword_array = ['a','about','an','are','as','at','be', 'by','com','for','from','how','i','in','is','it','la','of','on','or', 'that','the','this','to','was','what','when','where', 'who','will','with'];
		query = query.replace('/\b(' + keyword_array.join('|') + ')\b/i', '');

		let replaced = query.replace(/\b\w+\b/g, function ($m) {
			let key = keyword_array.indexOf($m);
			return (key !== -1)? '' : $m;
		});
		replaced = replaced.replace(/\s+/g,' ');
		// console.log("replaced: ", replaced);
		replaced = replaced.trim();
		return replaced
	}

	edit_url() {
		window.history.pushState({}, document.title, "/#/?q=" + this.state.query);
		this.edit_title();
	}

	edit_title() {
		document.title = constants.title + ' - ' + this.state.query;
	}
}

export default Search;
