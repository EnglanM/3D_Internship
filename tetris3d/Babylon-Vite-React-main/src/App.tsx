import BabylonScene from "./babylonComponents/BabylonScene"
import MainMenu from "./reactComponents/MainMenu"
import './App.css'

function App() {

  return (
    <div className='w-screen h-screen' style={{width:'100vw', height:'100vh'}}>
      <BabylonScene />
      <MainMenu />
    </div>
  )
}

export default App
