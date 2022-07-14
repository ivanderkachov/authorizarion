import React from 'react'
import { Provider, useSelector } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect, StaticRouter } from 'react-router-dom'

import store, { history } from '../redux'

import Home from '../components/home'
import Main from '../components/main'
import Registration from '../components/registration'

import Auth from '../components/auth'
import NotFound from '../components/404'

import Startup from './startup'

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.token)
  const func = (props) => {
    if (!!user && !!user.name && !!token) <Redirect to={{ pathname: '/' }} />
    return <Component {...props} />
  }
  return <Route {...rest} render={func} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.token)

  const func = (props) => {
    if (!!user && !!user.name && !!token) return <Component {...props} />

    return (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  }
  return <Route {...rest} render={func} />
}

const RouterSelector = (props) =>
  typeof window !== 'undefined' ? <ConnectedRouter {...props} /> : <StaticRouter {...props} />

const logIn = () => {
  const isLogin = JSON.parse(localStorage.getItem('userData'))
  if (isLogin && isLogin.token) {
    return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/dashboard" component={Home} />
        <PrivateRoute exact path="/hidden-route" component={Auth} />
        <OnlyAnonymousRoute exact path="/anonymous-route" component={Auth} />

        <Route component={NotFound} />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route exact path="/" component={Auth} />
      <Route exact path="/auth" component={Auth} />
      <Route exact path="/registration" component={Registration} />
      <Route exact path="/dashboard" component={Home} />
      <PrivateRoute exact path="/hidden-route" component={Auth} />
      <OnlyAnonymousRoute exact path="/anonymous-route" component={Auth} />

      <Route component={NotFound} />
    </Switch>
  )
}


const RootComponent = (props) => {
  return (
    <Provider store={store}>
      <RouterSelector history={history} location={props.location} context={props.context}>
        <Startup>
          <Switch>
            {logIn()}
            {/* <Route exact path="/auth" component={Auth} />
            <Route exact path="/registration" component={Registration} />
            <Route exact path="/dashboard" component={Home} />
            <PrivateRoute exact path="/hidden-route" component={Auth} />
            <OnlyAnonymousRoute exact path="/anonymous-route" component={Auth} />

            <Route component={NotFound} /> */}
          </Switch>
        </Startup>
      </RouterSelector>
    </Provider>
  )
}

export default RootComponent
