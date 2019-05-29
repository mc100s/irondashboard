import React, { useState, useEffect } from 'react'
import sheetApi from '../../sheetApi'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { useConnectedEmail } from '../../hooks'

function RequestView(props) {
  const row = Number(props.match.params.row)
  const [state, setState] = useState({
    isLoading: true,
    users: [],
    requests: [],
    reviewer: "",
  })
  const connectedEmail = useConnectedEmail()

  useEffect(() => {
    sheetApi.init()
      .then(() => Promise.all([sheetApi.getUsers(), sheetApi.getPendingRequests()]))
      .then(([fetchedUsers, fetchedRequests]) => {
        setState({
          isLoading: false,
          users: fetchedUsers,
          request: fetchedRequests.find(request => request.row === row)
        })
      })
  }, [])

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

  function markRequestResolved() {
    sheetApi.resolveRequest(row, connectedEmail.value)
      .then(() => {
        props.history.push('/')
      })
  }

  function getConnectedName() {
    if (connectedEmail.value) {
      let foundUser = state.users.find(user => user.email === connectedEmail.value)
      return foundUser && foundUser.name
    }
  }

  return (
    <div className="white-transparent-box">
      <h2 className="text-center">Request View</h2>

      {displayRow("Requester", state.request && state.request.requester)}

      {displayRow("Bounty", state.request && state.request.bounty + "⭐️")}

      {displayRow("Time", "...")}

      {displayRow("Message", state.request && state.request.message)}

      {displayRow("Reviewer", <div>
        {getConnectedName() && `${connectedEmail.value} - ${getConnectedName()}`}
      </div>)}

      {displayRow("Action", <>
        {!state.isLoading && connectedEmail.value && <button className="btn btn-success" onClick={markRequestResolved}>Mark as resolved {state.reviewer && "by " + state.reviewer}</button>}{' '}
        {!state.isLoading && !connectedEmail.value && <button className="btn btn-outline-primary" onClick={sheetApi.signIn}>Log in</button>}{' '}
        <Link className="btn btn-outline-danger" to="/">Go back</Link>{' '}
      </>)}
    </div>
  )
}

export default withRouter(RequestView)