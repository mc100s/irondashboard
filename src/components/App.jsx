import React, { Component } from 'react';
import api from '../api';
import { getBackgroundOfTheDay } from '../utils'
import WeekSelector from './WeekSelector';
import TrelloTodos from './TrelloTodos';
import WebsiteCardsContainer from './WebsiteCardsContainer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      boardName: '',
      cards: [],
      lists: [],
      week: "", // number between 1 and 10
      day: "", // number between 1 and 7
    }
  }
  
  
  render() {
    return (
      <div className="App" style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${getBackgroundOfTheDay()})` }}>
        <div className="container" >
          <h1 className="text-center mt-5">IronDashboard</h1>

          <WebsiteCardsContainer cards={this.state.cards} lists={this.state.lists} />

          <WeekSelector cards={this.state.cards} lists={this.state.lists} boardName={this.state.boardName} />

          <div className="row">
            <div className="col-md">
              <TrelloTodos cards={this.state.cards} lists={this.state.lists} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    api.getBoard()
      .then(board => {
        this.setState({
          boardName: board.name,
          cards: board.cards,
          lists: board.lists,
        })
      })
    
    // Update every minute
    setInterval(() => {
      api.getBoard()
      .then(board => {
        this.setState({
          boardName: board.name,
          cards: board.cards,
          lists: board.lists,
        })
      })
    }, 60*1000)
  }
}

export default App;
