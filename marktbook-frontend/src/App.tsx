import AppRoutes from './AppRoutes'
import './App.scss'



function App() {

  const handleFullScreen = () => {
    document.documentElement.requestFullscreen()
      .catch(err => console.log(err))
  }


  return (
    <div onDoubleClick={handleFullScreen}>
      <AppRoutes />
    </div>
  )
}

export default App
