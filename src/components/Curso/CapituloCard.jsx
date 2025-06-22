import React from 'react';

export default function CapituloCard({ numero, titulo, duracao, imagem }) {
  return (
    <div className="card">
      <div className="left">
        <img src={imagem} alt={`Imagem do Capítulo ${numero}`} />
        <div className="text">
          <h3>{`Capítulo ${numero}`}</h3>
          <p>{titulo}</p>
        </div>
      </div>
      <h3>{duracao}</h3>
    </div>
  );
}
