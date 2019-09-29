import React from 'react';
import Card from "@material-ui/core/Card";
import {PropTypes} from 'prop-types';
import CardContent from "@material-ui/core/CardContent";

class Content extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            perBookInfo: false
        };
    }

    render() {
        const { chapters } = this.props;
        return (
            <Card id="content">
                <div id="cards">
                    {this.count()}
                    {chapters.map(item => (
                        <Card
                            className={'card'}
                            key={item['paragraph']}>
                            <CardContent>
                                <div className={"book_chap"}
                                     style={{color: 'black'}}>
                                    {item['chapter_name']} - {item['book_name']}
                                </div>
                                {this.paragraph(item)}
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
        const {count} = this.props;
        if(count !== null) {
            let result = "result";
            if(count > 1) {
                result += "s";
            }
            return (
                <Card className={"card results_found clickable"} key="count"
                      style={{color: 'black'}}
                      onClick={e => this.handlePerBookCount(e)}>
                    <CardContent>
                        <section
                            style={{color: 'black'}}>{count} {result} found.</section>
                        <section
                            style={{color: 'black'}}>Click to search results by book.</section>
                        {this.resultsPerBook()}
                    </CardContent>
                </Card>
            );
        }
    }

    resultsPerBook = () => {
        const {perBookInfo} = this.state;
        const {perBookCount, count} = this.props;
        if (perBookInfo && count !== 0) {
            return (
                <>
                    {
                        Object.keys(perBookCount).map((key) => (
                            <section key={key}>{key}: {perBookCount[key]}</section>
                        ))
                    }
                </>
            )

        }
    }

    loadMore = () => {
        if(this.props.count !== null && this.props.count >= this.props.currCount) {
            return (
                <Card className={"card load_more clickable"} key="loadMore"
                      onClick={e => this.handleLoadMore(e)}>
                    <CardContent>
                        <section
                            style={{color: 'black'}}>Load More</section>
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
                 style={{color: 'black'}}>
                {this.otherParagraphs(item['paragraphPrev'], "prev")}
                <div className={"results curr"} dangerouslySetInnerHTML={{__html: item['paragraph']}}/>
                {this.otherParagraphs(item['paragraphNext'], "next")}
            </div>
        )
    }

    otherParagraphs = (para, side) => {
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
}

Content.propTypes = {
    query_json: PropTypes.func.isRequired,
    chapters: PropTypes.any.isRequired,
    currCount: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    perBookCount: PropTypes.any.isRequired,
};

export default Content;
