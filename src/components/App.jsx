import React, { Component } from 'react';
import WebsiteCard from './WebsiteCard'
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
  getTodoCards() {
    try {
      let todoListId = this.state.lists.find(list => list.name === 'TODO').id
      return this.state.cards
        .filter(card => card.idList === todoListId)
    }
    catch (e) {
      return []
    }
  }
  getWebsitesCards() {
    try {
      let todoListId = this.state.lists.find(list => list.name === 'Websites').id
      return this.state.cards
        .filter(card => card.idList === todoListId)
    }
    catch (e) {
      return []
    }
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
  openFirstAttachmentUrl(e, id) {
    console.log('TCL: App -> openFirstAttachmentUrl -> id', id)
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
  displayFirstLabels(card) {
    if (card.labels.length === 0) {
      return <span className="badge badge-dark">No Label</span>
    }
    return card.labels.map((label, i) => (
      <span key={i} className="badge badge-dark" style={this.getLabelStyle(label)}>{label.name}</span>
    ))
  }
  render() {
    return (
      <div className="App container">
        <h1 className="text-center mt-3">IronDashboard</h1>

        <div className="WebsiteCards-container mt-5">
          {this.getWebsitesCards().map(card => (
            <WebsiteCard key={card.id}>{card}</WebsiteCard>
          ))}
        </div>

        <h2 className="mt-5">
          <form className="form-inline">
            <div className="form-group mb-2">
              <label htmlFor="week">Week </label>
              <input type="number" className="form-control week-day-selector" id="week" value={this.state.week} onChange={this.handleWeekDayChange} />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="day"> - Day </label>
              <input type="number" className="form-control week-day-selector" id="day" value={this.state.day} onChange={this.handleWeekDayChange} />
            </div>
            <button className="btn btn-outline-primary mb-2 ml-auto" onClick={this.resetWeekDay}>Reset to current day</button>
          </form>
        </h2>
        {/* <h2>Week <input type="number" className="form-control week-day-selector" id="week" value={this.state.week} onChange={this.handleWeekDayChange} style={{display: 'inline'}} /> - Day {this.state.day}</h2> */}
        <table className="table table-sm">
          <thead>
            <tr>
              {/* <th>Label</th> */}
              <th>Content</th>
              <th>Extra Attachments</th>
            </tr>
          </thead>
          <tbody>
            {this.getCardsOfTheDate().map(card => <tr key={card.id}>
              {/* <td>{JSON.stringify(card.labels)}</td> */}
              <td>
                {this.displayFirstLabels(card)}
              {/* </td>
              <td> */}
                {card.badges.attachments > 0 && <a href="/#" onClick={e => this.openFirstAttachmentUrl(e, card.id)}>{card.name}</a>}
                {card.badges.attachments === 0 && card.name}
              </td>
              <td>{card.badges.attachments > 1 && <a href={card.shortUrl} target="_blank">Go to the card</a>}</td>
            </tr>)}
          </tbody>
        </table>


        <h2 className="mt-5">TODO</h2>
        <ul>
          {this.getTodoCards().map(card => (
            <li key={card.id}>
              {card.badges.attachments > 0 && <a href="/#" onClick={e => this.openFirstAttachmentUrl(e, card.id)}>{card.name}</a>}
              {card.badges.attachments === 0 && card.name}
            </li>
          ))}
        </ul>
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
