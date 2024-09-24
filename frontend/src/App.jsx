import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-red-500 p-4 text-white">
      <h1 className="text-3xl font-bold underline">
        Hello, RaverTroter!
      </h1>
    </div>
  )
}

export default App
