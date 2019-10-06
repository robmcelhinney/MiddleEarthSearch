import React from 'react';
import Card from "@material-ui/core/Card";
import {PropTypes} from 'prop-types';
import CardContent from "@material-ui/core/CardContent";

class Content extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			perBookInfo: false,
			clicked: []
		};
	}

	clickContent = (id) => {
		const { clicked } = this.state;
		console.log("clickContent")
		if (!clicked.includes(id)) {
			let joined = clicked.concat(id);
			this.setState({clicked: joined})
		}
		else {
			let array = [...clicked];
			const index = clicked.indexOf(id);
			array.splice(index, 1);
			this.setState({clicked: array})
		}
	}

	render() {
		const { chapters } = this.props;
		const { clicked } = this.state;
		return (
			<Card id="content">
				<div id="cards">
					{this.count()}
					{chapters.map(item => (
						<Card
							className={'card clickable'}
							key={item['paragraph']}
							onClick={() => this.clickContent(item['book_num'] + item['para_num'])}>
							<CardContent style={{position: 'relative', padding: 0, maxHeight: `${clicked.includes(item['book_num'] + item['para_num']) ? '' : '400px'}`}}>
								<div className={`book_chap ${clicked.includes(item['book_num'] + item['para_num']) ? '' : 'book_chap_shadow'}`}
									 style={{color: 'black', padding: '15px 15px 15px'}}>
									{item['book_name']} - {item['chapter_name']}
								</div>
								{this.paragraph(item)}
								<div className={`${clicked.includes(item['book_num'] + item['para_num']) ? 'last_shadow_clicked' : 'last_shadow'}`}/>
							</CardContent>
						</Card>
					))}
					{this.loadMore()}
				</div>
				<div id={"footer"}
					 style={{color: 'black'}}><a href={"https://mertun.artstation.com/projects/Gk16N"}>Shall Not Pass</a> - ömer tunç | Created by <a href={"https://twitter.com/RMcElhinney"}>Rob McElhinney</a></div>
			</Card>
		);
	}

	count = () => {
		const {count, query} = this.props;
		if(query !== null && count !== null) {
			let result = "result";
			if(count > 1) {
				result += "s";
			}
			return (
				<Card className={"card results_found clickable"} key="count"
					  style={{color: 'black', padding: '0'}}
					  onClick={e => this.handlePerBookCount(e)}>
					<CardContent>
						<section
							style={{color: 'black'}}>{count} {result} found.</section>
						{this.resultsPerBook()}
					</CardContent>
				</Card>
			);
		}
	}

	resultsPerBook = () => {
		const {perBookInfo} = this.state;
		const {perBookCount, count} = this.props;
		let result;
		if (count !== 0) {
			result = (
				<section
					style={{color: 'black'}}>Click to search results by book.</section>)
			if (perBookInfo) {
				result = (
					<>
						{result}
					{
						Object.keys(perBookCount).map((key) => (
							<section key={key}>{key}: {perBookCount[key]}</section>
						))
					}
					</>
				)
			}
		}
		return result;
	}

	loadMore = () => {
		if(this.props.count !== null && this.props.count >= this.props.currCount) {
			return (
				<Card className={"card load_more clickable"} key="loadMore"
					  onClick={e => this.handleLoadMore(e)}
					  style={{color: 'black', padding: '0'}}>
					<CardContent>
						<section>Load More</section>
					</CardContent>
				</Card>
			);
		}
	}

	handlePerBookCount = () => {
		this.setState({perBookInfo: !this.state.perBookInfo});
	}

	handleLoadMore = (event) => {
		event.preventDefault();
		this.props.query_json(false);
	}

	paragraph = (item) => {
		return (
			<div className={"paragraphs"}
				 style={{color: 'black', padding: '0 15px 15px 15px'}}>
				{this.otherParagraphs(item['paragraphPrev'], "prev", item)}
				<div className={"results curr"} dangerouslySetInnerHTML={{__html: item['paragraph']}}/>
				{this.otherParagraphs(item['paragraphNext'], "next", item)}
			</div>
		)
	}

	otherParagraphs = (para, side, item) => {
		const { clicked } = this.state;
		if (para) {
			if (side === "prev") {
				let topMargin;
				if( window.innerWidth <= 800 ) {
					topMargin = (Math.round(para.length / 30) * - 12) - 5;
				}
				else {
					topMargin = (Math.round(para.length / 120) * - 12) - 5;
				}
				if (clicked.includes(item['book_num'] + item['para_num'])) {
					topMargin = 15;
				}
				return (
					<div
						className={`results ${clicked.includes(item['book_num'] + item['para_num']) ? 'prev_clicked' : 'prev'}`}
						style={{marginTop: topMargin}}
					>
						{para}
					</div>
				)
			}
			else {
				return (
					<div className={"results next"}>{para}</div>
				)
			}
		}
	}
}

Content.propTypes = {
	query_json: PropTypes.func.isRequired,
	chapters: PropTypes.any.isRequired,
	currCount: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	query: PropTypes.string.isRequired,
	perBookCount: PropTypes.any.isRequired,
};

export default Content;
