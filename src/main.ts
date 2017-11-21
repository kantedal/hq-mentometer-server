import * as SocketIO from 'socket.io'
import { activeSessions } from './session'
import { startVote } from './startVote'
import { createMentometer } from './createMentometer'
import { connectToMentometer } from './connectToMentometer'
import { vote } from './vote'
import { finishSession } from './finishSession'
const shortid = require('shortid') 

const startServer = () => {
  const server = require('http').createServer()
  const io = SocketIO(server)

  io.on('connection', (client: SocketIO.Socket) => {
    client.on('action', (action) => {
      console.log('action', action)
      switch (action.type) {
        case 'server/createMentometer':
          createMentometer(client)
          break
        case 'server/connectToMentometer':
          connectToMentometer(action.payload, client)
          break
        case 'server/vote':
          vote(client, action.payload)
          break
        case 'server/startVote':
          startVote(client)
          break
        case 'server/finishSession':
          finishSession(client)
          break
      }
    })

    client.on('disconnect', () => finishSession(client))
  })

  server.listen(4000)
}

startServer()
