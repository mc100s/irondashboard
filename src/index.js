import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App.jsx';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));