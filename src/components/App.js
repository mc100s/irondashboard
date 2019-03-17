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
      week: "", // number between 1 and 10
      day: "", // number between 1 and 7
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
  getLabelStyle(label) {
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
  handleContentClick(e, id) {
    console.log('TCL: App -> handleContentClick -> id', id)
    e.preventDefault()
    api.getCardAttachments(id)
      .then(attachements => {
        console.log('TCL: componentDidMount -> attachements', attachements)
        if (attachements.length > 0) {
          window.open(attachements[0].url, '_blank')
          // win.focus()
        }
      })

  }
  handleWeekDayChange = e => {
    let key = e.target.id
    let value = Number(e.target.value)
    if (key === 'week') {
      this.setState({
        week: value
      })
    }
    else {
      this.setState({
        week: this.state.week + Math.floor((value-1)  / 7),
        day: ((value+7-1)%7)+1
      })
    }
  }
  resetWeekDay = e => {
    if (e) e.preventDefault()
    let startingDate = new Date(this.state.boardName.substr(-10))
    let nbOfDaysSinceTheBeginningOfBootcamp = Math.floor((new Date() - startingDate) / (1000 * 60 * 60 * 24))
    let week = Math.floor(nbOfDaysSinceTheBeginningOfBootcamp / 7) + 1
    let day = (nbOfDaysSinceTheBeginningOfBootcamp % 7) + 1
    this.setState({
      week,
      day,
    })

  }
  render() {
    return (
      <div className="App container">
        <h1>IronDashboard - Week {this.state.week} - Day {this.state.day}</h1>
        <p>Trello: <a href="https://trello.com/b/Fk50s50H/lis-ftwd-schedule-2019-03-18">https://trello.com/b/Fk50s50H/lis-ftwd-schedule-2019-03-18</a></p>
        <form className="form-inline">
          <div className="form-group mb-2">
            <label htmlFor="week">Week: </label>
            <input type="number" className="form-control week-day-selector" id="week" value={this.state.week} onChange={this.handleWeekDayChange} />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="day">Day: </label>
            <input type="number" className="form-control week-day-selector" id="day" value={this.state.day} onChange={this.handleWeekDayChange} />
          </div>
          <button className="btn btn-outline-primary mb-2" onClick={this.resetWeekDay}>Reset to current day</button>

        </form>
        <h2>Schedule of the day</h2>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Label</th>
              <th>Content</th>
              <th>Extra Attachments</th>
            </tr>
          </thead>
          <tbody>
            {this.getCardsOfTheDate().map(card => <tr key={card.id}>
              {/* <td>{JSON.stringify(card.labels)}</td> */}
              <td>
                {card.labels.map((label, i) => (
                  <span key={i} className="badge badge-dark" style={this.getLabelStyle(label)}>{label.name}</span>
                ))}
              </td>
              <td>
                {card.badges.attachments > 0 && <a href="https://trello.com/b/Fk50s50H/lis-ftwd-schedule-2019-03-18" onClick={e => this.handleContentClick(e, card.id)}>{card.name}</a>}
                {card.badges.attachments === 0 && card.name}
              </td>
              <td>{card.badges.attachments}</td>
            </tr>)}
          </tbody>
        </table>

        <hr/>

        <h2>TODO</h2>
        <p>Fetch data from a column</p>
      </div>
    );
  }
  componentDidMount() {

    api.getBoard()
      .then(board => {
        console.log('TCL: App -> componentDidMount -> board', board)

        this.setState({
          boardName: board.name,
          cards: board.cards,
          lists: board.lists,
        }, () => {
          this.resetWeekDay()
        })
      })
  }
}

export default App;
