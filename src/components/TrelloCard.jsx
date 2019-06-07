import React from 'react'
import ReactMarkdown from 'react-markdown'
import api from '../api';

export default function TrelloCard({ children: card }) {
  function openFirstAttachmentUrl(e, id) {
    e.preventDefault()
    api.getCardAttachments(id)
      .then(attachements => {
        if (attachements.length > 0) {
          window.open(attachements[0].url, '_blank')
        }
      })
  }
  function getLabelStyle(label) {
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
  function displayFirstLabels(card) {
    // let isSmall = window.innerWidth < 768;
    if (card.labels.length === 0) {
      return <span className="badge badge-dark">No Label</span>
    }
    return card.labels.map((label, i) => (
      <span key={i} className="badge badge-dark" style={getLabelStyle(label)}>{label.name}</span>
    ))
  }
  return (
    <div className="TrelloCard">
      {/* {JSON.stringify(card, null, 2)} */}

      {displayFirstLabels(card)}
      {card.badges.attachments > 0 && <a href="/#" onClick={e => openFirstAttachmentUrl(e, card.id)}><strong>{card.name}</strong></a>}
      {card.badges.attachments === 0 && <strong>{card.name}</strong>}
      <div className="TrelloCard__content">
        <ReactMarkdown
          source={card.desc && ("&gt; " + card.desc)}
          renderers={{ link: props => <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a> }}
        />
      </div>
    </div>
  )
}
