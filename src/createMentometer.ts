import * as SocketIO from 'socket.io'
import { activeSessions } from './session'
const shortid = require('shortid') 

export const createMentometer = (client: SocketIO.Socket) => {
  const mentometerId: string = shortid.generate().toLowerCase()

  activeSessions[mentometerId] = {
    id: mentometerId,
    host: client,
    clients: [],
    activeVote: false,
    currentVote: {
      voteA: 0,
      voteB: 0,
      voteC: 0,
      userVotes: [] 
    }
  }
  
  client.emit('action', { type: 'mentometerServerId', payload: mentometerId })
  client['sessionId'] = mentometerId
}