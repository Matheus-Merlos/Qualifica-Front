import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Spinner, Alert, Modal } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { userIdAtom } from '../../store/persistentAtoms';
import api from '../../utils/api';

const CourseSessions = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [userId] = useAtom(userIdAtom);

  // --- ESTADOS DE DADOS DO BACKEND ---
  const [course, setCourse] = useState(null);
  const [userMaterials, setUserMaterials] = useState([]);
  const [userLessons, setUserLessons] = useState([]);
  const [userExams, setUserExams] = useState([]);

  // --- ESTADO DO FORMULÁRIO ---
  const [sessionsForm, setSessionsForm] = useState([]);

  // --- ESTADOS DE UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // --- ESTADOS DO MODAL DE ADIÇÃO DE RECURSO ---
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [activeSessionIndex, setActiveSessionIndex] = useState(null);
  const [newResourceType, setNewResourceType] = useState('lesson');
  const [newResourceId, setNewResourceId] = useState('');

  const [sectionsId, setSectionsId] = useState([]);

  useEffect(() => {
    if (!userId || !courseId) return;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Simplificado para buscar tudo de uma vez
        const [courseRes, materialsRes, lessonsRes, examsRes] = await Promise.all([
          api.get(`/course/${courseId}`), // Busca o curso com a estrutura aninhada
          api.get(`/material/${userId}/materials`),
          api.get(`/lesson/${userId}/lessons`),
          api.get(`/exam/${userId}/exams`),
        ]);

        const fetchedCourse = courseRes.data;
        setCourse(fetchedCourse);
        setUserMaterials(materialsRes.data);
        setUserLessons(lessonsRes.data);
        setUserExams(examsRes.data);

        if (fetchedCourse.sections && fetchedCourse.sections.length > 0) {
          const initialFormState = fetchedCourse.sections.map((session) => ({
            formId: `session-${session.id}`,
            name: session.name,
            resources: session.resources.map((resource) => ({
              formId: `resource-${session.id}-${resource.content.id}-${Math.random()}`,
              type: resource.type,
              resourceId: resource.content.id,
            })),
          }));
          setSessionsForm(initialFormState);

          const initialIds = fetchedCourse.sections.map((session) => session.id);
          setSectionsId(initialIds);
        }
      } catch (err) {
        setError('Falha ao carregar os dados. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [courseId, userId]);

  const handleOpenResourceModal = (sessionIndex) => {
    setActiveSessionIndex(sessionIndex);
    setNewResourceType('lesson');
    setNewResourceId('');
    setShowResourceModal(true);
  };

  const handleCloseResourceModal = () => {
    setShowResourceModal(false);
    setActiveSessionIndex(null);
  };

  // --- FUNÇÕES DE MANIPULAÇÃO DO FORMULÁRIO ---
  const handleAddResourceFromModal = () => {
    if (!newResourceId) {
      alert('Por favor, selecione um recurso.');
      return;
    }
    const newResource = {
      formId: `resource-${Date.now()}`,
      type: newResourceType,
      resourceId: newResourceId,
    };
    const updatedSessions = [...sessionsForm];
    updatedSessions[activeSessionIndex].resources.push(newResource);
    setSessionsForm(updatedSessions);
    handleCloseResourceModal();
  };

  const handleRemoveResource = (sessionIndex, resourceFormId) => {
    const updatedSessions = [...sessionsForm];
    updatedSessions[sessionIndex].resources = updatedSessions[sessionIndex].resources.filter(
      (r) => r.formId !== resourceFormId
    );
    setSessionsForm(updatedSessions);
  };

  const handleAddSession = () => {
    setSessionsForm([
      ...sessionsForm,
      { formId: `session-${Date.now()}`, name: '', resources: [] },
    ]);
  };

  const handleRemoveSession = (sessionFormId) => {
    setSessionsForm(sessionsForm.filter((s) => s.formId !== sessionFormId));
  };

  const handleSessionNameChange = (sessionFormId, newName) => {
    setSessionsForm(
      sessionsForm.map((s) => (s.formId === sessionFormId ? { ...s, name: newName } : s))
    );
  };

  // --- FUNÇÃO PARA SALVAR A ESTRUTURA (GERANDO O ARRAY PLANO) ---
  const handleSaveStructure = async () => {
    setIsSaving(true);

    if (sessionsForm.some((s) => !s.name.trim())) {
      alert('Todas as seções devem ter um nome para serem salvas.');
      setIsSaving(false);
      return;
    }

    const payload = sessionsForm.reduce((acc, session) => {
      const sectionName = session.name.trim();

      const resources = session.resources
        .filter((r) => r.resourceId)
        .map((r) => ({
          type: r.type,
          resourceId: Number(r.resourceId),
        }));

      acc[sectionName] = resources;

      return acc;
    }, {});

    try {
      let order = 1;
      for (const sectionId of sectionsId) {
        await api.delete(`/course/${courseId}/section/${sectionId}`);
      }
      for (const [key, value] of Object.entries(payload)) {
        const createSectionBody = {
          name: key,
          order,
          resources: value,
        };

        await api.post(`/course/${courseId}/section`, createSectionBody);
        order++;
      }

      alert('Curso atualizado com sucesso.');
    } catch (error) {
      alert(`Erro ao criar secções: ${error.message}`);
    }

    setIsSaving(false);
  };

  // --- FUNÇÕES AUXILIARES E RENDERIZAÇÃO ---
  const getResourceList = (type) => {
    switch (type) {
      case 'lesson':
        return userLessons;
      case 'material':
        return userMaterials;
      case 'exam':
        return userExams;
      default:
        return [];
    }
  };

  const getResourceNameById = (type, id) => {
    const list = getResourceList(type);
    const resource = list.find((item) => String(item.id) === String(id));
    return resource ? resource.name || resource.examName : 'Recurso não encontrado';
  };

  if (isLoading)
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <Spinner />
      </div>
    );
  if (error)
    return (
      <Alert variant='danger' className='m-4'>
        {error}
      </Alert>
    );

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Button variant='link' onClick={() => navigate(-1)} className='mb-4 ps-0'>
          ← Voltar
        </Button>
        <h2>
          Estrutura do Curso: <span className='fw-bold'>{course?.name}</span>
        </h2>
        <p className='text-muted'>{course?.description}</p>

        {sessionsForm.map((session, index) => (
          <Card key={session.formId} className='mb-4 shadow-sm'>
            <Card.Header className='d-flex justify-content-between align-items-center'>
              <Form.Control
                type='text'
                placeholder={`Nome da Seção ${index + 1}`}
                value={session.name}
                onChange={(e) => handleSessionNameChange(session.formId, e.target.value)}
                className='w-50 fw-bold fs-5 border-0 bg-transparent'
              />
              <Button
                variant='outline-danger'
                size='sm'
                onClick={() => handleRemoveSession(session.formId)}>
                Remover Seção
              </Button>
            </Card.Header>
            <Card.Body>
              {session.resources.length > 0 ? (
                <ul className='list-group list-group-flush'>
                  {session.resources.map((resource) => (
                    <li
                      key={resource.formId}
                      className='list-group-item d-flex justify-content-between align-items-center'>
                      <div>
                        <span
                          className={`badge bg-${resource.type === 'lesson' ? 'primary' : resource.type === 'material' ? 'info' : 'warning'} me-2`}>
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </span>
                        {getResourceNameById(resource.type, resource.resourceId)}
                      </div>
                      <Button
                        variant='link'
                        className='text-danger'
                        onClick={() => handleRemoveResource(index, resource.formId)}>
                        &times;
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-muted text-center'>Nenhum recurso adicionado a esta seção.</p>
              )}
              <Button
                variant='outline-primary'
                className='mt-3'
                onClick={() => handleOpenResourceModal(index)}>
                + Adicionar Recurso
              </Button>
            </Card.Body>
          </Card>
        ))}

        <Button variant='secondary' onClick={handleAddSession}>
          + Nova Seção
        </Button>
        <hr className='my-4' />
        <div className='d-flex justify-content-end'>
          <Button variant='primary' size='lg' onClick={handleSaveStructure} disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner as='span' size='sm' /> Salvando...
              </>
            ) : (
              'Salvar Estrutura Final'
            )}
          </Button>
        </div>
      </div>

      {/* MODAL PARA ADICIONAR RECURSO */}
      <Modal show={showResourceModal} onHide={handleCloseResourceModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Recurso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3'>
            <Form.Label>Tipo de Recurso</Form.Label>
            <Form.Select
              value={newResourceType}
              onChange={(e) => {
                setNewResourceType(e.target.value);
                setNewResourceId('');
              }}>
              <option value='lesson'>Aula</option>
              <option value='material'>Material</option>
              <option value='exam'>Exame</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Selecione o Recurso</Form.Label>
            <Form.Select value={newResourceId} onChange={(e) => setNewResourceId(e.target.value)}>
              <option value=''>Selecione...</option>
              {getResourceList(newResourceType).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name || item.examName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseResourceModal}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleAddResourceFromModal}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseSessions;
