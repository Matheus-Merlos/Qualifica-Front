import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiBookOpen,
  FiDownload,
  FiFilm,
  FiClipboard,
  FiPaperclip,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import api from '../../utils/api';
import './styles.css';

// Componente de imagem com fallback
const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = 'https://via.placeholder.com/800x450?text=Sem+Imagem',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

// Componente auxiliar para renderizar o ícone correto baseado no tipo de recurso
const ResourceIcon = ({ type }) => {
  switch (type) {
    case 'lesson':
      return <FiFilm className='resource-icon' />;
    case 'exam':
      return <FiClipboard className='resource-icon' />;
    case 'material':
      return <FiPaperclip className='resource-icon' />;
    default:
      return <FiBookOpen className='resource-icon' />;
  }
};

export default function Curso() {
  const [course, setCourse] = useState({
    id: null,
    name: 'Carregando...',
    description: 'Carregando descrição...',
    progress: 0,
    imageUrl: null,
    owner: null,
    sections: [],
    tags: [],
    totalLessons: 0,
    totalDuration: '0h 00min',
    lastAccessed: new Date().toLocaleDateString('pt-BR'),
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  // Estado para controlar qual seção do acordeão está aberta
  const [openSectionId, setOpenSectionId] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/course/${id}`);
        const courseData = response.data;

        const processedData = {
          ...courseData,
          name: courseData.name || 'Curso sem nome',
          description: courseData.description || 'Nenhuma descrição disponível para este curso.',
          progress: courseData.progress || 0,
          imageUrl:
            courseData.imageUrl ||
            'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
          sections: courseData.sections || [],
          tags: courseData.tags || [],
          totalLessons:
            courseData.sections?.reduce(
              (acc, section) => acc + (section.resources?.length || 0),
              0
            ) || 0,
          totalDuration: '4h 20min',
          lastAccessed: new Date().toLocaleDateString('pt-BR'),
        };

        setCourse(processedData);

        // Abre a primeira seção por padrão, se houver alguma
        if (processedData.sections?.length > 0) {
          setOpenSectionId(processedData.sections[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar curso:', error);
        setError('Não foi possível carregar as informações do curso. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    } else {
      setError('ID do curso não fornecido');
      setLoading(false);
    }
  }, [id]);

  // Função para abrir/fechar as seções do acordeão
  const toggleSection = (sectionId) => {
    setOpenSectionId(openSectionId === sectionId ? null : sectionId);
  };

  // Função para rolar a tela suavemente até um elemento
  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div
        className='loading'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666',
        }}>
        Carregando informações do curso...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='error'
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          margin: '2rem auto',
          maxWidth: '600px',
        }}>
        <h2>Erro ao carregar o curso</h2>
        <p>{error}</p>
        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Voltar para a página anterior
        </button>
      </div>
    );
  }

  return (
    <div className='course-detail'>
      {/* Hero Section */}
      <div className='hero'>
        <ImageWithFallback src={course.imageUrl} alt={course.name} className='hero-image' />
        <div className='hero-content'>
          <h1 className='hero-title'>{course.name}</h1>
          <div className='progress-bar'>
            <div className='progress-bar-fill' style={{ width: `${course.progress}%` }} />
          </div>
          <div className='hero-meta'>
            <span>{course.progress}% concluído</span>
            <span>{course.totalLessons} aulas</span>
            <span>{course.totalDuration}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='main-content'>
        {/* Left Column - Course Content */}
        <div className='about'>
          {/* Description Section */}
          <section id='course-description' className='section'>
            <h2 className='section-title'>Descrição</h2>
            {course.description ? (
              <p>{course.description}</p>
            ) : (
              <p className='no-content'>Este curso ainda não possui uma descrição.</p>
            )}

            {course.tags?.length > 0 && (
              <div className='tags-container'>
                {course.tags.map((tag, index) => (
                  <span key={index} className='tag'>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Course Content Section */}
          <section id='course-content' className='section'>
            <h2 className='section-title'>Conteúdo do curso</h2>
            {course.sections?.length > 0 ? (
              <div className='course-content-accordion'>
                {course.sections.map((section) => (
                  <div key={section.id} className='course-section'>
                    <div
                      className='section-header'
                      onClick={() => toggleSection(section.id)}
                      role='button'
                      aria-expanded={openSectionId === section.id}>
                      <span className='section-header-title'>
                        {section.name || `Seção ${section.order}`}
                      </span>
                      <div className='section-header-meta'>
                        <span>{section.resources?.length || 0} aulas</span>
                        {openSectionId === section.id ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                    {openSectionId === section.id && (
                      <ul className='resource-list'>
                        {section.resources?.map((resource, index) => (
                          <li
                            key={`${resource.type}-${resource.content.id}-${index}`}
                            className='resource-item'>
                            <ResourceIcon type={resource.type} />
                            <span className='resource-name'>{resource.content.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='no-content'>Nenhum conteúdo disponível no momento.</p>
            )}
          </section>
        </div>

        {/* Right Column - CTA */}
        <aside className='cta-sidebar'>
          <div className='cta-card'>
            <h3 className='section-title'>Continuar onde parou</h3>
            <button className='btn btn-primary'>Continuar curso</button>
            <button className='btn btn-outline'>Reiniciar</button>
          </div>
        </aside>
      </div>

      {/* Mobile Navigation */}
      <div className='mobile-nav'>
        <Link to='/home' className='mobile-nav-item'>
          <FiArrowLeft size={22} />
          <span>Voltar</span>
        </Link>
        <button className='mobile-nav-item' onClick={() => scrollToSection('course-description')}>
          <FiBookOpen size={22} />
          <span>Sobre</span>
        </button>
        <button className='mobile-nav-item' onClick={() => scrollToSection('course-content')}>
          <FiDownload size={22} />
          <span>Conteúdo</span>
        </button>
      </div>
    </div>
  );
}
