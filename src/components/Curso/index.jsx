import React from "react";
import "./styles.css";
import Header from '../Header';
import ListaCapitulos from './ListaCapitulos.jsx';
import { Container, Row, Col, Button, ProgressBar } from 'react-bootstrap';

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
        <Container className="main-left">
          <div className="video-box">
            <img src="/fundo.jpg" alt="Computação" />
            <div className="play-bar">⏸</div>
          </div>

          <Container className="course-info">
            <h2>Computação</h2>
            <p>
              A computação, ou ciência da computação, é uma disciplina que estuda a teoria, o design, o desenvolvimento e a
              aplicação de computadores e sistemas computacionais.
            </p>
            <span className="progress-text" style={{ textAlign: "center" }}>50%</span>
            <ProgressBar
              now={50}
              className="progress-bar"
            />
          </Container>
        </Container>

        <Container className="main-right">
          <Button variant="success" className="w-100 mb-3 rounded btn-certificado">Obter Certificado</Button>
          <ListaCapitulos capitulos={capitulos} />
        </Container>
      </main>
    </>
  );
}
