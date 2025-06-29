import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Curso from './pages/Curso';
import Home from './pages/Home';
import Login from './pages/Login';
import Route404 from './pages/404';
import { Provider } from 'jotai';
import Search from './pages/Search';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          {/* rota raiz → tela de login */}
          <Route path='/login' element={<Login />} />

          {/* nova rota → tela Home */}
          <Route path='/' element={<Home />} />
          <Route path='/curso' element={<Curso />} />
          <Route path='/course/:id' element={<Curso />} />

          <Route path='/search' element={<Search />} />

          <Route path='*' element={<Route404 />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
