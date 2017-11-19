import * as SocketIO from 'socket.io'
import { activeSessions } from './session'
const shortid = require('shortid') 

export const vote = (client: SocketIO.Socket, vote: number) => {
  const activeSession = activeSessions[client['sessionId']]
  if (activeSession) {
    if (activeSession.activeVote) {
      let userAlreadyVoted = false
      for (const userId of activeSession.currentVote.userVotes) {
        if (userId === client.id) {
          userAlreadyVoted = true
          break
        }
      }

      if (!userAlreadyVoted) {
        switch (vote) {
          case 0:
            activeSession.currentVote.voteA += 1
            break
          case 1:
            activeSession.currentVote.voteB += 1
            break
          case 2:
            activeSession.currentVote.voteC += 1
            break
        }

        for (const connectedClient of activeSession.clients) {
          connectedClient.emit('action', { type: 'voteUpdate', payload: activeSession.currentVote })
        }
        activeSession.host.emit('action', { type: 'voteUpdate', payload: activeSession.currentVote })
      }
    }
  }
}