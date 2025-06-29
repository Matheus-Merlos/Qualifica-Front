import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function Questao({ index, question, onChange, onRemove }) {
  const handleChange = (field, value) => {
    const updated = { ...question, [field]: value };
    onChange(index, updated);
  };

  const alternatives = question.alternatives || {};

  return (
    <div className="border rounded p-3 mb-3">
      <Row className="align-items-center mb-2">
        <Col><strong>Pergunta {index + 1}</strong></Col>
        <Col xs="auto">
          <Button variant="outline-primary" size="sm" onClick={() => onRemove(index)}>Remover</Button>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Descreva a questão..."
          value={question.text}
          onChange={(e) => handleChange('text', e.target.value)}
        />
      </Form.Group>

      <Row>
        {['A', 'B', 'C', 'D'].map(letter => (
          <Col key={letter} md={6} className="mb-2">
            <Form.Group>
              <Form.Check
                type="radio"
                name={`correct-${index}`}
                label={`Alternativa ${letter}`}
                checked={question.correct === letter}
                onChange={() => handleChange('correct', letter)}
              />
              <Form.Control
                type="text"
                placeholder={`Digite a alternativa ${letter}...`}
                value={alternatives[letter] || ''}
                onChange={(e) => handleChange('alternatives', { ...alternatives, [letter]: e.target.value })}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>
    </div>
  );
}
