import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import App from "./App"
import "semantic-ui-css/semantic.min.css"
import * as serviceWorker from './serviceWorker';
import { createStore,applyMiddleware } from "redux";
import { Provider } from 'react-redux'
import rootReducer from '../src/store/reducers/rootReducer'
import thunk from 'redux-thunk'

const store = createStore(rootReducer,applyMiddleware(thunk))

ReactDOM.render(<Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
