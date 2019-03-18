import React, { Component } from 'react'
import WebsiteCard from './WebsiteCard';

export default class WebsiteCardsContainer extends Component {
  getWebsitesCards() {
    try {
      let todoListId = this.props.lists.find(list => list.name === 'Websites').id
      return this.props.cards
        .filter(card => card.idList === todoListId)
    }
    catch (e) {
      return []
    }
  }
  render() {
    return (
      <div className="WebsiteCardsContainer">
        {this.getWebsitesCards().map(card => (
          <WebsiteCard key={card.id}>{card}</WebsiteCard>
        ))}
      </div>
    )
  }
}
