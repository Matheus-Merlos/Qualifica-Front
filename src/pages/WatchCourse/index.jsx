import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiCheckSquare,
  FiSquare,
  FiFilm,
  FiClipboard,
  FiPaperclip,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
} from 'react-icons/fi';
import api from '../../utils/api';
import './styles.css';
import { useAtom } from 'jotai';
import { userIdAtom } from '../../store/persistentAtoms';
import ResourceViewer from './ResourceViewer';
import SearchBar from '../../components/SearchBar';

export default function WatchCourse() {
  const { courseId, resourceType, resourceId, sectionResourceId } = useParams();

  const navigate = useNavigate();

  const [userId] = useAtom(userIdAtom);

  const [courseProgress, setCourseProgress] = useState(null);
  const [currentResource, setCurrentResource] = useState(null);
  const [openSections, setOpenSections] = useState([]);

  const [loading, setLoading] = useState(true);

  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);

  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    async function fetchCurrentProgress() {
      try {
        const response = await api.get(
          `/course/${courseId}/progress/${userId}/${sectionResourceId}`
        );
        setCurrentProgress(response.data.timeWatched);
      } catch {
        console.error('Erro ao salvar progresso do vídeo atual');
      }
    }

    if (resourceType === 'lesson' && courseId && userId && sectionResourceId) {
      fetchCurrentProgress();
    }
  }, [courseId, userId, sectionResourceId]);

  async function saveProgress({ playedSeconds }) {
    if (Math.floor(playedSeconds) % 5 !== 0) {
      return;
    }

    const hours = Math.floor(playedSeconds / 3600);
    const minutes = Math.floor((playedSeconds % 3600) / 60);
    const seconds = Math.floor(playedSeconds % 60);

    const pad = (num) => String(num).padStart(2, '0');

    const time = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    try {
      await api.patch(`/course/${courseId}/progress/${userId}/${sectionResourceId}`, {
        time,
      });
      setCommentContent('');
      fetchComments();
    } catch {
      console.error('Erro ao salvar progresso do vídeo atual');
    }
  }

  //Função de criar comentários
  async function handleCommentCreation() {
    if (commentContent.trim() === '') {
      return;
    }
    try {
      await api.post(`/comment/${sectionResourceId}`, { userId, content: commentContent });
      setCommentContent('');
      fetchComments();
    } catch (error) {
      alert(`Erro ao criar comentário: ${error.response.data}`);
    }
  }

  //Função de pegar os comentários da aula
  async function fetchComments() {
    try {
      const response = await api.get(`/comment/${sectionResourceId}/comment`);
      setComments(response.data);
    } catch (error) {
      console.error('Erro ao buscar progresso do curso:', error);
    }
  }

  useEffect(() => {
    if (sectionResourceId) fetchComments();
  }, [sectionResourceId]);

  // Efeito para buscar o progresso geral do curso
  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!userId) {
        return;
      }
      try {
        const response = await api.get(`/course/${courseId}/progress/${userId}`);
        console.log(response.data);
        setCourseProgress(response.data);
        // Abre todas as seções por padrão
        setOpenSections(response.data.sections.map((s) => s.id));
      } catch (error) {
        console.error('Erro ao buscar progresso do curso:', error);
      }
    };

    fetchCourseProgress();
  }, [courseId, userId]);

  // Efeito para buscar o conteúdo do recurso específico (aula/prova)
  useEffect(() => {
    const fetchResource = async () => {
      if (resourceType && resourceId) {
        setLoading(true);
        try {
          const response = await api.get(`/${resourceType}/${resourceId}`);
          setCurrentResource({ type: resourceType, data: response.data });
        } catch (error) {
          console.error(`Erro ao buscar ${resourceType}:`, error);
          setCurrentResource(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceType, resourceId]);

  function handleToggleSection(sectionId) {
    setOpenSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  }

  function handleSelectResource(resource) {
    const columnNames = {
      exam: 'sectionExamId',
      lesson: 'sectionLessonId',
      material: 'sectionMaterialId',
    };

    const type = resource.type;
    const sectionId = resource.content[columnNames[resource.type]];
    const id = resource.content.id;

    navigate(`/course/${courseId}/watch/${type}/${id}/${sectionId}`);
  }

  async function handleExamSubmit(answers) {
    const formattedAnswers = Object.entries(answers).map(([questionId, alternativeId]) => ({
      questionId: Number(questionId),
      alternativeId: Number(alternativeId),
    }));

    try {
      for (const answer of formattedAnswers) {
        try {
          await api.delete(`exam/${resourceId}/answers/${userId}/${answer.questionId}`);
        } catch {}
        await api.post(`exam/${resourceId}/answers/${userId}/${answer.questionId}`, {
          alternative: answer.alternativeId,
        });
      }

      const response = await api.get(`/exam/${resourceId}/answers/${userId}`);

      return response.data;
    } catch (error) {
      console.error('Erro no processo de submissão e busca de resultados:', error);
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'lesson':
        return <FiFilm />;
      case 'exam':
        return <FiClipboard />;
      case 'material':
        return <FiPaperclip />;
      default:
        return null;
    }
  };

  if (!courseProgress) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <SearchBar />
      <div className='watch-course-page'>
        <aside className='course-sidebar'>
          <header className='sidebar-header'>
            <Link to={`/course/${courseId}`} className='back-link'>
              <FiArrowLeft /> Voltar
            </Link>

            <h3>{courseProgress.name}</h3>

            <div className='progress-bar'>
              {/* Lógica de progresso precisa ser implementada */}

              <div className='progress-bar-fill' style={{ width: '20%' }} />
            </div>
          </header>

          <div className='course-content-list'>
            {courseProgress.sections.map((section) => (
              <div key={section.id} className='sidebar-section'>
                <div
                  className='sidebar-section-header'
                  onClick={() => handleToggleSection(section.id)}>
                  <span>{section.name}</span>

                  {openSections.includes(section.id) ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {openSections.includes(section.id) && (
                  <ul className='resource-list'>
                    {section.resources.map((resource) => (
                      <li
                        key={`${resource.type}-${resource.content.id}`}
                        className={`resource-item ${resource.content.id.toString() === resourceId ? 'active' : ''}`}
                        onClick={() => handleSelectResource(resource)}>
                        {resource.type === 'lesson' || resource.type === 'exam' ? (
                          resource.completed ? (
                            <FiCheckSquare className='completed-icon' />
                          ) : (
                            <FiSquare className='incompleted-icon' />
                          )
                        ) : (
                          <div className='icon-placeholder' />
                        )}

                        <span className='resource-icon'>{getResourceIcon(resource.type)}</span>

                        <span>{resource.content.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className='main-content-area'>
          {loading ? (
            <div>Carregando conteúdo...</div>
          ) : currentResource ? (
            <ResourceViewer
              resource={currentResource}
              onProgress={currentResource?.type === 'lesson' ? saveProgress : undefined}
              startTime={currentResource?.type === 'lesson' ? currentProgress : 0}
              onExamSubmit={currentResource?.type === 'exam' ? handleExamSubmit : undefined}
            />
          ) : (
            <div>Nenhum conteúdo encontrado.</div>
          )}

          {/* Seção de Comentários */}
          {resourceType === 'lesson' && (
            <div className='comments-section'>
              <h3>Comentários</h3>

              <div className='comment-box'>
                <textarea
                  placeholder='Deixe seu comentário...'
                  onChange={(e) => setCommentContent(e.target.value)}
                  value={commentContent}
                />

                <button onClick={handleCommentCreation}>Enviar</button>
              </div>

              {comments.map((comment) => (
                <div className='comment' key={comment.id}>
                  <p>
                    <strong>{comment.user}</strong> {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
