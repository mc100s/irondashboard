import React, { Component } from 'react';
import { getBackgroundOfTheDay } from '../utils'
import Home from './pages/Home'
import CreateRequest from './pages/CreateRequest'
import RequestView from './pages/RequestView'
import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App" style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${getBackgroundOfTheDay()})` }}>
        <div className="container" >
          <h1 className="text-center mt-5">IronDashboard</h1>

          <Switch>
            <Route path="/create-request" component={CreateRequest} />
            <Route path="/request-view/:row" component={RequestView} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
