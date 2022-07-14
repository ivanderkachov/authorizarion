import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

import mongooseService from './services/mongoose'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

require('colors')

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const mongoUrl = 'mongodb+srv://ivanderkachov:63441257I@cluster0.uwzfx.mongodb.net/Tasks'

mongooseService.connect(mongoUrl)

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const User = mongoose.model('userlist', userSchema)

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.post(
  '/api/v1/users',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Incorrect password').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data'
        })
      }
      const { email, password } = req.body
      const isUsed = await User.findOne({ email })

      if (isUsed) {
        return res.status(300).json({ message: 'Email is already used' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const userObj = new User({
        email,
        password: hashedPassword
      })
      await userObj.save()
      res.status(200).json({ message: 'User is added' })
    } catch (err) {
      console.log(err)
    }
  }
)

server.post(
  '/api/v1/usersverify',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Incorrect password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login data'
        })
      }
      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({message: 'Email doesn`t exist'})
      }
      const isMatch = bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Password incorrect' })
      }

      const jwtSecret = 'helloworld2022'
      const token = jwt.sign(
        {userId: user.id},
        jwtSecret,
        {expiresIn: '1h'}
      )
      res.json({token, userId: user.id})

    } catch (err) {
      console.log(err)
    }
  }
)

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
