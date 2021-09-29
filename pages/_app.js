// import App from 'next/app'
import { useEffect } from 'react';
import io from 'socket.io-client';

import 'tailwindcss/tailwind.css'

const socket = io();

function MyApp({ Component, pageProps }) {
  useEffect(()=>{
    fetch('/api/socketio').finally(()=>{

      socket.on('connect', ()=>{
        console.log('connected');
        socket.emit('hello');
      })

      socket.on('hello', data=>{
        console.log('hello', data)
      })

      socket.on('a user connected', ()=>{
        console.log('a user connected')
      })
      socket.on('users', (users)=>{
        console.log('users', users);
      })

      socket.on('disconnect', ()=>{
        console.log('disconnect');
      })
    })
  }, []);

  return <Component {...pageProps} socket={socket} />
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp