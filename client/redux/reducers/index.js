import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth from './auth'
import login from './login'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    login
  })

export default createRootReducer
