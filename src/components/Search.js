import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MiddleEarth from "./../MiddleEarth.json"

class Search extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			query: '',
			chapters: [],
			count: null,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		// console.log("constructor search: ", this.props.query)
	}

	handleChange(event) {
		this.setState({query: event.target.value});
	}

	handleSubmit(event) {
		this.setState({chapters: []});
        this.query_json();
        // console.log("chapters: ", this.state.chapters);
		event.preventDefault();
	}

	componentDidMount() {
		console.log("mounted search: ", this.props.query);
		if (this.props.query !== "") {
			// console.log("query not null in search");
			this.setState({query: this.props.query});
			this.query_json();
		}
	}

    render() {
        return (
        	<div>
				<div id="search_container">
					<section id="section">
						<section className="query">Search Middle Earth</section>
						<form id="form" onSubmit={this.handleSubmit}>
							<input type="text" value={this.state.query}
									onChange={this.handleChange}
									placeholder="type query here" id="search"/>
							<input type="submit" value='Search' id="searchbox" />
					</form>
					</section>
				</div>

				<div id={"content"}>
					<div id={"cards"}>
						{this.count()}
						{this.state.chapters.map(item => (
							<Card className={'card'} key={item['paragraph']}>
								<CardContent>
									<div className={"book_chap"}>
										{item['book_name']} - {item['chapter_name']}
									</div>
									{Search.paragraph(item)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
        );
	}

    query_json() {
		// Gandalf the Grey
		// fly you fools
		// This tale grew in the telling
		let query = this.state.query.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
		query = query.trim();
		// query = query.replace('!\s+!', ' ');
		// query = this.basic_words(query);
		let results = [];
		let MiddleEarthObj = JSON.parse(JSON.stringify(MiddleEarth));
		let count = 0;
		for(let book in MiddleEarth) {
			for(let section in MiddleEarthObj[book]) {
				let para = MiddleEarthObj[book][section]['paragraph'].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
				if(new RegExp(query, 'gi').test(para)
						&& !new RegExp(query).test("<b>")) {
					// MiddleEarthObj[book][section]['paragraph'] =
					// 		MiddleEarthObj[book][section]['paragraph']
					// 		.replace(new RegExp(`(${this.state.query})`,
					// 		'gi'), '<b>$&</b>');


					MiddleEarthObj[book][section]['paragraph'] =
						this.boldText(MiddleEarthObj[book][section]['paragraph'], query);



					if(Number(section) > 0 &&
							MiddleEarthObj[book][section]['chapter_num']
							=== MiddleEarthObj[book][Number(section) - 1][
							'chapter_num']) {
						MiddleEarthObj[book][section]['paragraphPrev'] =
								MiddleEarthObj[book][Number(section) - 1][
								'paragraph']
					}
					if(Number(section) < MiddleEarthObj[book].length  &&
							MiddleEarthObj[book][section]['chapter_num']
							=== MiddleEarthObj[book][Number(section) + 1][
							'chapter_num']) {
						MiddleEarthObj[book][section]['paragraphNext'] =
								MiddleEarthObj[book][Number(section) + 1][
								'paragraph']
					}
					results.push(MiddleEarthObj[book][section]);
					count++;
				}
			}
		}
		this.setState({count: count});
		this.setState({chapters: results});
	}

	count() {
		if(this.state.count !== null) {
			return (
				<section className={"results_found"}>{this.state.count} results found.</section>
			);
		}
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
		//crashed into the
		query = this.basic_words(query);
		let words = query.split(" ");
		// console.log("arrWords: ", arrWords)
		for (let s = 0; s < words.length; s += 1)
		{
			// console.log("s: ", words[s])
			// console.log("replace: ", this.preg_quote(words[s], "/"))
			let pattern = new RegExp(this.preg_quote(words[s], "/"),'gi');
			strSubject = strSubject.replace(pattern, "<b>$&</b>","\n");
		}
		// console.log(strSubject);
		return strSubject;
	}

	preg_quote(str, delimiter){
		return (str + '')
			.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
	}

	basic_words(query) {
		let keywordarray = ['a','about','an','are','as','at','be', 'by','com','for','from','how','i','in','is','it','la','of','on','or', 'that','the','this','to','was','what','when','where', 'who','will','with'];
		query = query.replace('/\b(' + keywordarray.join('|') + ')\b/i', '');
		// console.log("imploding string: ", keywordarray.join('|'))
		// console.log("query: ", query)

		let replaced = query.replace(/\b\w+\b/g, function ($m) {
			let key = keywordarray.indexOf($m);

			return (key !== -1)? '' : $m;
		});
		replaced = replaced.replace(/\s+/g,' ');
		console.log("replaced: ", replaced);
		replaced = replaced.trim();
		return replaced
	}
}

export default Search;
