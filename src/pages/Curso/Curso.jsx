import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiDownload } from 'react-icons/fi';
import api from '../../api';
import './styles.css';

// Componente de imagem com fallback
const ImageWithFallback = ({ src, alt, fallbackSrc = 'https://via.placeholder.com/800x450?text=Sem+Imagem', ...props }) => {
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

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
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
    lastAccessed: new Date().toLocaleDateString('pt-BR')
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/course/${id}`);
        
        const courseData = response.data;
        
        // Processar os dados recebidos da API
        const processedData = {
          ...courseData,
          name: courseData.name || 'Curso sem nome',
          description: courseData.description || 'Nenhuma descrição disponível para este curso.',
          progress: courseData.progress || 0,
          imageUrl: courseData.imageUrl || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
          sections: courseData.sections || [],
          tags: courseData.tags || [],
          totalLessons: courseData.sections?.reduce((acc, section) => acc + (section.lessonCount || 0), 0) || 0,
          totalDuration: '4h 20min', // Pode ser calculado se houver dados de duração
          lastAccessed: new Date().toLocaleDateString('pt-BR')
        };
        
        setCourse(processedData);
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

  // Dados simulados para materiais de apoio
  const materials = [
    { id: 1, name: 'Guia rápido PDF', type: 'pdf' },
    { id: 2, name: 'Links recomendados', type: 'link' },
    { id: 3, name: 'Planilha de exercícios', type: 'sheet' }
  ];

  if (loading) {
    return (
      <div className="loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Carregando informações do curso...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error" style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        margin: '2rem auto',
        maxWidth: '600px'
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
            cursor: 'pointer'
          }}
        >
          Voltar para a página anterior
        </button>
      </div>
    );
  }

  return (
    <div className="course-detail">
      {/* Hero Section */}
      <div className="hero">
        <ImageWithFallback 
          src={course.imageUrl} 
          alt={course.name}
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-title">{course.name}</h1>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <div className="hero-meta">
            <span>{course.progress}% concluído</span>
            <span>{course.totalLessons} aulas</span>
            <span>{course.totalDuration}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Column - Course Content */}
        <div className="about">
          {/* Description Section */}
          <section className="section">
            <h2 className="section-title">Descrição</h2>
            {course.description ? (
              <p>{course.description}</p>
            ) : (
              <p className="no-content">Este curso ainda não possui uma descrição.</p>
            )}
            
            {/* Tags do Curso */}
            {course.tags?.length > 0 && (
              <div className="tags-container">
                {course.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Course Content Section */}
          <section className="section">
            <h2 className="section-title">Conteúdo do curso</h2>
            {course.sections?.length > 0 ? (
              course.sections.map((section) => (
                <div key={section.id} className="module">
                  <div className="module-title">
                    {section.title || `Seção ${section.id}`}
                  </div>
                  {section.lessonCount && (
                    <div className="module-meta">
                      {section.lessonCount} {section.lessonCount === 1 ? 'aula' : 'aulas'}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-content">Nenhum conteúdo disponível no momento.</p>
            )}
          </section>

          {/* Materials Section */}
          <section className="section">
            <h2 className="section-title">Materiais de apoio</h2>
            <ul className="material-list">
              {materials.map((material) => (
                <li key={material.id} className="material-item">
                  {material.type === 'pdf' && '📄'}
                  {material.type === 'link' && '🔗'}
                  {material.type === 'sheet' && '📊'}
                  {material.name}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column - CTA */}
        <aside className="cta-sidebar">
          <div className="cta-card">
            <h3 className="section-title">Continuar onde parou</h3>
            <button className="btn btn-primary">
              Continuar curso
            </button>
            <button className="btn btn-outline">
              Reiniciar
            </button>
            <p className="last-accessed">
              Último acesso em {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <Link to="/home" className="mobile-nav-item">
          <FiArrowLeft size={20} />
          <span>Voltar</span>
        </Link>
        <button className="mobile-nav-item">
          <FiBookOpen size={20} />
          <span>Conteúdo</span>
        </button>
        <button className="mobile-nav-item">
          <FiDownload size={20} />
          <span>Materiais</span>
        </button>
      </div>
    </div>
  );
}
