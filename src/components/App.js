import React, { Component } from 'react';
import './App.css';
import api from '../api';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      boardName: '',
      cards: [],
      lists: [],
      week: null, // number between 1 and 10
      day: null, // number between 1 and 7
    }
  }
  getIdList() {
    let list = this.state.lists.find(list => list.name === `Week ${this.state.week} - Day ${this.state.day}`)
    return list && list.id
  }
  getCardsOfTheDate() {

    return this.state.cards
      .filter(card => card.idList === this.getIdList())
  }
  getLabelStyle(label){
    let dicColors = {
      green: '#61bd4f',
      yellow: '#f2d600',
      orange: '#ff9f1a',
      red: '#eb5a46',
      purple: '#c377e0',
      blue: '#0079bf',
      sky: '#00c2e0',
      lime: '#51e898',
      pink: '#ff78cb',
      black: '#355263',
    }
    return {
      backgroundColor: dicColors[label.color]
    }
  }
  render() {
    return (
      <div className="App">
        <h1>IronDashboard - Week {this.state.week} - Day {this.state.day}</h1>
        <p>Trello: <a href="https://trello.com/b/Fk50s50H/lis-ftwd-schedule-2019-03-18">https://trello.com/b/Fk50s50H/lis-ftwd-schedule-2019-03-18</a></p>
        <h2>Schedule of the day</h2>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Label</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {this.getCardsOfTheDate().map(card => <tr key={card.id}>
              {/* <td>{JSON.stringify(card.labels)}</td> */}
              <td>
                {card.labels.map((label,i)=>(
                  <span key={i} className="badge badge-dark" style={this.getLabelStyle(label)}>{label.name}</span>
                ))}
              </td>
              <td>{card.name}  </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
  componentDidMount() {
    api.getBoard()
      .then(board => {
        console.log('TCL: App -> componentDidMount -> board', board)

        let startingDate = new Date(board.name.substr(-10))
        let nbOfDaysSinceTheBeginningOfBootcamp = Math.floor((new Date() - startingDate) / (1000*60*60*24))
        let week = Math.floor(nbOfDaysSinceTheBeginningOfBootcamp / 7) + 1
        let day = (nbOfDaysSinceTheBeginningOfBootcamp % 7) + 1

        this.setState({
          boardName: board.name,
          cards: board.cards,
          lists: board.lists,
          week,
          day,
        })
      })
  }
}

export default App;
