import express, { Express, Request, Response } from 'express';
import * as http from 'http'
import next, { NextApiHandler } from 'next'
import * as socketio from 'socket.io';

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler: NextApiHandler = nextApp.getRequestHandler()

let users: any = [];

nextApp.prepare().then(async() => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);
  const io:socketio.Server = new socketio.Server();
  
  io.attach(server);

  app.get('/hello', async( _: Request, res: Response)=>{
    res.send('hello world!');
  })


  io.on('connection', (socket: socketio.Socket)=>{
    socket.on('login', ({userName, email=''})=>{
      const newUser = {id: socket.id, userName, email, connectionTime: Date.now() }
      users = [...users, newUser]
      socket.emit('connectedUser', JSON.stringify(newUser));
      io.emit('users', JSON.stringify(users));
    })

    socket.on('sendMessage', (msgTo)=>{
      console.log(msgTo);
      msgTo = JSON.parse(msgTo);
      const minutes = new Date().getMinutes();

      io.emit('getMsg', JSON.stringify({
        id: socket.id,
        userName: users.find( (user:any) => user.id===msgTo.id).userName,
        msg: msgTo.msg,
        time: `${new Date().getHours()}:${minutes<10?'0'+minutes:minutes}`
      }));
    });

    socket.once('disconnect', ()=>{
      users = users.filter((user:any) => user.id!==socket.id)
      io.emit('users', JSON.stringify(users))
    })

  })

  app.all('*', (req:any, res:any)=> nextHandler(req, res));

  server.listen(port, ()=>{
    console.log(`> Ready on port http://localhost:${port}`)
  })

  // createServer((req, res) => {
  //   const parsedUrl = parse(req.url!, true)
  //   handle(req, res, parsedUrl)
  // }).listen(port)

  // // tslint:disable-next-line:no-console
  // console.log(
  //   `> Server listening at http://localhost:${port} as ${
  //     dev ? 'development' : process.env.NODE_ENV
  //   }`
  // )
})
