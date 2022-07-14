import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { regUser } from '../redux/reducers/login'
import { history } from '../redux'

const Registration = () => {

  const dispatch = useDispatch()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  return (
    <div>
      <input
        className="border rounded"
        type="text"
        name="email"
        value={form.email}
        onChange={(e) => {
          setForm({ ...form, [e.target.name]: e.target.value })
        }}
      />
      <input
        className="border rounded"
        type="text"
        name="password"
        value={form.password}
        onChange={(e) => {
          setForm({ ...form, [e.target.name]: e.target.value })
        }}
      />
      <button
        type="button"
        className="border rounded"
        onClick={() => {
          dispatch(regUser(form))
          setForm({ email: '', password: '' })
          history.push('/')
        }}
      >
        Registration
      </button>
      <Link to="/"> Log In</Link>
    </div>
  )
}

Registration.propTypes = {}

export default React.memo(Registration)
