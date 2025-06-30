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

  /* ESTADOS PARA CRIAÇÃO DE PROVAS */
  const [examName, setExamName] = useState('');
  const [questions, setQuestions] = useState([]);

  /* ESTADOS PARA CRIAÇÃO DE MATERIAL (CUSTOMIZÁVEL) */
  const [materialName, setMaterialName] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');

  /* ESTADOS PARA CRIAÇÃO DE AULA (CUSTOMIZÁVEL) */
  const [lessonName, setLessonName] = useState('');
  const [lessonFile, setLessonFile] = useState('');
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

  function handleNewTag(event) {
    if ((event.key === 'Enter' || event.key === ' ') && tagInput) {
      event.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }

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

  /*
  FUNÇÕES UTILIZADAS NA CRIAÇÃO DE PROVAS
  */
  function createNewAlternative() {
    return { description: '', isTrue: false };
  }
  function createNewQuestion() {
    return {
      question: '',
      alternatives: [createNewAlternative(), createNewAlternative()],
    };
  }

  function handleOpenCreateExamModal() {
    setExamName('');
    setQuestions([createNewQuestion()]); // Inicia com uma pergunta padrão
    setShowExamModal(true);
  }

  function handleCloseExamModal() {
    setShowExamModal(false);
  }

  function handleQuestionChange(index, value) {
    const updatedQuestions = questions.map((q, i) => (i === index ? { ...q, question: value } : q));
    setQuestions(updatedQuestions);
  }

  function handleAddQuestion() {
    setQuestions([...questions, createNewQuestion()]);
  }

  function handleRemoveQuestion(index) {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } else {
      alert('Um exame deve ter pelo menos uma pergunta.');
    }
  }

  function handleAlternativeChange(qIndex, aIndex, value) {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].alternatives[aIndex].description = value;
    setQuestions(updatedQuestions);
  }

  function handleAddAlternative(qIndex) {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].alternatives.push(createNewAlternative());
    setQuestions(updatedQuestions);
  }

  function handleRemoveAlternative(qIndex, aIndex) {
    const question = questions[qIndex];
    if (question.alternatives.length > 2) {
      const updatedAlternatives = question.alternatives.filter((_, i) => i !== aIndex);
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].alternatives = updatedAlternatives;
      setQuestions(updatedQuestions);
    } else {
      alert('Uma pergunta deve ter pelo menos duas alternativas.');
    }
  }

  function handleSetCorrectAlternative(qIndex, aIndex) {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].alternatives = updatedQuestions[qIndex].alternatives.map((alt, i) => ({
      ...alt,
      isTrue: i === aIndex,
    }));
    setQuestions(updatedQuestions);
  }

  async function handleCreateExam() {
    if (!examName || questions.length < 1) return;

    const createExamBody = {
      name: examName,
      questions,
    };

    try {
      await api.post(`/exam/${userId}`, createExamBody);

      setQuestions([createNewQuestion()]);
      setExamName('');
      fetchUserResources();
    } catch (error) {
      alert(`erro ao criar prova: ${error.response.data}`);
    }
  }

  /*
  FUNÇÕES PARA MATERIAL
  */
  async function handleCreateMaterial() {
    if (!materialName || !materialUrl) return;

    const createMaterialBody = {
      name: materialName,
      url: materialUrl,
      description: materialDescription,
    };

    try {
      await api.post(`/material/${userId}`, createMaterialBody);

      setMaterialName();
      setMaterialDescription('');
      setMaterialUrl('');
      setShowMaterialModal(false);
      fetchUserResources();
    } catch (error) {
      alert(`erro ao criar material: ${error.response.data}`);
    }
  }

  /*
  FUNÇÕES PARA AULA
  */
  function getVideoDuration(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const durationInSeconds = video.duration;

        const formatTime = (totalSeconds) => {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = Math.floor(totalSeconds % 60);
          const pad = (num) => String(num).padStart(2, '0');
          return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        };

        resolve(formatTime(durationInSeconds));
      };

      video.onerror = () => {
        reject(new Error('Erro ao carregar metadados do vídeo'));
      };

      video.src = URL.createObjectURL(file);
    });
  }

  async function handleCreateLesson() {
    if (!lessonFile || !lessonName) {
      alert('Por favor, preencha o nome da aula e selecione um vídeo.');
      return;
    }
    setIsLoading(true);

    const fileExtension = lessonFile.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const fileName = encodeURIComponent(uniqueFileName);
    const fileType = encodeURIComponent(lessonFile.type);

    try {
      const duration = await getVideoDuration(lessonFile);

      const awsEndpointResponse = await api.get(
        `/aws/lesson-bucket/presigned-url?fileName=${fileName}&fileType=${fileType}`
      );
      const { url: awsUploadURL } = awsEndpointResponse.data;

      await axios.put(awsUploadURL, lessonFile, {
        headers: { 'Content-Type': lessonFile.type },
      });

      const fileUrl = `https://qualifica-mais-lesson-bucket.s3.us-east-1.amazonaws.com/${fileName}`;

      const createLessonBody = {
        name: lessonName,
        url: fileUrl,
        duration,
        description: lessonDescription,
      };

      await api.post(`/lesson/${userId}`, createLessonBody);
      setLessonFile(null);
      setLessonName('');
      setLessonDescription('');
      setShowLessonModal(false);
      fetchUserResources();
    } catch (error) {
      alert(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsLoading(false);
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
          {['cursos', 'exames', 'materiais', 'aulas'].map((tab) => (
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
                  onClick={handleOpenCreateExamModal}>
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
      <Modal show={showExamModal} onHide={handleCloseExamModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Novo Exame</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label className='fw-bold'>Nome do Exame*</Form.Label>
              <Form.Control
                type='text'
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder='Ex: Prova de JavaScript Básico'
                required
              />
            </Form.Group>

            <hr />

            {questions.map((question, qIndex) => (
              <div key={qIndex} className='p-3 mb-3 border rounded bg-light'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <Form.Label className='fw-bold mb-0'>Pergunta {qIndex + 1}</Form.Label>
                  {questions.length > 1 && (
                    <Button
                      variant='outline-danger'
                      size='sm'
                      className='danger-button'
                      onClick={() => handleRemoveQuestion(qIndex)}>
                      Remover Pergunta
                    </Button>
                  )}
                </div>
                <Form.Control
                  as='textarea'
                  rows={2}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder={`Enunciado da pergunta ${qIndex + 1}`}
                  className='mb-3'
                />

                <Form.Label className='fw-bold'>Alternativas</Form.Label>
                {question.alternatives.map((alt, aIndex) => (
                  <div key={aIndex} className='d-flex align-items-center gap-2 mb-2'>
                    <Form.Check
                      type='radio'
                      name={`question-${qIndex}`}
                      id={`alt-${qIndex}-${aIndex}`}
                      checked={alt.isTrue}
                      onChange={() => handleSetCorrectAlternative(qIndex, aIndex)}
                      aria-label='Marcar como correta'
                    />
                    <Form.Control
                      type='text'
                      value={alt.description}
                      onChange={(e) => handleAlternativeChange(qIndex, aIndex, e.target.value)}
                      placeholder={`Descrição da alternativa ${aIndex + 1}`}
                    />
                    {question.alternatives.length > 2 && (
                      <Button
                        variant='link'
                        className='text-danger p-0'
                        onClick={() => handleRemoveAlternative(qIndex, aIndex)}>
                        <span aria-hidden='true'>&times;</span>
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant='outline-primary'
                  size='sm'
                  className='mt-2'
                  onClick={() => handleAddAlternative(qIndex)}>
                  + Adicionar Alternativa
                </Button>
              </div>
            ))}

            <Button variant='success' className='mt-3' onClick={handleAddQuestion}>
              Adicionar Nova Pergunta
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseExamModal} disabled={isLoading}>
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
              <Form.Label>URL do Material</Form.Label>
              <Form.Control
                type='text'
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                placeholder='Algum link de youtube, pdf, slides, etc.'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as='textarea'
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                placeholder='Descrição do material'
              />
            </Form.Group>
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
            {isLoading ? renderLoadingButton('Enviando') : 'Criar Material'}
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
              <Form.Label>Arquivo</Form.Label>
              <Form.Control
                type='file'
                accept='video/*'
                onChange={(e) => setLessonFile(e.target.files[0])}
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
