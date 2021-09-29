import Login from '../components/Login.tsx';

export default function Home({socket}) {
  return (
    <div className='w-8/12 h-full m-auto flex justify-center items-center'>
      <Login socket={socket}/>
    </div>
  )
}
