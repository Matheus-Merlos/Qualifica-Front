import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import SearchBar from '../../components/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // O mesmo arquivo CSS que você forneceu
import { useAtom } from 'jotai';
import { emailAtom, nameAtom, userIdAtom } from '../../store/persistentAtoms';
import { FiUser } from 'react-icons/fi';
import api from '../../utils/api';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('cursos');
  const navigate = useNavigate();

  const [userId] = useAtom(userIdAtom);
  const [name] = useAtom(nameAtom);
  const [email] = useAtom(emailAtom);

  /* ESTADOS DE RECURSOS DO USUÁRIO */
  const [userCourses, setUserCourses] = useState([]);
  const [userExams, setUserExams] = useState([]);
  const [userMaterials, setUserMaterials] = useState([]);
  const [userLessons, setUserLessons] = useState([]);

  /* ESTADOS PARA CONFIGURAÇÃO DE UI */
  const [isLoading, setIsLoading] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  /* ESTADOS PARA CRIAÇÃO DE CURSO */
  const [courseName, setCourseName] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [description, setDescription] = useState('');

  /* ESTADOS PARA CRIAÇÃO DE EXAME (CUSTOMIZÁVEL) */
  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');

  /* ESTADOS PARA CRIAÇÃO DE MATERIAL (CUSTOMIZÁVEL) */
  const [materialName, setMaterialName] = useState('');
  const [materialFile, setMaterialFile] = useState(null);

  /* ESTADOS PARA CRIAÇÃO DE AULA (CUSTOMIZÁVEL) */
  const [lessonName, setLessonName] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');

  async function fetchUserResources() {
    try {
      // Usando Promise.all para carregar recursos em paralelo
      const [coursesRes, examsRes, materialsRes, lessonsRes] = await Promise.all([
        api.get(`course/${userId}/courses`),
        api.get(`exam/${userId}/exams`),
        api.get(`material/${userId}/materials`),
        api.get(`lesson/${userId}/lessons`),
      ]);

      setUserCourses(coursesRes.data);
      setUserExams(examsRes.data);
      setUserMaterials(materialsRes.data);
      setUserLessons(lessonsRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao buscar recursos.');
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserResources();
    }
  }, [userId]);

  async function handleCreateCourse() {
    if (!thumbnailFile || !courseName) {
      alert('Por favor, preencha o nome do curso e selecione uma imagem.');
      return;
    }
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
      setShowCourseModal(false);
      fetchUserResources(); // Recarrega TODOS os recursos para manter a UI sincronizada
    } catch (error) {
      alert(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  // --- NOVAS FUNÇÕES DE CRIAÇÃO (PLACEHOLDERS) ---

  async function handleCreateExam() {
    if (!examName) {
      alert('O nome do exame é obrigatório.');
      return;
    }
    setIsLoading(true);
    try {
      // **TODO: Substitua pela sua lógica de API real**
      const body = { name: examName, description: examDescription };
      await api.post(`/exam/${userId}`, body);
      setShowExamModal(false);
      fetchUserResources();
    } catch (error) {
      alert(`Erro ao criar exame: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateMaterial() {
    if (!materialName || !materialFile) {
      alert('Por favor, preencha o nome do material e selecione um arquivo.');
      return;
    }
    setIsLoading(true);
    try {
      // **TODO: Implemente a lógica de upload de arquivo (similar ao curso, se necessário)**
      // e a chamada de API para criar o material.
      console.log('Criando material:', { name: materialName, file: materialFile });
      // Exemplo: await api.post(`/material/${userId}`, formData);

      // Placeholder para demonstração:
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula chamada de API

      setShowMaterialModal(false);
      fetchUserResources();
    } catch (error) {
      alert(`Erro ao criar material: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateLesson() {
    if (!lessonName) {
      alert('O nome da aula é obrigatório.');
      return;
    }
    setIsLoading(true);
    try {
      // **TODO: Substitua pela sua lógica de API real**
      const body = { name: lessonName, description: lessonDescription };
      await api.post(`/lesson/${userId}`, body);
      setShowLessonModal(false);
      fetchUserResources();
    } catch (error) {
      alert(`Erro ao criar aula: ${error.message}`);
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

  const renderLoadingButton = () => (
    <>
      <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />{' '}
      Carregando...
    </>
  );

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
          {['cursos', 'exames', 'materiais', 'aulas', 'certificados'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-link text-decoration-none px-0 py-1 user-profile-tab-button ${
                activeTab === tab
                  ? 'text-primary border-bottom border-primary border-3'
                  : 'text-muted'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* --- Conteúdo das Abas --- */}
        <div className='user-profile-tab-content'>
          {/* --- ABA CURSOS --- */}
          {activeTab === 'cursos' && (
            <>
              <div className='user-profile-actions-container'>
                <Button
                  variant='primary'
                  className='user-profile-new-course-button'
                  onClick={() => setShowCourseModal(true)}>
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
            </>
          )}

          {/* --- ABA EXAMES --- */}
          {activeTab === 'exames' && (
            <>
              <div className='user-profile-actions-container'>
                <Button
                  variant='primary'
                  className='user-profile-new-course-button'
                  onClick={() => setShowExamModal(true)}>
                  + Novo Exame
                </Button>
              </div>
              <div className='user-profile-courses-grid'>
                {userExams.length > 0 ? (
                  userExams.map((exam) => (
                    <div key={exam.id} className='user-profile-course-card'>
                      <div className='user-profile-course-card-content'>
                        <div className='user-profile-course-card-title'>{exam.name}</div>
                        <div className='user-profile-course-card-description'>
                          {exam.description}
                        </div>
                      </div>
                      {/* Adicione botões de ação se necessário */}
                    </div>
                  ))
                ) : (
                  <div className='text-muted'>Nenhum exame encontrado.</div>
                )}
              </div>
            </>
          )}

          {/* --- ABA MATERIAIS --- */}
          {activeTab === 'materiais' && (
            <>
              <div className='user-profile-actions-container'>
                <Button
                  variant='primary'
                  className='user-profile-new-course-button'
                  onClick={() => setShowMaterialModal(true)}>
                  + Novo Material
                </Button>
              </div>
              <div className='user-profile-courses-grid'>
                {userMaterials.length > 0 ? (
                  userMaterials.map((material) => (
                    <div key={material.id} className='user-profile-course-card'>
                      <div className='user-profile-course-card-content'>
                        <div className='user-profile-course-card-title'>{material.name}</div>
                        {/* Exiba mais detalhes se houver */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-muted'>Nenhum material encontrado.</div>
                )}
              </div>
            </>
          )}

          {/* --- ABA CERTIFICADOS (ainda sem funcionalidade) --- */}
          {activeTab === 'certificados' && (
            <div className='text-muted'>Certificados serão exibidos aqui</div>
          )}

          {/* --- ABA AULAS --- */}
          {activeTab === 'aulas' && (
            <>
              <div className='user-profile-actions-container'>
                <Button
                  variant='primary'
                  className='user-profile-new-course-button'
                  onClick={() => setShowLessonModal(true)}>
                  + Nova Aula
                </Button>
              </div>
              <div className='user-profile-courses-grid'>
                {userLessons.length > 0 ? (
                  userLessons.map((lesson) => (
                    <div key={lesson.id} className='user-profile-course-card'>
                      <div className='user-profile-course-card-content'>
                        <div className='user-profile-course-card-title'>{lesson.name}</div>
                        <div className='user-profile-course-card-description'>
                          {lesson.description}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-muted'>Nenhuma aula encontrada.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- MODAIS --- */}

      {/* Modal Novo Curso */}
      <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)}>
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
            onClick={() => setShowCourseModal(false)}
            disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleCreateCourse} disabled={isLoading}>
            {isLoading ? renderLoadingButton('Enviando') : 'Enviar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Novo Exame */}
      <Modal show={showExamModal} onHide={() => setShowExamModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Exame</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Nome do Exame</Form.Label>
              <Form.Control
                type='text'
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder='Digite o nome do exame'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as='textarea'
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                placeholder='Descrição ou instruções do exame'
              />
            </Form.Group>
            {/* **ADICIONE AQUI OUTROS CAMPOS PARA O EXAME** */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowExamModal(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleCreateExam} disabled={isLoading}>
            {isLoading ? renderLoadingButton('Criando') : 'Criar Exame'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Novo Material */}
      <Modal show={showMaterialModal} onHide={() => setShowMaterialModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Material de Apoio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Nome do Material</Form.Label>
              <Form.Control
                type='text'
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder='Ex: Apostila de React, Lista de Exercícios'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Arquivo</Form.Label>
              <Form.Control type='file' onChange={(e) => setMaterialFile(e.target.files[0])} />
            </Form.Group>
            {/* **ADICIONE AQUI OUTROS CAMPOS PARA O MATERIAL** */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowMaterialModal(false)}
            disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleCreateMaterial} disabled={isLoading}>
            {isLoading ? renderLoadingButton('Enviando') : 'Enviar Material'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Nova Aula */}
      <Modal show={showLessonModal} onHide={() => setShowLessonModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Aula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Nome da Aula</Form.Label>
              <Form.Control
                type='text'
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder='Digite o nome da aula'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as='textarea'
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                placeholder='Descrição da aula'
              />
            </Form.Group>
            {/* **ADICIONE AQUI OUTROS CAMPOS PARA A AULA (Ex: URL do vídeo, etc)** */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowLessonModal(false)}
            disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleCreateLesson} disabled={isLoading}>
            {isLoading ? renderLoadingButton('Criando') : 'Criar Aula'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
