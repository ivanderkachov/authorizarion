import axios from 'axios'

const REG_USER = 'REG_USER'

const initialState = {
  users: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case REG_USER: {
      return {
        ...state,
        users: action.form
      }
    }
    default:
      return state
  }
}

export function regUser(form) {
  return (dispatch) => {
    return axios.post(
      '/api/v1/users',
      { ...form },
      {headers: {
          'Content-type': 'application/json'
        }
      }
    )
    .then((res)=> {
      console.log(res)
      dispatch({
        type: REG_USER,
        form
      })
    })
  }
}

export function authUser(form) {
  return (dispatch) => {
    return axios
      .post(
        '/api/v1/usersverify',
        { ...form },
        {
          headers: {
            'Content-type': 'application/json'
          }
        }
      )
      .then(({ data }) => {
        const user = data
        localStorage.setItem('userData', JSON.stringify(data))
        dispatch({
          type: REG_USER,
          form: user
        })
      })
  }
}
