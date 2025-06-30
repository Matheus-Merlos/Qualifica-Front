import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { Col, Card, Image } from 'react-bootstrap';
import SearchBar from '../../components/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAtom } from 'jotai';
import { emailAtom, nameAtom, userIdAtom } from '../../store/persistentAtoms';
import { FiUser } from 'react-icons/fi';
import api from '../../utils/api';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const courses = [
  { id: 1, name: 'JS Fundamentals', description: 'Curso de JavaScript básico.' },
  { id: 2, name: 'React Avançado', description: 'Curso avançado de React.' },
];

const TabPanel = ({ children, activeTab, index }) => (
  <div
    role='tabpanel'
    hidden={activeTab !== index}
    id={`user-tabpanel-${index}`}
    aria-labelledby={`user-tab-${index}`}>
    {activeTab === index && <div className='py-3'>{children}</div>}
  </div>
);

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('cursos');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [userId] = useAtom(userIdAtom);
  const [name] = useAtom(nameAtom);
  const [email] = useAtom(emailAtom);

  const [isLoading, setIsLoading] = useState(false);

  const [courseName, setCourseName] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [description, setDescription] = useState('');

  async function handleCreateCourse() {
    if (!thumbnailFile) return;

    setIsLoading(true);

    const fileExtension = thumbnailFile.name.split('.').pop();
    const uniqueId = uuidv4();
    const uniqueFileName = `${uniqueId}.${fileExtension}`;

    const fileName = encodeURIComponent(uniqueFileName);
    const fileType = encodeURIComponent(thumbnailFile.type);

    try {
      //Pega URL assinada
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
    } catch (error) {
      alert(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewTag(event) {
    if ((event.key === 'Enter' || event.key === 'Space') && tagInput) {
      event.preventDefault();
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  }

  const renderCourseCard = (course) => (
    <Col xs={12} sm={6} md={4} lg={3} key={course.id} className='mb-4'>
      <Card
        className='h-100 shadow-sm'
        style={{
          borderRadius: '8px',
          backgroundColor: '#f5f0ff',
          transition: 'transform 0.2s',
          border: 'none',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}>
        <div
          style={{
            paddingTop: '100%',
            position: 'relative',
            backgroundColor: '#e8e0ff',
            borderRadius: '8px 8px 0 0',
          }}>
          {/* Course image placeholder */}
        </div>
        <Card.Body className='d-flex flex-column'>
          <Card.Title className='text-center mb-0'>{course.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f3f4f8 60%, #f8f9fa 100%)',
      }}>
      <SearchBar />
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingTop: 40,
          paddingLeft: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
        {/* User Info Section */}
        <div
          className='d-flex align-items-center p-3 bg-white rounded shadow-sm'
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            minWidth: 280,
            minHeight: 90,
            marginBottom: 10,
          }}>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '64px',
              height: '64px',
              border: '3px solid #7e57c2',
              backgroundColor: '#f7f3ff',
              overflow: 'hidden',
              fontWeight: 600,
              color: '#7e57c2',
              fontSize: 16,
              textAlign: 'center',
              flexShrink: 0,
            }}>
            <FiUser size={45} className='profile-picture' />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#222', fontSize: 18 }}>{name}</div>
            <div style={{ color: '#888', fontSize: 14 }}>{email}</div>
          </div>
        </div>
        {/* Tabs */}
        <div className='d-flex border-bottom' style={{ gap: 24, marginBottom: 30, marginLeft: 8 }}>
          <button
            onClick={() => setActiveTab('cursos')}
            className={`btn btn-link text-decoration-none px-0 py-1 ${activeTab === 'cursos' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
            style={{
              fontWeight: 500,
              borderRadius: 0,
              marginBottom: '-2px',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              fontSize: 15,
              minWidth: 60,
            }}>
            Cursos
          </button>
          <button
            onClick={() => setActiveTab('exames')}
            className={`btn btn-link text-decoration-none px-0 py-1 ${activeTab === 'exames' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
            style={{
              fontWeight: 500,
              borderRadius: 0,
              marginBottom: '-2px',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              fontSize: 15,
              minWidth: 60,
            }}>
            Exames
          </button>
          <button
            onClick={() => setActiveTab('materiais')}
            className={`btn btn-link text-decoration-none px-0 py-1 ${activeTab === 'materiais' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
            style={{
              fontWeight: 500,
              borderRadius: 0,
              marginBottom: '-2px',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              fontSize: 15,
              minWidth: 60,
            }}>
            Materiais
          </button>
          <button
            onClick={() => setActiveTab('certificados')}
            className={`btn btn-link text-decoration-none px-0 py-1 ${activeTab === 'certificados' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
            style={{
              fontWeight: 500,
              borderRadius: 0,
              marginBottom: '-2px',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              fontSize: 15,
              minWidth: 60,
            }}>
            Certificados
          </button>
          <button
            onClick={() => setActiveTab('aulas')}
            className={`btn btn-link text-decoration-none px-0 py-1 ${activeTab === 'aulas' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
            style={{
              fontWeight: 500,
              borderRadius: 0,
              marginBottom: '-2px',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              fontSize: 15,
              minWidth: 60,
            }}>
            Aulas
          </button>
        </div>
        {/* Cards/Conteúdo */}
        <div style={{ minWidth: 320 }}>
          {activeTab === 'cursos' && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginLeft: 8,
                  marginBottom: 18,
                }}>
                <Button
                  variant='primary'
                  style={{ height: 44, borderRadius: 10, fontWeight: 500 }}
                  onClick={() => setShowModal(true)}>
                  + Novo Curso
                </Button>
              </div>
              <div style={{ display: 'flex', gap: 16, marginLeft: 8 }}>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      style={{
                        width: 180,
                        minHeight: 180,
                        background: '#ece6fa',
                        borderRadius: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(126,87,194,0.05)',
                        fontWeight: 500,
                        color: '#3d2465',
                        fontSize: 17,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        padding: 12,
                      }}>
                      <div style={{ flex: 1, width: '100%' }}>
                        <div style={{ fontWeight: 600 }}>{course.name}</div>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
                          {course.description}
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
                    {/* Dados do Curso */}
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
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Form.Control
                          type='text'
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder='Digite uma tag e pressione Enter'
                          onKeyDown={handleNewTag}
                        />
                      </div>
                      <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#ece6fa',
                              borderRadius: 8,
                              padding: '2px 10px',
                              fontSize: 13,
                              color: '#7e57c2',
                              marginRight: 4,
                            }}>
                            {tag}{' '}
                            <span
                              style={{ cursor: 'pointer', color: '#c00', marginLeft: 4 }}
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
                    {/* Certificado */}
                    {/*<Form.Group className='mb-3'>
                      <Form.Label>Certificado (arquivo)</Form.Label>
                      <Form.Control
                        type='file'
                        accept='application/pdf,image/*'
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, certificate: e.target.files[0] })
                        }
                      />
                    </Form.Group>*/}
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
