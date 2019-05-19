import React from 'react';
import Search from './Search';
// import queryString from 'query-string';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
        };
    }

    componentDidMount() {
        // console.log(this.props.location.search)
        // const values = queryString.parse(this.props.location.search)
        // this.setState({query: values.q});
        // console.log(values.q) // "top"
        // console.log(values.origin) // "im"
    }

    render() {
        // console.log("rendering app: ", this.state.query);
        return (
            <div id={"app"}>
                <Search query={this.state.query}/>
            </div>
        );
	}
}

export default App;
