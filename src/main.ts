import * as SocketIO from 'socket.io'
const shortid = require('shortid') 

const startServer = () => {
  const server = require('http').createServer()
  const io = SocketIO(server)

  io.on('connection', (client) => {
    console.log('Socket connected now: ' + client.id)
    client.emit('action', { type: 'message', data: 'good day!' })

    client.on('action', (action) => {
      console.log('action', action)
      switch (action.type) {
        case 'server/createMentometer':
          client.emit('action', { type: 'mentometerServerId', payload: shortid.generate() })
          break
      }
    })
  })

  server.listen(4000)
}

startServer()
