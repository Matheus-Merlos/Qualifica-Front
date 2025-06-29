import React from "react";
import { Card, ProgressBar } from 'react-bootstrap';
import './styles.css'; // Certifique-se de que o caminho está correto

export default function CardProgress({ titulo, progresso }) {
  return (
    <Card className="card-continue mb-3">
      <Card.Body className="card-info d-flex flex-column justify-content-end p-0">
        <div className="card-info-text px-3 pt-3">
          <span>{titulo}</span>
          <span style={{ fontSize: "0.7rem" }}>{progresso}%</span>
        </div>
        <ProgressBar
          now={progresso}
          className="custom-progress"
        />
      </Card.Body>
    </Card>
  );
}
