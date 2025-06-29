import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Modal } from 'react-bootstrap';

// Mocked course/session data for demonstration
const mockCourses = [
  { id: 1, name: 'JS Fundamentals', description: 'Curso de JavaScript básico.' },
  { id: 2, name: 'React Avançado', description: 'Curso avançado de React.' },
];

const initialSessions = [
  {
    id: 1,
    title: 'Introdução',
    description: 'Primeira sessão do curso.',
    materiais: [
      { name: 'Material Exemplo', url: 'https://exemplo.com/material.pdf', description: 'Material de apoio.' }
    ],
    aulas: [
      { name: 'Aula 1', url: 'https://exemplo.com/aula1', duration: '15:00', description: 'Aula introdutória.' }
    ],
    exames: [
      {
        examName: 'Exame 1',
        questions: [
          {
            question: 'O que é React?',
            alternatives: [
              { description: 'Uma biblioteca JS', isTrue: true },
              { description: 'Um banco de dados', isTrue: false },
              { description: 'Um sistema operacional', isTrue: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Capítulo 1',
    description: 'Conceitos básicos.',
    materiais: [],
    aulas: [],
    exames: []
  },
];

const CourseSessions = () => {
  const { courseId } = useParams();

  // Estados para adicionar materiais, aulas, exames
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemType, setItemType] = useState(''); // 'materiais' | 'aulas' | 'exames'
  const [itemSessionIdx, setItemSessionIdx] = useState(null);
  // Estado para cada tipo de item
  const [newMaterial, setNewMaterial] = useState({ name: '', url: '', description: '' });
  const [newLesson, setNewLesson] = useState({ name: '', url: '', duration: '', description: '' });
  const [newExam, setNewExam] = useState({ examName: '', questions: [{ question: '', alternatives: [{ description: '', isTrue: false }] }] });
  const [newItem, setNewItem] = useState('');

  // Estado mockado das sessões
  const [sessions, setSessions] = useState(initialSessions);

  // Estado do modal de sessão
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', description: '' });

  // Recupera o curso selecionado
  const course = mockCourses.find(c => String(c.id) === String(courseId));

  const handleShowItemModal = (sessionIdx, type) => {
    setItemSessionIdx(sessionIdx);
    setItemType(type);
    setNewItem('');
    setShowItemModal(true);
  };

  const handleAddItem = () => {
    setSessions(prev => prev.map((s, idx) => {
      if (idx !== itemSessionIdx) return s;
      if (itemType === 'materiais') {
        return { ...s, materiais: [...s.materiais, newMaterial] };
      }
      if (itemType === 'aulas') {
        return { ...s, aulas: [...s.aulas, newLesson] };
      }
      if (itemType === 'exames') {
        return { ...s, exames: [...s.exames, newExam] };
      }
      return s;
    }));
    setShowItemModal(false);
    setNewMaterial({ name: '', url: '', description: '' });
    setNewLesson({ name: '', url: '', duration: '', description: '' });
    setNewExam({ examName: '', questions: [{ question: '', alternatives: [{ description: '', isTrue: false }] }] });
    setNewItem('');
  };


  const handleRemoveItem = (sessionIdx, type, itemIdx) => {
    setSessions(prev => prev.map((s, idx) => idx === sessionIdx ? {
      ...s,
      [type]: s[type].filter((_, i) => i !== itemIdx)
    } : s));
  };


  const handleAddSession = () => {
    if (newSession.title) {
      setSessions([
        ...sessions,
        {
          id: Date.now(),
          ...newSession,
          materiais: [],
          aulas: [],
          exames: []
        }
      ]);
      setNewSession({ title: '', description: '' });
      setShowModal(false);
    }
  };

  const handleRemoveSession = id => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  if (!course) {
    return <div className="p-4">Curso não encontrado.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f3f4f8 60%, #f8f9fa 100%)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 40, paddingLeft: 40 }}>
        <Button variant="link" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>← Voltar</Button>
        <h2 style={{ fontWeight: 700 }}>{course.name}</h2>
        <div style={{ color: '#888', marginBottom: 24 }}>{course.description}</div>
        <div className="d-flex align-items-center mb-3" style={{ gap: 16 }}>
          <Button variant="primary" style={{ borderRadius: 10, fontWeight: 500 }} onClick={() => setShowModal(true)}>
            + Nova Sessão
          </Button>
        </div>
        <div className="d-flex flex-wrap" style={{ gap: 16 }}>
          {sessions.length > 0 ? sessions.map((session, idx) => (
            <Card key={session.id} style={{ width: 340, minHeight: 180, borderRadius: 12, background: '#ece6fa', color: '#3d2465', fontWeight: 500 }}>
              <Card.Body>
                <Card.Title style={{ fontWeight: 600 }}>{session.title}</Card.Title>
                <Card.Text style={{ fontSize: 14, color: '#888' }}>{session.description}</Card.Text>
                <hr />
                {/* Materiais */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>Materiais</div>
                  <ul style={{ paddingLeft: 18 }}>
                    {session.materiais.length > 0 ? session.materiais.map((mat, i) => (
                      <li key={i} style={{ fontSize: 14 }}>
                        <b>{mat.name}</b>{mat.url && (
                          <>
                            {' '}<a href={mat.url} target="_blank" rel="noopener noreferrer">[ver]</a>
                          </>
                        )}
                        {mat.description && <span style={{ color: '#777', fontSize: 13 }}> — {mat.description}</span>}
                        <span style={{ color: '#c00', cursor: 'pointer', marginLeft: 8 }} onClick={() => handleRemoveItem(idx, 'materiais', i)}>×</span>
                      </li>
                    )) : <li style={{ color: '#aaa', fontSize: 13 }}>Nenhum material</li>}
                  </ul>
                  <Button size="sm" variant="outline-primary" onClick={() => handleShowItemModal(idx, 'materiais')}>+ Material</Button>
                </div>
                {/* Aulas */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>Aulas</div>
                  <ul style={{ paddingLeft: 18 }}>
                    {session.aulas.length > 0 ? session.aulas.map((aula, i) => (
                      <li key={i} style={{ fontSize: 14 }}>
                        <b>{aula.name}</b>{aula.url && (
                          <>
                            {' '}<a href={aula.url} target="_blank" rel="noopener noreferrer">[ver]</a>
                          </>
                        )}
                        {aula.duration && <span style={{ color: '#777', fontSize: 13 }}> ({aula.duration})</span>}
                        {aula.description && <span style={{ color: '#777', fontSize: 13 }}> — {aula.description}</span>}
                        <span style={{ color: '#c00', cursor: 'pointer', marginLeft: 8 }} onClick={() => handleRemoveItem(idx, 'aulas', i)}>×</span>
                      </li>
                    )) : <li style={{ color: '#aaa', fontSize: 13 }}>Nenhuma aula</li>}
                  </ul>
                  <Button size="sm" variant="outline-primary" onClick={() => handleShowItemModal(idx, 'aulas')}>+ Aula</Button>
                </div>
                {/* Exames */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>Exames</div>
                  <ul style={{ paddingLeft: 18 }}>
                    {session.exames.length > 0 ? session.exames.map((exame, i) => (
                      <li key={i} style={{ fontSize: 14 }}>
                        <b>{exame.examName}</b>
                        {exame.questions && exame.questions.length > 0 && (
                          <ul style={{ fontSize: 13, marginTop: 4 }}>
                            {exame.questions.map((q, qi) => (
                              <li key={qi}>
                                <span style={{ fontWeight: 500 }}>{q.question}</span>
                                <ul style={{ fontSize: 13, marginTop: 2 }}>
                                  {q.alternatives.map((alt, ai) => (
                                    <li key={ai} style={{ color: alt.isTrue ? '#2e7d32' : '#555' }}>
                                      {alt.description} {alt.isTrue && <b>(correta)</b>}
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        )}
                        <span style={{ color: '#c00', cursor: 'pointer', marginLeft: 8 }} onClick={() => handleRemoveItem(idx, 'exames', i)}>×</span>
                      </li>
                    )) : <li style={{ color: '#aaa', fontSize: 13 }}>Nenhum exame</li>}
                  </ul>
                  <Button size="sm" variant="outline-primary" onClick={() => handleShowItemModal(idx, 'exames')}>+ Exame</Button>
                </div>
                <hr />
                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveSession(session.id)}>
                  Remover Sessão
                </Button>
              </Card.Body>
            </Card>
          )) : <div className="text-muted">Nenhuma sessão cadastrada.</div>}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Nova Sessão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={newSession.title}
                  onChange={e => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="Digite o título da sessão"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  value={newSession.description}
                  onChange={e => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="Descrição da sessão"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddSession}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal para adicionar Material/Aula/Exame */}
        <Modal show={showItemModal} onHide={() => setShowItemModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar {itemType === 'materiais' ? 'Material' : itemType === 'aulas' ? 'Aula' : 'Exame'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {itemType === 'materiais' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={newMaterial.name}
                      onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      placeholder="Nome do material"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={newMaterial.url}
                      onChange={e => setNewMaterial({ ...newMaterial, url: e.target.value })}
                      placeholder="URL do material"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      value={newMaterial.description}
                      onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      placeholder="Descrição do material"
                    />
                  </Form.Group>
                </>
              )}
              {itemType === 'aulas' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={newLesson.name}
                      onChange={e => setNewLesson({ ...newLesson, name: e.target.value })}
                      placeholder="Nome da aula"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={newLesson.url}
                      onChange={e => setNewLesson({ ...newLesson, url: e.target.value })}
                      placeholder="URL da aula"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Duração</Form.Label>
                    <Form.Control
                      type="text"
                      value={newLesson.duration}
                      onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                      placeholder="Duração (ex: 15:00)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      value={newLesson.description}
                      onChange={e => setNewLesson({ ...newLesson, description: e.target.value })}
                      placeholder="Descrição da aula"
                    />
                  </Form.Group>
                </>
              )}
              {itemType === 'exames' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Exame</Form.Label>
                    <Form.Control
                      type="text"
                      value={newExam.examName}
                      onChange={e => setNewExam({ ...newExam, examName: e.target.value })}
                      placeholder="Nome do exame"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Pergunta</Form.Label>
                    <Form.Control
                      type="text"
                      value={newExam.questions[0].question}
                      onChange={e => setNewExam({
                        ...newExam,
                        questions: [{ ...newExam.questions[0], question: e.target.value, alternatives: newExam.questions[0].alternatives }]
                      })}
                      placeholder="Pergunta do exame"
                    />
                  </Form.Group>
                  <Form.Label>Alternativas</Form.Label>
                  {newExam.questions[0].alternatives.map((alt, idx) => (
                    <div key={idx} className="mb-2 d-flex align-items-center" style={{ gap: 8 }}>
                      <Form.Control
                        type="text"
                        value={alt.description}
                        onChange={e => {
                          const newAlts = [...newExam.questions[0].alternatives];
                          newAlts[idx] = { ...newAlts[idx], description: e.target.value };
                          setNewExam({
                            ...newExam,
                            questions: [{ ...newExam.questions[0], alternatives: newAlts }]
                          });
                        }}
                        placeholder={`Alternativa ${idx + 1}`}
                        style={{ width: '70%' }}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Correta"
                        checked={alt.isTrue}
                        onChange={e => {
                          const newAlts = [...newExam.questions[0].alternatives];
                          newAlts[idx] = { ...newAlts[idx], isTrue: e.target.checked };
                          setNewExam({
                            ...newExam,
                            questions: [{ ...newExam.questions[0], alternatives: newAlts }]
                          });
                        }}
                      />
                      <Button size="sm" variant="danger" onClick={() => {
                        const newAlts = newExam.questions[0].alternatives.filter((_, i) => i !== idx);
                        setNewExam({
                          ...newExam,
                          questions: [{ ...newExam.questions[0], alternatives: newAlts }]
                        });
                      }}>Remover</Button>
                    </div>
                  ))}
                  <Button size="sm" variant="secondary" className="mb-2" onClick={() => {
                    setNewExam({
                      ...newExam,
                      questions: [{
                        ...newExam.questions[0],
                        alternatives: [...newExam.questions[0].alternatives, { description: '', isTrue: false }]
                      }]
                    });
                  }}>+ Alternativa</Button>
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowItemModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddItem}>
              Adicionar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CourseSessions;
