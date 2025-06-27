import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Curso from './pages/Curso';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rota raiz → tela de login */}
        <Route path="/" element={<Login />} />

        {/* nova rota → tela Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/curso" element={<Curso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
