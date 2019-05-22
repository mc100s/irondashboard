
let config = {
  apiKey: 'AIzaSyAgb5ZU_Yi5BkFBgDTRSn38CSs0CxcfXQk',
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheetId: '1pcOFqbaV5tkx-BuR_p9w6qKFjHcdnvkOzAYg3kkDBgM'
}


export default {
  // This function should be triggered once before the others
  init() {
    return new Promise((resolve, reject) => {
      window.gapi.load("client", () => {
        window.gapi.client
          .init({
            apiKey: config.apiKey,
            // Your API key will be automatically added to the Discovery Document URLs.
            discoveryDocs: config.discoveryDocs
          })
          .then(() => resolve())
      })
    })
  },
  // Generic method to get a raw sheet
  // Parameter range: string. Example: 'Users!A2:D'
  // Return value: a Promise where the resolve value is a matrix of strings
  getRawSheet(range) {
    return new Promise((resolve, reject) => {
      window.gapi.client.load("sheets", "v4", () => {
        window.gapi.client.sheets.spreadsheets.values
          .get({
            spreadsheetId: config.spreadsheetId,
            range
          })
          .then(
            response => resolve(response.result.values),
            response => reject(response.result.error)
          );
      });

    })
  },
  // Generic method to get a raw sheet
  // Parameter range: string. Example: 'Users!A2:D'
  // Return value: a Promise where the resolve value is an array of "documents" (= objects), like with MongoDB
  getSheetDocuments(sheetName) {
    return this.getRawSheet(sheetName+'!A:Z')
      .then(matrix => {
        let documents = []
        for (let row = 1; row < matrix.length; row++) {
          let newDocument = {}
          for (let col = 0; col < matrix[row].length; col++) {
            newDocument[matrix[0][col]] = matrix[row][col]
          }
          documents.push(newDocument)
        }
        return documents
      })
  },
  getUsers() {
    return this.getSheetDocuments('Users')
  },
  getRequests() {
    return this.getSheetDocuments('Requests')
  },
  getPendingRequests() {
    return this.getRequests()
      .then(requests => requests.filter(request => !request.reviewer))
  }
}