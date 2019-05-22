import React, { useEffect, useState } from 'react'
import sheetApi from '../sheetApi'

function IronStars() {
  // console.log("RENDER")

  let [isLoading, setIsLoading] = useState(true)
  let [users, setUsers] = useState([])
  let [requests, setRequests] = useState([])

  function getUserSorted(field) {
    return [...users].sort((a, b) => {
      if (field === "nbOfCollectedStars") return  b.nbOfCollectedStars - a.nbOfCollectedStars
      if (a[field] > b[field]) return 1
      return -1
    })
  }
 
  useEffect(() => {
    // console.log("componentDidMount")
    sheetApi.init()
      .then(() => Promise.all([sheetApi.getUsers(), sheetApi.getPendingRequests()]))
      .then(([fetchedUsers, fetchedRequests]) => {
        setIsLoading(false)
        setUsers(fetchedUsers)
        setRequests(fetchedRequests)
      })
  }, [])

  return (
    <div>
      <div className="row">
        <div className="col-md">
          <div className="white-transparent-box">
            <h2>Create a ticket</h2>
            <form>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                <div className="col-sm-10">
                  <select className="form-control" id="name">
                    {!users && <option>Loading...</option>}
                    {users && getUserSorted('name').map((user,i) => <option key={i} value={user.name}>{user.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="bounty" className="col-sm-2 col-form-label">Bounty</label>
                <div className="col-sm-10">
                  <select className="form-control" id="bounty">
                    <option value={1}>1⭐️</option>
                    <option value={2}>2⭐️</option>
                    <option value={3}>3⭐️</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="message" className="col-sm-2 col-form-label">Message</label>
                <div className="col-sm-10">
                  <textarea type="password" className="form-control" id="message" placeholder="Describe your problem" rows={5} />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md">
          <div className="white-transparent-box">
            <h2>Wall of Stars</h2>
            {isLoading && <div>Loading...</div>}
            {users && getUserSorted('nbOfCollectedStars').map((user, i) => <div key={i}>
              {user.nbOfCollectedStars}⭐️ {user.name}
            </div>)}
          </div>
        </div>
        <div className="col-md">
          <div className="white-transparent-box">
            <h2>Pending Requests</h2>
            {isLoading && <div>Loading...</div>}
            {JSON.stringify(requests)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(IronStars)