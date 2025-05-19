// import { Server as IOServer } from 'socket.io'
// import { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'

// export const dynamic = 'force-dynamic'

// export async function GET(req: NextRequest) {
//   if (!globalThis.io) {
//     console.log('[socket.io] Initializing server...')

//     const io = new IOServer((req).socket?.server, {
//       path: '/api/socket',
//       addTrailingSlash: false,
//     });

//     io.on('connection', (socket) => {
//       console.log('[socket.io] Client connected:', socket.id)

//       socket.on('send-message', (data) => {
//         console.log('[socket.io] Message:', data)
//         socket.broadcast.emit('receive-message', data)
//       })

//       socket.on('disconnect', () => {
//         console.log('[socket.io] Client disconnected:', socket.id)
//       })
//     })
//     globalThis.io = io
//   }

//   return NextResponse.json({ status: 'ok' })
// }
