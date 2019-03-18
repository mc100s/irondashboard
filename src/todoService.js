export default {
  isCardDone(cardId) {
    return !!localStorage.getItem('card:'+cardId)
  },
  doCard(cardId) {
    localStorage.setItem('card:'+cardId, 'true')
  },
  undoCard(cardId) {
    localStorage.removeItem('card:'+cardId)
  },
  toggleCard(cardId) {
    if (this.isCardDone(cardId)) {
      this.undoCard(cardId)
    }
    else {
      this.doCard(cardId)
    }
  }
}