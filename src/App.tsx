import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Desarrolladores from './components/Desarrolladores/Desarrolladores';
import DesarrolladoresDesactivados from './components/Desarrolladores/DesarrolladoresDesactivados';
import Proyectos from './components/Proyectos/Proyectos';
import ProyectosDesactivados from './components/Proyectos/ProyectosDesactivados';
import Home from './components/Home';


function App() {
  const [token] = useState("T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/desarrolladores" element={<Desarrolladores token={token} />} />
        <Route path="/desarrolladores_desactivados" element={<DesarrolladoresDesactivados token={token} />} />

        <Route path="/proyectos" element={<Proyectos token={token} />} />
        <Route path="/proyectos_desactivados" element={<ProyectosDesactivados token={token} />} />



      </Routes>
    </BrowserRouter>
  )
}

export default App