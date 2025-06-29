import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Curso from './pages/Curso';
import Home from './pages/Home';
import Login from './pages/Login';
import Route404 from './pages/404';
import { Provider } from 'jotai';
import Search from './pages/Search';
import WatchCourse from './pages/WatchCourse';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          {/* rota raiz → tela de login */}
          <Route path='/login' element={<Login />} />

          {/* nova rota → tela Home */}
          <Route path='/' element={<Home />} />
          <Route path='/course/:id' element={<Curso />} />

          <Route path='/search' element={<Search />} />

          {/* 2. Adicione a nova rota para a página de assistir.
            Ela captura o ID do curso e, opcionalmente, o tipo e o ID do recurso.
            Isso permite que um usuário compartilhe um link direto para uma aula específica.
          */}
          <Route
            path='/course/:courseId/watch/:resourceType/:resourceId/:sectionResourceId'
            element={<WatchCourse />}
          />
          {/* Rota para quando o usuário apenas entra na página de assistir, sem selecionar um recurso */}
          <Route path='/course/:courseId/watch' element={<WatchCourse />} />

          <Route path='*' element={<Route404 />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
