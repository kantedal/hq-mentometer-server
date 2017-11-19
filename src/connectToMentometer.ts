import * as SocketIO from 'socket.io'
import { activeSessions } from './session'

export const connectToMentometer = (serverId: string, client: SocketIO.Socket) => {
  const activeSession = activeSessions[serverId]
  if (activeSession) {
    let alreadyConnected = false
    for (const connectedClient of activeSession.clients) {
      if (connectedClient.id === client.id) {
        alreadyConnected = true
        break
      }
    }

    if (!alreadyConnected) {
      activeSession.clients.push(client)
    }
    
    for (const connectedClient of activeSession.clients) {
      connectedClient.emit('action', { type: 'clientConnected', payload: activeSession.clients.length })
    }
    activeSession.host.emit('action', { type: 'clientConnected', payload: activeSession.clients.length })
    
    client['sessionId'] = serverId
    client.emit('action', { type: 'mentometerConnectionSuccess' })
  }
  else {
    client.emit('action', { type: 'mentometerConnectionFailed' })
  }
}