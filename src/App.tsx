import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Desarrolladores from './components/Desarrolladores';

function App() {
  const [count, setCount] = useState(0)

 return (
    <BrowserRouter>
      <Routes>
      <Route path="/desarrolladores" element={<Desarrolladores />} />



      </Routes>
    </BrowserRouter>
  )
}

export default App