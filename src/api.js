import axios from 'axios'

const service = axios.create({
  baseURL: 'https://api.trello.com/1/',
})

const errHandler = err => {
  console.error(err)
  if (err.response && err.response.data) {
    console.error("API response", err.response.data)
    throw err.response.data.message
  }
  throw err
}

export default {
  service: service,

  getBoard() {
    return service.get(`/boards/${process.env.REACT_APP_TRELLO_BOARD_ID}`, {
      params: {
        lists: 'open',
        labels: 'all',
        fields: 'name,desc,descData,closed,idOrganization,pinned,url,shortUrl,prefs,labelNames,badges',
        cards: 'visible',
      }
    })
      .then(res => res.data)
      .catch(errHandler)
  },

  getCardAttachments(cardId) {
    return service.get(`/cards/${cardId}/attachments`)
      .then(res => res.data)
      .catch(errHandler)
  },
}