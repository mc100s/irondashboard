import React, { Component } from 'react'
import api from '../api';
import TrelloCard from './TrelloCard'

export default class WeekSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      week: "", // number between 1 and 10
      day: "", // number between 1 and 7
      search: '',
      mode: 'D', // Possible values: 'D' (day), 'W'
    }

  }
  openFirstAttachmentUrl(e, id) {
    e.preventDefault()
    api.getCardAttachments(id)
      .then(attachements => {
        if (attachements.length > 0) {
          window.open(attachements[0].url, '_blank')
        }
      })
  }
  getCardsToDisplay(week = this.state.week, day = this.state.day) {
    // If there is no search, filter based on the week and day
    if (this.state.search.length === 0)
      return this.props.cards
        .filter(card => card.idList === this.getIdList(week, day))

    // Otherwise, filter based on the typed search (limit of 30 elements)
    let upperSearch = this.state.search.toUpperCase()
    return this.props.cards
      .filter(card => card.labels.length > 0
        && (card.name.toUpperCase().includes(upperSearch) || card.labels[0].name.toUpperCase().includes(upperSearch)))
    // .filter((card,i) => i < 30)
  }

  getIdList(week, day) {
    let list = this.props.lists.find(list => list.name === `Week ${week} - Day ${day}`)
    return list && list.id
  }
  handleWeekDayChange = e => {
    let key = e.target.id
    let target = e.target
    let value = Number(e.target.value)
    if (key === 'week') {
      this.setState({
        week: Math.max(value, 1)
      }, () => {
        target.select()
      })
    }
    else {
      this.setState({
        week: Math.max(this.state.week + Math.floor((value - 1) / 7), 1),
        day: ((value + 7 - 1) % 7) + 1
      }, () => {
        target.select()
      })
    }
  }
  displayFirstLabels(card) {
    let isSmall = window.innerWidth < 768;
    console.log('TCL: WeekSelector -> displayFirstLabels -> window.innerWidth', window.innerWidth)
    if (card.labels.length === 0) {
      return <span className="badge badge-dark">{isSmall ? 'N' : 'No Label'}</span>
    }
    return card.labels.map((label, i) => (
      <span key={i} className="badge badge-dark" style={this.getLabelStyle(label, isSmall)}>{!isSmall ? label.name : label.name[0]}</span>
    ))
  }
  resetWeekDay = e => {
    if (e) e.preventDefault()
    let startingDate = new Date(this.props.boardName.substr(-10))
    let nbOfDaysSinceTheBeginningOfBootcamp = Math.floor((new Date() - startingDate) / (1000 * 60 * 60 * 24))
    let week = Math.floor(nbOfDaysSinceTheBeginningOfBootcamp / 7) + 1
    let day = (nbOfDaysSinceTheBeginningOfBootcamp % 7) + 1
    this.setState({
      week,
      day,
    })
  }
  addWeekDay(delta, e) {
    if (e) e.preventDefault()
    if (this.state.mode === 'W') {
      this.setState({
        week: this.state.week + delta
      })
    }
    else {
      this.setState({
        week: Math.max(this.state.week + Math.floor((this.state.day + delta - 1) / 7), 1),
        day: ((this.state.day + delta + 7 - 1) % 7) + 1
      })
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
  selectInputContent = e => {
    e.target.select()
  }
  toggleMode = e => {
    e.preventDefault()
    this.setState({
      mode: this.state.mode === 'D' ? 'W' : 'D'
    })
  }
  render() {
    return (
      <div className="WeekSelector white-transparent-box">
        <h2>
          <form className="form-inline">
            {/* <div className="form-group mb-2"> */}
            Week
              <input type="number" className="form-control form-control-plaintext  week-day-selector" id="week" value={this.state.week} onChange={this.handleWeekDayChange} onFocus={this.selectInputContent} />
            {/* </div> */}
            {this.state.mode === 'D' && <>
              Day
              <input type="number" className="form-control form-control-plaintext week-day-selector" id="day" value={this.state.day} onChange={this.handleWeekDayChange} onFocus={this.selectInputContent} />
            </>}
            <div className="ml-auto mb-2">
              <button className="btn btn-outline-primary ml-1" onClick={this.toggleMode}><strong>{this.state.mode === 'D' ? 'W' : 'D'}</strong></button>
              <button className="btn btn-outline-primary ml-1" onClick={e => this.addWeekDay(-1, e)}><i className="fa fa-arrow-left"></i></button>
              <button className="btn btn-outline-primary ml-1" onClick={this.resetWeekDay}><i className="fa fa-calendar-day"></i></button>
              <button className="btn btn-outline-primary ml-1" onClick={e => this.addWeekDay(1, e)}><i className="fa fa-arrow-right"></i></button>
            </div>
          </form>
        </h2>
        <div className="search">
          <input className="form-control" placeholder="Type to search..." type="text" value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
        </div>

        {this.state.mode === 'D' || this.state.search ?
          (
            <div className="trello-card-container">
              {this.getCardsToDisplay().map(card => <TrelloCard key={card.id}>{card}</TrelloCard>)}
            </div>
          )
          :
          (
            <div className="row">
              {[1, 2, 3, 4, 5].map(day => (
                <div className="col-1-5" key={day}>
                  {this.getCardsToDisplay(this.state.week, day).map(card => <TrelloCard key={card.id}>{card}</TrelloCard>)}
                </div>
              ))}
            </div>
          )
        }
      </div>
    )
  }
  componentDidMount() {
    window.addEventListener('keydown', e => {
      console.log(e.keyCode)
      if (e.keyCode === 37) { // Left
        this.addWeekDay(-1)
      }
      else if (e.keyCode === 39) { // Right
        this.addWeekDay(1)
      }
      else if (e.keyCode === 32) { // Space
        if (e.target.tagName !== 'INPUT') e.preventDefault()
        console.log(e.target)
        this.resetWeekDay()
      }
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.boardName !== this.props.boardName) {
      this.resetWeekDay()
    }
  }
}
