/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react'
import sheetApi from '../../sheetApi'

export default function CreateRequest() {
  const [state, setState] = useState({
    isLoading: true,
    users: [],
    requests: [],
  })

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

  function getUserSorted(field) {
    return [...state.users].sort((a, b) => {
      if (field === "nbOfCollectedStars") return b.nbOfCollectedStars - a.nbOfCollectedStars
      if (a[field] > b[field]) return 1
      return -1
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="white-transparent-box">
      <h2 className="text-center">Create a Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group row">
          <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <select className="form-control" id="name">
              {state.isLoading && <option>Loading...</option>}
              {!state.isLoading && getUserSorted('name').map((user, i) => <option key={i} value={user.name}>{user.name}</option>)}
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
        <div className="form-group row">
          <div className="col-sm-2">
          </div>
          <div className="col-sm-10">
            <button className="btn btn-success">Create</button>
          </div>
        </div>
      </form>
    </div>
  )
}
