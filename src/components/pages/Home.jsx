import React, { Component } from 'react';
import api from '../../api';
import WeekSelector from '../WeekSelector';
import TrelloTodos from '../TrelloTodos';
import WebsiteCardsContainer from '../WebsiteCardsContainer';
import IronStars from '../IronStars'
import { Switch, Route } from 'react-router-dom'

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
      <div>

        <WeekSelector cards={this.state.cards} lists={this.state.lists} boardName={this.state.boardName} />

        {/* <IronStars /> */}

        <div className="row">
          <div className="col-md">
            <TrelloTodos cards={this.state.cards} lists={this.state.lists} />
          </div>
        </div>


        <WebsiteCardsContainer cards={this.state.cards} lists={this.state.lists} />
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
    }, 60 * 1000)
  }
}

export default App;
