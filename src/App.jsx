import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Curso from './pages/Curso';
import Home from './pages/Home';
import Login from './pages/Login';
import CriarCurso from './components/CriarCurso';
import Route404 from './pages/404';
import { Provider } from 'jotai';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          {/* rota raiz → tela de login */}
          <Route path='/' element={<Login />} />

          {/* nova rota → tela Home */}
          <Route path='/home' element={<Home />} />
          <Route path='/curso' element={<Curso />} />
          <Route path='/course/:id' element={<Curso />} />
          <Route path='/criar-curso' element={<CriarCurso />} />

          <Route path='*' element={<Route404 />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
