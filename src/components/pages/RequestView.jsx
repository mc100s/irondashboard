import React, { useState, useEffect } from 'react'
import sheetApi from '../../sheetApi'
import { Link } from 'react-router-dom'

export default function RequestView(props) {
  const row = Number(props.match.params.row)
  const [state, setState] = useState({
    isLoading: true,
    users: [],
    requests: [],
    reviewer: ""
  })

  useEffect(() => {
    sheetApi.init()
      .then(() => Promise.all([sheetApi.getUsers(), sheetApi.getPendingRequests()]))
      .then(([fetchedUsers, fetchedRequests]) => {
        console.log("TCL: RequestView -> fetchedRequests", fetchedRequests)
        console.log("TCL: RequestView -> props.match.params", props.match.params)
        setState({
          isLoading: false,
          users: fetchedUsers,
          request: fetchedRequests.find(request => request.row === row)
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
  function displayRow(label, content) {
    return <div className="row my-4">
      <div className="col-2">
        <strong>{label}</strong>
      </div>
      <div className="col-10">
        {content}
      </div>
    </div>
  }

  function handleReviewerChange(e) {
    setState({
      ...state,
      reviewer: e.target.value
    })
  }

  function markRequestResolved(){
    sheetApi.resolveRequest(row, 'Boooooom')
  }

  return (
    <div className="white-transparent-box">
      <h2 className="text-center">Request View</h2>

      {displayRow("Requester", state.request && state.request.requester)}

      {displayRow("Bounty", state.request && state.request.bounty+"⭐️")}

      {displayRow("Time", "...")}

      {displayRow("Message", state.request && state.request.message)}

      {displayRow("Reviewer", <select className="form-control" value={state.reviewer} onChange={handleReviewerChange}>
        <option value="">Select...</option>
        {!state.isLoading && getUserSorted('name').map((user, i) => <option key={i} value={user.name}>{user.name}</option>)}
      </select>)}

      {displayRow("Action", <>
        <button className="btn btn-success" onClick={markRequestResolved}>Mark as resolved {state.reviewer && "by "+state.reviewer}</button>{' '}
        <Link className="btn btn-outline-danger" to="/">Go back</Link>
      </>)}


      This is not working because we need to be probably need to be connected. Check <u>test.html</u> 
    </div>
  )
}
