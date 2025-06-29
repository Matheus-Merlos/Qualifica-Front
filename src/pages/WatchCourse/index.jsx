import React, { useState, useEffect, useRef } from 'react';
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

// Componente para renderizar o conteúdo principal (vídeo, prova ou material)
const ResourceViewer = ({ resource, onProgress = console.log, startTime = 0 }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleMetadataLoaded = () => {
      if (startTime > 0 && startTime < videoElement.duration) {
        console.log(`Pulando o vídeo para ${startTime} segundos.`);
        videoElement.currentTime = startTime;
      }
    };

    const handleTimeUpdate = () => {
      if (onProgress) {
        onProgress({ playedSeconds: videoElement.currentTime });
      }
    };

    videoElement.addEventListener('loadedmetadata', handleMetadataLoaded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleMetadataLoaded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [resource, onProgress, startTime]);

  if (!resource || resource.type !== 'lesson') {
    return (
      <div className='resource-placeholder'>
        <h2>Selecione uma aula na barra lateral.</h2>
      </div>
    );
  }

  const videoUrl = resource.data?.url;
  if (!videoUrl) {
    return <div className='resource-placeholder'>URL da aula não encontrada.</div>;
  }

  return (
    <div className='resource-content'>
      <div className='video-player-wrapper-final'>
        <video
          ref={videoRef}
          key={videoUrl}
          controls
          autoPlay
          muted
          playsInline
          style={{ width: '100%', height: 'auto' }}>
          <source src={videoUrl} type='video/mp4' />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>
      <h3>{resource.data.name}</h3>
      <p>{resource.data.description}</p>
    </div>
  );
};

export default function WatchCourse() {
  const { courseId, resourceType, resourceId } = useParams();
  const navigate = useNavigate();
  const [userId] = useAtom(userIdAtom);

  const [courseProgress, setCourseProgress] = useState(null);
  const [currentResource, setCurrentResource] = useState(null);
  const [openSections, setOpenSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efeito para buscar o progresso geral do curso
  useEffect(() => {
    const fetchCourseProgress = async () => {
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

  const handleToggleSection = (sectionId) => {
    setOpenSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleSelectResource = (type, id) => {
    navigate(`/course/${courseId}/watch/${type}/${id}`);
  };

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
                      onClick={() => handleSelectResource(resource.type, resource.content.id)}>
                      {
                        resource.type === 'lesson' || resource.type === 'exam' ? (
                          resource.completed ? (
                            <FiCheckSquare className='completed-icon' />
                          ) : (
                            <FiSquare className='incompleted-icon' />
                          )
                        ) : (
                          <div className='icon-placeholder' />
                        ) // Espaço para 'material'
                      }
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
        ) : (
          <ResourceViewer resource={currentResource} />
        )}

        {/* Placeholder para a seção de comentários */}
        <div className='comments-section'>
          <h3>Comentários</h3>
          <div className='comment-box'>
            <textarea placeholder='Deixe seu comentário...' />
            <button>Enviar</button>
          </div>
          <div className='comment'>
            <p>
              <strong>Usuário 1:</strong> Ótima aula, muito bem explicado!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
