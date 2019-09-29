import React from 'react';
import {render} from 'react-dom';
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import './css/style.css';
import App from './components/App';
import NotFound from './components/NotFound';

const Root = () => {
    return(
        <Router basename='/'>
            <Switch>
                <Route path='/' component={App} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    )
};

render(<Root/>, document.querySelector('#root'));
