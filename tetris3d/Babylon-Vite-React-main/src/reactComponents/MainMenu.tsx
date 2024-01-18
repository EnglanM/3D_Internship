import { useState } from 'react'


function MainMenu() {
  const [count, setCount] = useState(0)

  return (
    <div className=' w-1/5 h-screen float-right' style={{width:'20vw', height:'100vh', position:'absolute', right:'0', top:'0'}}>
      <div className='w-full'>
        <a href="https://vitejs.dev" target="_blank">
        </a>
        <a href="https://react.dev" target="_blank">
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      <img src="react.svg" alt="your-image-description" />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default MainMenu
