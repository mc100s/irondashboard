import React, { Component } from 'react'
import api from '../api';
import {Input} from 'reactstrap'
import todoService from '../todoService';

export default class TrelloTodos extends Component {
  getTodoCards() {
    try {
      let todoListId = this.props.lists.find(list => list.name === 'TODO').id
      return this.props.cards
        .filter(card => card.idList === todoListId)
    }
    catch (e) {
      return []
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
  getCardLinkWithFirstAttachmentOrName(card) {
    if (card.badges.attachments > 0)
      return <a href="/#" onClick={e => this.openFirstAttachmentUrl(e, card.id)}>{card.name}</a>
    else 
      return card.name
  }
  changeCheckbox(cardId) {
    todoService.toggleCard(cardId)
    this.forceUpdate()
  }
  render() {
    return (
      <div className="white-transparent-box">
        <h2>TODO</h2>
        {this.getTodoCards().map(card => (
          <div key={card.id} className="form-group form-check">
            <Input type="checkbox" checked={todoService.isCardDone(card.id)} onChange={()=>this.changeCheckbox(card.id)} />
            <label className="form-check-label">{this.getCardLinkWithFirstAttachmentOrName(card)}</label>
          </div>
        ))}
      </div>
    )
  }
}
