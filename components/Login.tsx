import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login({socket}){
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignin = ()=>{
    const userObj = {userName, email};
    socket.emit('login', userObj)
    router.push('/chat');
  }



  return (
<div className='m-8 w-full flex justify-center'>
  <div className='bg-indigo-200 shadow-md rounded-md w-1/2'>
    <header><h2>I want in!</h2></header>
    <div className='flex flex-col items-center border-indigo-800 rounded-sm'>
      <label htmlFor='username' className='w-1/3'>Username:</label><input type='text' id='username' className='w-2/3' onChange={(event)=>{setUserName(event.target.value);}} />
      <label htmlFor='email' className='w-1/3'>Email: </label><input type='email' id='email' className='w-2/3'  onChange={(event)=>{setEmail(event.target.value);}} />
      <button className='px-2 py-8 w-1/2 bg-indigo-800 text-indigo-200 rounded-xl shadow-lg font-extrabold' onClick={()=>{handleSignin()}}>Sign in</button>
    </div>
  </div>
</div>
)
}
