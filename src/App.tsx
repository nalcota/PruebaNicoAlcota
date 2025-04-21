import { useState } from 'react'
import './App.css'
import {  Routes, Route, HashRouter } from 'react-router-dom';
import Desarrolladores from './components/Desarrolladores/Desarrolladores';
import DesarrolladoresDesactivados from './components/Desarrolladores/DesarrolladoresDesactivados';
import Proyectos from './components/Proyectos/Proyectos';
import ProyectosDesactivados from './components/Proyectos/ProyectosDesactivados';
import Home from './components/Home';


function App() {
  const [token] = useState("T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9");

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/desarrolladores" element={<Desarrolladores token={token} />} />
        <Route path="/desarrolladores_desactivados" element={<DesarrolladoresDesactivados token={token} />} />
        <Route path="/proyectos" element={<Proyectos token={token} />} />
        <Route path="/proyectos_desactivados" element={<ProyectosDesactivados token={token} />} />
      </Routes>
    </HashRouter>
  )
}

export default App