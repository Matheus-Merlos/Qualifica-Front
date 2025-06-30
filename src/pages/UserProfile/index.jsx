import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import SearchBar from '../../components/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Importe o novo arquivo CSS
import { useAtom } from 'jotai';
import { emailAtom, nameAtom, userIdAtom } from '../../store/persistentAtoms';
import { FiUser } from 'react-icons/fi';
import api from '../../utils/api';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('cursos');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [userId] = useAtom(userIdAtom);
  const [name] = useAtom(nameAtom);
  const [email] = useAtom(emailAtom);

  /* ESTADOS DE RECURSOS DO USUÁRIO */
  const [userCourses, setUserCourses] = useState([]);

  /* ESTADOS PARA CONFIGURAÇÃO DE UI */
  const [isLoading, setIsLoading] = useState(false);

  /* ESTADOS PARA CRIAÇÃO DE CURSO */
  const [courseName, setCourseName] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [description, setDescription] = useState('');

  async function fetchUserCourses() {
    try {
      const response = await api.get(`course/${userId}/courses`);
      setUserCourses(response.data);
    } catch (error) {
      alert(error.response.data);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserCourses();
    }
  }, [userId]);

  async function handleCreateCourse() {
    if (!thumbnailFile) return;
    setIsLoading(true);

    const fileExtension = thumbnailFile.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const fileName = encodeURIComponent(uniqueFileName);
    const fileType = encodeURIComponent(thumbnailFile.type);

    try {
      const awsEndpointResponse = await api.get(
        `/aws/presigned-url?fileName=${fileName}&fileType=${fileType}`
      );
      const { url: awsUploadURL } = awsEndpointResponse.data;

      await axios.put(awsUploadURL, thumbnailFile, {
        headers: { 'Content-Type': thumbnailFile.type },
      });

      const fileUrl = `https://qualifica-mais-thumbnail-bucket.s3.us-east-1.amazonaws.com/${fileName}`;

      const createCourseBody = {
        name: courseName,
        imageUrl: fileUrl,
        description,
        tags,
      };

      await api.post(`/course/${userId}`, createCourseBody);
      setShowModal(false);
      fetchUserCourses();
    } catch (error) {
      alert(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewTag(event) {
    if ((event.key === 'Enter' || event.key === ' ') && tagInput) {
      event.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }

  return (
    <div className='user-profile-container'>
      <SearchBar />
      <div className='user-profile-content-wrapper'>
        {/* User Info Section */}
        <div className='d-flex align-items-center p-3 bg-white rounded shadow-sm user-profile-info-card'>
          <div className='rounded-circle d-flex align-items-center justify-content-center me-3 user-profile-avatar-wrapper'>
            <FiUser size={45} className='profile-picture' />
          </div>
          <div>
            <div className='user-profile-name'>{name}</div>
            <div className='user-profile-email'>{email}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className='d-flex border-bottom user-profile-tabs-container'>
          <button
            onClick={() => setActiveTab('cursos')}
            className={`btn btn-link text-decoration-none px-0 py-1 user-profile-tab-button ${
              activeTab === 'cursos'
                ? 'text-primary border-bottom border-primary border-3'
                : 'text-muted'
            }`}>
            Cursos
          </button>
          <button
            onClick={() => setActiveTab('exames')}
            className={`btn btn-link text-decoration-none px-0 py-1 user-profile-tab-button ${
              activeTab === 'exames'
                ? 'text-primary border-bottom border-primary border-3'
                : 'text-muted'
            }`}>
            Exames
          </button>
          <button
            onClick={() => setActiveTab('materiais')}
            className={`btn btn-link text-decoration-none px-0 py-1 user-profile-tab-button ${
              activeTab === 'materiais'
                ? 'text-primary border-bottom border-primary border-3'
                : 'text-muted'
            }`}>
            Materiais
          </button>
          <button
            onClick={() => setActiveTab('certificados')}
            className={`btn btn-link text-decoration-none px-0 py-1 user-profile-tab-button ${
              activeTab === 'certificados'
                ? 'text-primary border-bottom border-primary border-3'
                : 'text-muted'
            }`}>
            Certificados
          </button>
          <button
            onClick={() => setActiveTab('aulas')}
            className={`btn btn-link text-decoration-none px-0 py-1 user-profile-tab-button ${
              activeTab === 'aulas'
                ? 'text-primary border-bottom border-primary border-3'
                : 'text-muted'
            }`}>
            Aulas
          </button>
        </div>

        {/* Cards/Conteúdo */}
        <div className='user-profile-tab-content'>
          {activeTab === 'cursos' && (
            <>
              <div className='user-profile-actions-container'>
                <Button
                  variant='primary'
                  className='user-profile-new-course-button'
                  onClick={() => setShowModal(true)}>
                  + Novo Curso
                </Button>
              </div>
              <div className='user-profile-courses-grid'>
                {userCourses.length > 0 ? (
                  userCourses.map((course) => (
                    <div key={course.id} className='user-profile-course-card'>
                      <div className='user-profile-course-card-content'>
                        <div className='user-profile-course-card-title'>{course.name}</div>
                        <div className='user-profile-course-card-description'>
                          {course.description?.length > 200
                            ? `${course.description.slice(0, 200)}...`
                            : course.description}
                        </div>
                      </div>
                      <button
                        className='btn btn-outline-secondary btn-sm mt-2'
                        onClick={() => navigate(`/cursos/${course.id}/sessoes`)}>
                        Gerenciar Sessões
                      </button>
                    </div>
                  ))
                ) : (
                  <div className='text-muted'>Nenhum curso encontrado.</div>
                )}
              </div>
              {/* Modal Novo Curso */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Novo Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className='mb-3'>
                      <Form.Label>Nome do Curso</Form.Label>
                      <Form.Control
                        type='text'
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder='Digite o nome do curso'
                      />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        as='textarea'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Descrição do curso'
                      />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                      <Form.Label>Tags</Form.Label>
                      <div className='user-profile-tag-input-wrapper'>
                        <Form.Control
                          type='text'
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder='Digite uma tag e pressione Enter/Espaço'
                          onKeyDown={handleNewTag}
                        />
                      </div>
                      <div className='user-profile-tags-display-area'>
                        {tags.map((tag, idx) => (
                          <span key={idx} className='user-profile-tag-pill'>
                            {tag}{' '}
                            <span
                              className='user-profile-tag-remove-button'
                              onClick={() => setTags(tags.filter((t, i) => i !== idx))}>
                              ×
                            </span>
                          </span>
                        ))}
                      </div>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                      <Form.Label>Imagem do Curso</Form.Label>
                      <Form.Control
                        type='file'
                        accept='image/*'
                        onChange={(e) => setThumbnailFile(e.target.files[0])}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant='secondary'
                    onClick={() => setShowModal(false)}
                    disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button variant='primary' onClick={handleCreateCourse} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner
                          as='span'
                          animation='border'
                          size='sm'
                          role='status'
                          aria-hidden='true'
                        />{' '}
                        Carregando...
                      </>
                    ) : (
                      'Enviar'
                    )}
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
          {activeTab === 'exames' && <div className='text-muted'>Exames serão exibidos aqui</div>}
          {activeTab === 'materiais' && (
            <div className='text-muted'>Materiais serão exibidos aqui</div>
          )}
          {activeTab === 'certificados' && (
            <div className='text-muted'>Certificados serão exibidos aqui</div>
          )}
          {activeTab === 'aulas' && <div className='text-muted'>Aulas serão exibidas aqui</div>}
        </div>
      </div>
    </div>
  );
}
