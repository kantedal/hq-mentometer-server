import * as SocketIO from 'socket.io'
import { activeSessions } from './session'

export const startVote = (client: SocketIO.Socket) => {
  const activeSession = activeSessions[client['sessionId']]
  if (activeSession) {
    activeSession.activeVote = true
    activeSession.currentVote = {
      voteA: 0,
      voteB: 0,
      voteC: 0,
      userVotes: []
    }
    
    for (const connectedClient of activeSession.clients) {
      connectedClient.emit('action', { type: 'voteStarted' })
    }
  }
}