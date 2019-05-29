/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import sheetApi from '../sheetApi'

function IronStars() {
  console.log("RENDER")

  const [state, setState] = useState({
    isLoading: true,
    users: [],
    requests: [],
  })

  function getUserSorted(field) {
    return [...state.users].sort((a, b) => {
      if (field === "nbOfCollectedStars") return b.nbOfCollectedStars - a.nbOfCollectedStars
      if (a[field] > b[field]) return 1
      return -1
    })
  }

  useEffect(() => {
    sheetApi.init()
      .then(() => Promise.all([sheetApi.getUsers(), sheetApi.getPendingRequests()]))
      .then(([fetchedUsers, fetchedRequests]) => {
        setState({
          isLoading: false,
          users: fetchedUsers,
          requests: fetchedRequests
        })
      })
  }, [])

  return (
    <div>
      <div className="row">
        {/* <div className="col-md-3">
          <div className="white-transparent-box">
            <h2>Create a ticket</h2>
            <form>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                <div className="col-sm-10">
                  <select className="form-control" id="name">
                    {!users && <option>Loading...</option>}
                    {users && getUserSorted('name').map((user, i) => <option key={i} value={user.name}>{user.name}</option>)}
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
        </div> */}
        <div className="col-lg-3">
          <div className="white-transparent-box">
            <h2>Star Wars</h2>
            {state.isLoading && <div>Loading...</div>}
            {getUserSorted('nbOfCollectedStars').map((user, i) => <div key={i}>
              {user.nbOfCollectedStars}⭐️ {user.name}
            </div>)}
          </div>
        </div>
        <div className="col-lg">
          <div className="white-transparent-box">
            <div className="flex-spaced-center">
              <h2>Pending Requests</h2>
              <Link className="btn btn-outline-primary" to="/create-request">Create Request</Link>
            </div>
            <table className="table table-sm table-borderless table-hover">
              <thead>
                <tr>
                  <th>Bounty</th>
                  <th>Requester</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              {!state.isLoading && <tbody>
                {state.requests.map((request, i) => <tr key={i}>
                  <td>{request.bounty}⭐️️️️</td>
                  <td>{request.requester}</td>
                  <td>...</td>
                  <td>
                    <Link className="btn btn-outline-success btn-block" to={"/request-view/" + request.row}>View</Link>
                  </td>
                </tr>)}
              </tbody>}
            </table>
            {state.isLoading && <div>Loading...</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(IronStars)