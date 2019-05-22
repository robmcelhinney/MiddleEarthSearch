import React from 'react';
import Search from './Search';
import * as queryString from "query-string";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
        };
    }

    componentWillMount() {
        let values = queryString.parse(this.props.location.search);
        this.setState({query: values.q});
    }

    render() {
        return (
            <div id={"app"}>
                <Search query={this.state.query} history={this.props.history}/>
            </div>
        );
	}
}

export default App;
