import React from 'react';
import Login from './pages/Login';
// import Curso from './components/Curso'
// import Home from './components/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Curso from './pages/Curso';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Curso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
