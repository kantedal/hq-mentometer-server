import * as SocketIO from 'socket.io'
import { activeSessions } from './session'

export const finishVote = (client: SocketIO.Socket) => {
  const activeSession = activeSessions[client['sessionId']]
  if (activeSession) {
    activeSession.activeVote = false
  }
}