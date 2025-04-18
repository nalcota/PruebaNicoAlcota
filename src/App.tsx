import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Desarrolladores from './components/Desarrolladores';
import Proyectos from './components/Proyectos';
import DesarrolladoresDesactivados from './components/DesarrolladoresDesactivados';

function App() {
  const [count, setCount] = useState(0)

 return (
    <BrowserRouter>
      <Routes>
      <Route path="/desarrolladores" element={<Desarrolladores />} />
      <Route path="/desarrolladores_desactivados" element={<DesarrolladoresDesactivados />} />

      <Route path="/proyectos" element={<Proyectos />} />



      </Routes>
    </BrowserRouter>
  )
}

export default App