import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import Header from '../Header';

export default function CriarCurso() {
  const [course, setCourse] = useState({
    name: '',
    image: null,
    description: '',
    tags: [],
  });

  const handleFileChange = (files) => {
    setCourse(prev => ({
      ...prev,
      image: files[0], // Apenas um arquivo de imagem
    }));
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (e.key === 'Enter' && value) {
      setCourse(prev => ({
        ...prev,
        tags: [...prev.tags, value],
      }));
      e.target.value = ''; // Limpa o campo de entrada
    }
  };

  const removeTag = (index) => {
    setCourse(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', course.name);
    formData.append('image', course.image);
    formData.append('description', course.description);
    formData.append('tags', JSON.stringify(course.tags));

 
    console.log('Enviando curso:', course);
  };

  return (
    <>
      <Header searchable={false} />
      <Container fluid className="my-4 flex-1 bg-light">
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

          <Form.Group className="mb-3">
            <Form.Label>Descrição do curso</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descreva o curso..."
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Pressione Enter para adicionar uma tag"
              onKeyDown={handleTagChange}
            />
            <ListGroup className="mt-2">
              {course.tags.map((tag, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  {tag}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeTag(index)}
                  >
                    Remover
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>

          <Row>
            <Col md>
              <Form.Group className="mb-3">
                <Form.Label>Imagem do curso</Form.Label>
                <Form.Control type="file" onChange={(e) => handleFileChange(e.target.files)} />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">Salvar curso</Button>
            <Button variant="outline-secondary">Cancelar</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
