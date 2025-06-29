import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import Questao from '../CriarCurso/Questao.jsx';

export default function EditarSessao({ sessionData }) {
  const [session, setSession] = useState({
    name: '',
    materials: [],
    provas: [{ title: '', questions: [{ text: '', correct: '', alternatives: {} }] }],
  });

  useEffect(() => {
    if (sessionData) {
      setSession({
        name: sessionData.name || '',
        materials: sessionData.materials || [],
        provas: sessionData.provas || [{ title: '', questions: [{ text: '', correct: '', alternatives: {} }] }],
      });
    }
  }, [sessionData]);

  const handleFileChange = (files) => {
    setSession(prev => ({
      ...prev,
      materials: [...prev.materials, ...Array.from(files)],
    }));
  };

  const handleSessionChange = (field, value) => {
    setSession(prev => ({ ...prev, [field]: value }));
  };

  const handleProvaChange = (index, updatedProva) => {
    const updated = [...session.provas];
    updated[index] = updatedProva;
    setSession(prev => ({ ...prev, provas: updated }));
  };

  const addProva = () => {
    setSession(prev => ({
      ...prev,
      provas: [...prev.provas, { title: '', questions: [{ text: '', correct: '', alternatives: {} }] }],
    }));
  };

  const removeProva = (index) => {
    if (window.confirm("Tem certeza que deseja remover esta prova?")) {
      setSession(prev => ({
        ...prev,
        provas: prev.provas.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', session.name);
    session.materials.forEach((file) => formData.append('materials', file));
    formData.append('provas', JSON.stringify(session.provas));

    console.log('Atualizando sessão:', session);
  };

  return (
    <Container className="my-4">
      <h4>Editar sessão</h4>
      <Form onSubmit={handleSubmit}>
        <h6 className="mt-4">Informações da sessão</h6>

        <Form.Group className="mb-3">
          <Form.Label>Nome da sessão</Form.Label>
          <Form.Control
            placeholder="Ex.: Sessão 1 - Introdução"
            value={session.name}
            onChange={(e) => handleSessionChange('name', e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md>
            <Form.Group className="mb-3">
              <Form.Label>Materiais (PDF, vídeo, links)</Form.Label>
              <Form.Control type="file" multiple onChange={(e) => handleFileChange(e.target.files)} />
            </Form.Group>
          </Col>
        </Row>

        <ListGroup className="mb-3">
          {session.materials.map((file, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
              {file.name}
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() =>
                  setSession(prev => ({
                    ...prev,
                    materials: prev.materials.filter((_, i) => i !== idx),
                  }))
                }
              >
                Remover
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <hr />
        <h6>Provas</h6>
        {session.provas.map((prova, idx) => (
          <div key={idx} className="mb-3 border p-3 rounded">
            <Form.Group>
              <Form.Label>Título da Prova</Form.Label>
              <Form.Control
                placeholder="Ex.: Prova 1"
                value={prova.title}
                onChange={(e) => handleProvaChange(idx, { ...prova, title: e.target.value })}
              />
            </Form.Group>

            <h6>Perguntas</h6>
            {prova.questions.map((q, qIdx) => (
              <Questao
                key={qIdx}
                index={qIdx}
                question={q}
                onChange={(updatedQuestion) => {
                  const updatedQuestions = [...prova.questions];
                  updatedQuestions[qIdx] = updatedQuestion;
                  handleProvaChange(idx, { ...prova, questions: updatedQuestions });
                }}
                onRemove={(index) => {
                  const updatedQuestions = prova.questions.filter((_, i) => i !== index);
                  handleProvaChange(idx, { ...prova, questions: updatedQuestions });
                }}
              />
            ))}

            <Button variant="outline-primary" onClick={() => {
              const updatedQuestions = [...prova.questions, { text: '', correct: '', alternatives: {} }];
              handleProvaChange(idx, { ...prova, questions: updatedQuestions });
            }}>
              Adicionar Pergunta
            </Button>

            <div className="mt-2">
              <Button variant="outline-danger" onClick={() => removeProva(idx)}>
                Remover Prova
              </Button>
            </div>
          </div>
        ))}

        <Button variant="primary" onClick={addProva} className="mb-4">Adicionar Prova</Button>
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">Salvar sessão</Button>
          <Button variant="outline-secondary">Cancelar</Button>
        </div>
      </Form>
    </Container>
  );
}
