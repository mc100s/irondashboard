import React, { Component } from 'react'
import api from '../api';

export default class WebsiteCard extends Component {
  getImage() {
    let desc = this.props.children.desc
    if (desc && desc.startsWith('![](')) {
      return desc.substr(4, desc.length - 5)
    }
    return "/img/default-icon.png"
  }
  handleClick = e => {
    api.getCardAttachments(this.props.children.id)
      .then(attachements => {
        console.log('TCL: componentDidMount -> attachements', attachements)
        if (attachements.length > 0) {
          window.open(attachements[0].url, '_blank')
          // win.focus()
        }
      })
  }
  render() {
    return (
      <div className="WebsiteCard" onClick={this.handleClick}>
        <img alt="background" src={this.getImage()} />
        <div className="name">{this.props.children.name}</div>
      </div>
    )
  }
}
