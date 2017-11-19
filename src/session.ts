export interface IVoteStatistics {
  voteA: number
  voteB: number
  voteC: number
  userVotes: string[]
}

export interface IMentometerSession {
  id: string
  host: SocketIO.Socket
  clients: SocketIO.Socket[]
  activeVote: boolean
  currentVote: IVoteStatistics
}

export const activeSessions: { [sessionId: string]: IMentometerSession } = {}