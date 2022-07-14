import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { authUser } from '../redux/reducers/login'
import { history } from '../redux'




const Auth = () => {

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
          dispatch(authUser(form))
          setForm({ email: '', password: '' })
          history.push('/')
        }}
      >
        Log In
      </button>
      <Link to="/registration"> Registration</Link>
    </div>
  )
}




Auth.propTypes = {}

export default React.memo(Auth)
