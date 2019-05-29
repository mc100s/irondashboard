
let config = {
  apiKey: 'AIzaSyAgb5ZU_Yi5BkFBgDTRSn38CSs0CxcfXQk',
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheetId: '1pcOFqbaV5tkx-BuR_p9w6qKFjHcdnvkOzAYg3kkDBgM',
  clientId: '1084444028956-54sqdi5l025gap61l5842boeoun7ahaa.apps.googleusercontent.com',
  scope: "https://www.googleapis.com/auth/spreadsheets"
}


export default {
  // This function should be triggered once before the others
  // Returns a promise and the resolved value is a boolean that is true when the user is already loggedin
  init() {
    return new Promise((resolve, reject) => {
      window.gapi.load("client", () => {
        window.gapi.client
          .init({
            apiKey: config.apiKey,
            // Your API key will be automatically added to the Discovery Document URLs.
            discoveryDocs: config.discoveryDocs,
            clientId: config.clientId,
            scope: config.scope
          })
          .then(() => {
            let basicProfile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
            resolve(basicProfile ? basicProfile.getEmail() : null)
          })
      })
    })
  },

  listenForEmailOfConnectedUser(cb) {
    window.gapi.auth2.getAuthInstance().currentUser.listen(googleUser => {
      // If the user is signedIn
      if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) 
        cb(googleUser.getBasicProfile().getEmail())
      else
        cb(null)
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
    return this.getRawSheet(sheetName + '!A:Z')
      .then(matrix => {
        let documents = []
        for (let row = 1; row < matrix.length; row++) {
          let newDocument = { row }
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
  },
  resolveRequest(requestRow, reviewer) {
    return new Promise((resolve, request) => {
      window.gapi.client.load("sheets", "v4", () => {
        window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: config.spreadsheetId,
          range: `Requests!E${requestRow+1}:E${requestRow+1}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[reviewer]]
          }
        }).then((response) => {
          resolve(response)
          var result = response.result;
          console.log(`${result.updatedCells} cell(s) updated`);
        });
      })

    })

  },

  signIn() {
    window.gapi.auth2.getAuthInstance().signIn();
  },

  signOut() {
    window.gapi.auth2.getAuthInstance().signOut();
  }
}