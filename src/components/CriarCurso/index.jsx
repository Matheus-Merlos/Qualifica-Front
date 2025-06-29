import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import Questao from './Questao.jsx';
import Header from '../Header.jsx';

export default function CriarCurso() {
  const [course, setCourse] = useState({
    name: '',
    examName: '',
    image: null,
    materials: [],
    questions: [{ text: '', correct: '', alternatives: {} }],
  });

  const handleFileChange = (field, files) => {
    setCourse(prev => ({
      ...prev,
      [field]: field === 'materials' ? [...prev.materials, ...Array.from(files)] : files[0],
    }));
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updated = [...course.questions];
    updated[index] = updatedQuestion;
    setCourse(prev => ({ ...prev, questions: updated }));
  };

  const addQuestion = () => {
    setCourse(prev => ({
      ...prev,
      questions: [...prev.questions, { text: '', correct: '', alternatives: {} }],
    }));
  };

  const removeQuestion = (index) => {
    setCourse(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', course.name);
    formData.append('examName', course.examName);
    formData.append('image', course.image);
    course.materials.forEach((file) => formData.append('materials', file));
    formData.append('questions', JSON.stringify(course.questions));

    console.log('Enviando curso:', course);
  };

  return (
    <>
      <Header searchable={false} />
      <Container className="my-4">
        <h4>Cadastrar novo curso</h4>
        <Form onSubmit={handleSubmit}>
          <h6 className="mt-4">Informações do curso</h6>

          <Form.Group className="mb-3">
            <Form.Label>Nome do curso</Form.Label>
            <Form.Control
              placeholder="Ex.: Introdução a JavaScript"
              value={course.name}
              onChange={(e) => setCourse({ ...course, name: e.target.value })}
            />
          </Form.Group>

          <Row>
            <Col md>
              <Form.Group className="mb-3">
                <Form.Label>Imagem do curso</Form.Label>
                <Form.Control type="file" onChange={(e) => handleFileChange('image', e.target.files)} />
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group className="mb-3">
                <Form.Label>Materiais (PDF, vídeo, links)</Form.Label>
                <Form.Control type="file" multiple onChange={(e) => handleFileChange('materials', e.target.files)} />
              </Form.Group>
            </Col>
          </Row>

          <ListGroup className="mb-3">
            {course.materials.map((file, idx) => (
              <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                {file.name}
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() =>
                    setCourse(prev => ({
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
          <h6>Exame associado</h6>
          <Form.Group className="mb-3">
            <Form.Label>Nome do exame</Form.Label>
            <Form.Control
              placeholder="Ex.: JavaScript Fundamentals"
              value={course.examName}
              onChange={(e) => setCourse({ ...course, examName: e.target.value })}
            />
          </Form.Group>

          <hr />
          <h6>Perguntas</h6>
          {course.questions.map((q, idx) => (
            <Questao
              key={idx}
              index={idx}
              question={q}
              onChange={handleQuestionChange}
              onRemove={removeQuestion}
            />
          ))}

          <Button variant="primary" onClick={addQuestion} className="mb-4">Adicionar pergunta</Button>
          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">Salvar curso</Button>
            <Button variant="outline-secondary">Cancelar</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
