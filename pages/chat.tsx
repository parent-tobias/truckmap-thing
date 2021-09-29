import { useState, useEffect} from 'react';
import userGen from 'username-generator';

const Chat = (props:any)=>{
  const { socket } = props;
  const [users, setUsers]=useState({
    usersList: [] as any,
  })
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState({
    messageList: [] as any
  });
  const [loggedUser, setLoggedUser] = useState({} as any);

  useEffect(()=>{
    // subscribe a new user
    socket.emit('login', userGen.generateUsername() );
    // list of connected users
    socket.on('users', (data:any)=>{
      setUsers({usersList: JSON.parse(data) })
    });
    // get the connected user
    socket.on('connectedUser', (data:any) => {
      setLoggedUser(JSON.parse(data) )
    })
    socket.on('getMsg', (data:any) => {
      let msgList = messages.messageList;
      msgList.push(JSON.parse(data));
      setMessages({messageList: [...msgList]})
    })
  }, [])
  const sendMessage = ()=>{
    const messageObj = {id: loggedUser?.id, msg};
    console.log(messageObj);

    socket.emit('sendMessage', JSON.stringify(messageObj))
  }

  return (
    <div>
      <h3 className='flex justify-center'>Connected users: {users.usersList?.length}</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Connected</th>
          </tr>
        </thead>
        <tbody>
          {userGen.usersList?.map( (user:any)=>{
            return (
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.connectionTime}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    
      <h3 className='flex justify-center'>User: {loggedUser?.userName}</h3>
      <div style={{borderStyle: 'inset'}}>
        <h2 className='flex justify-center'>Chat</h2>
        {messages.messageList?.map((msgInfo:any, index:number)=>{
          return (<div className='flex justify-center' key={index}>
            <b>{msgInfo.userName}</b> : {msgInfo.msg} <small className='ml-4 mt-1 text-blue-700'>{msgInfo.time}</small>
          </div>)
        })}
      </div>
      <div className='flex justify-center'>
        <input className='w-60 inline' id='inputmsg' onChange={(event => setMsg(event.target.value))} />
        <button className='bg-blue-500 rounded-md' id='btnmsg' onClick={()=>{sendMessage()}}>Send</button>
      </div>
    </div>
  )
}

export default Chat;