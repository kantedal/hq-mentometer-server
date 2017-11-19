import * as SocketIO from 'socket.io'
import { activeSessions } from './session'
import { startVote } from './startVote'
import { createMentometer } from './createMentometer'
import { connectToMentometer } from './connectToMentometer'
import { vote } from './vote';
const shortid = require('shortid') 

const startServer = () => {
  const server = require('http').createServer()
  const io = SocketIO(server)

  io.on('connection', (client: SocketIO.Socket) => {
    console.log('Socket connected now: ' + client.id)
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
      }
    })

    client.on('disconnect', () => {
      if (client['sessionId']) {
        const clientSession = activeSessions[client['sessionId']]
        if (clientSession) {
          if (clientSession.host.id === client.id) {
            for (const connectedClient of clientSession.clients) {
              connectedClient.emit('action', { type: 'sessionEnded' })
            }
            delete activeSessions[client['sessionId']]
          } else {
            clientSession.clients = clientSession.clients.filter((connectedClient) => connectedClient.id !== client.id)
            clientSession.host.emit('action', { type: 'clientConnected', payload: clientSession.clients.length })
          }
        }
      }
    })
  })

  server.listen(4000)
}

startServer()
