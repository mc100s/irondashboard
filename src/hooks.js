import { useState, useEffect } from 'react'
import sheetApi from './sheetApi'

// Hook to get the email of the connected user
// The default value is null
// It changes when the user connects
export function useConnectedEmail() {
  const [email, setEmail] = useState({ value: null, isLoading: true });

  useEffect(() => {
    sheetApi.init()
      .then(email => {
        setEmail({ value: email, isLoading: false })
        sheetApi.listenForEmailOfConnectedUser(email => setEmail({ value: email, isLoading: false }))
      })
  }, []);
  return email;
}

