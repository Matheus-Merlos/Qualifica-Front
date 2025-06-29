import React from 'react';
import { Card } from 'react-bootstrap';

export default function CapituloCard({ numero, titulo, duracao, imagem }) {
  return (
    <Card className="mb-3 p-0">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Card.Img variant="top" src={imagem} style={{ width: '4rem', height: '4rem', borderRadius: '8px' }} />
          <div className="ms-3">
            <Card.Title>{`Capítulo ${numero}`}</Card.Title>
            <Card.Text>{titulo}</Card.Text>
          </div>
        </div>
        <h3>{duracao}</h3>
      </Card.Body>
    </Card>
  );
}
