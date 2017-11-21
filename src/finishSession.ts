import * as SocketIO from 'socket.io'
import { activeSessions } from './session'

export const finishSession = (client: SocketIO.Socket) => {
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
}