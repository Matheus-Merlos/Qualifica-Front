import React from 'react';
import CapituloCard from './CapituloCard.jsx';

export default function ListaCapitulos({ capitulos }) {
  return (
    <div className="capitulos">
      <h3>Capítulos</h3>
      <div className="lista">
        {capitulos.map((cap, index) => (
          <CapituloCard
            key={index}
            numero={cap.numero}
            titulo={cap.titulo}
            duracao={cap.duracao}
            imagem={cap.imagem}
          />
        ))}
      </div>
    </div>
  );
}
