import React from "react";
import "./styles.css";
import Header from '../Header';
import ListaCapitulos from './ListaCapitulos.jsx'; // ajuste o caminho conforme seu projeto

export default function Curso() {
  const capitulos = Array.from({ length: 21 }, (_, i) => ({
    numero: i + 1,
    titulo: "Introdução",
    duracao: "05:43",
    imagem: "/apple.png",
  }));

  return (
    <>
      <Header searchable={false} />
      
      <main className="course-container">
        <div className="main-left">
          <div className="video-box">
            <img src="/fundo.jpg" alt="Computação" />
            <div className="play-bar">⏸</div>
          </div>

          <div className="course-info">
            <h2>Computação</h2>
            <p>
              A computação, ou ciência da computação, é uma disciplina que estuda a teoria, o design, o desenvolvimento e a
              aplicação de computadores e sistemas computacionais.
            </p>
            <span className="progress-text" style={{ textAlign: "center" }}>50%</span>
            <div className="progress-bar">
              <div style={{ width: "50%" }}></div>
            </div>
          </div>
        </div>

        <div className="main-right">
          <button type="button" className="btn-certificado">Obter Certificado</button>
          <ListaCapitulos capitulos={capitulos} />
        </div>
      </main>
    </>
  );
}
