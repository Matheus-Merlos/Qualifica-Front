import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './styles.css';
import { useAtom } from 'jotai';
import { nameAtom, userIdAtom } from '../../store/persistentAtoms';

export default function Home() {
  /* ­---------------- profile pop-up ---------------- */
  const [visible, setVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [continueCourses, setContinueCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [error, setError] = useState(null);
  const cardRef = useRef(null);
  const pictureRef = useRef(null);
  const searchRef = useRef(null);
  const searchOverlayRef = useRef(null);

  const [name] = useAtom(nameAtom);
  const [userId] = useAtom(userIdAtom);

  const toggleCard = () => setVisible((v) => !v);

  useEffect(() => {
    const close = (e) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target) &&
        pictureRef.current &&
        !pictureRef.current.contains(e.target)
      ) {
        setVisible(false);
      }
    };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const searchResponse = await api.get('/course');
        const subscribedResponse = await api.get(`/subscription/${userId}`);
        const allCourses = searchResponse.data;
        const subscribedCourses = subscribedResponse.data;

        setCourses(allCourses);
        setContinueCourses(subscribedCourses);
        setNewCourses(allCourses);
        setError('');
      } catch {
        setError('Erro ao carregar cursos');
      }
    }
    fetchCourses();
  }, [userId]);

  const handleSearch = async (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    try {
      if (query) {
        const response = await api.get(`/course`, {
          params: {
            q: query,
            limit: 25,
          },
        });
        setCourses(response.data);
      } else {
        // Se a busca estiver vazia, recarrega a lista completa
        fetchCourses();
      }
      setError('');
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError('Erro ao pesquisar cursos. Tente novamente.');
    }
  };

  /* ­---------------- UI ---------------- */
  const handleClickOutside = useCallback(
    (event) => {
      // Se o overlay de busca está aberto
      if (isSearching) {
        // Se clicou fora do overlay E fora do campo de busca
        if (
          searchOverlayRef.current &&
          !searchOverlayRef.current.contains(event.target) &&
          searchRef.current &&
          !searchRef.current.contains(event.target)
        ) {
          setIsSearching(false);
          setSearchQuery('');
        }
      }
    },
    [isSearching]
  );

  // Adiciona evento de tecla ESC
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' && isSearching) {
        setIsSearching(false);
        setSearchQuery('');
      }
    },
    [isSearching]
  );

  useEffect(() => {
    // Adiciona listeners quando o componente monta
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Remove listeners quando o componente desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  // Focar no input quando a busca for ativada
  useEffect(() => {
    if (isSearching && searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) input.focus();
    }
  }, [isSearching]);

  /* ­---------------- course navigation ---------------- */
  const navigate = useNavigate();

  const openCourse = (courseId) => {
    console.log('Navegando para o curso ID:', courseId);
    navigate(`/course/${courseId}`);
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <>
      <div className='course-search'>
        {error && (
          <div
            className='error-message'
            style={{
              background: '#f8d7da',
              color: '#dc3545',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center',
            }}>
            {error}
          </div>
        )}
        <header className='top-bar'>
          <div className='left'>
            <h1 className='logo-text'>
              Qualifica<span>+</span>
            </h1>
            <div className='search-wrap' ref={searchRef}>
              <div className='search-box'>
                <input
                  type='text'
                  placeholder={
                    isSearching ? 'Digite para pesquisar cursos...' : 'Clique aqui para pesquisar'
                  }
                  className='search-bar-top'
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearching(true)}
                />
              </div>
            </div>
          </div>
          <div className='right'>
            <div
              className='profile-card'
              ref={cardRef}
              style={{ display: visible ? 'block' : 'none' }}>
              <div className='profile-header'>
                <img src='/google.png' alt='Perfil' className='profile-picture-large' />
                <h3>{name}</h3>
              </div>
              <hr />
              <ul className='profile-options'>
                <li>Meus Dados</li>
                <li>Meus Cursos</li>
                <li>Configurações</li>
                <li className='logout'>Sair</li>
              </ul>
            </div>
            <img
              src='/google.png'
              alt='Perfil'
              className='profile-picture'
              ref={pictureRef}
              onClick={toggleCard}
            />
          </div>
        </header>
        <main className={`home-container ${isSearching ? 'search-active' : ''}`}>
          {isSearching && (
            <div className='search-overlay' ref={searchOverlayRef}>
              <div className='search-results'>
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className='result-item'
                    onClick={() => openCourse(course.id)}>
                    <img src={course.image || '/placeholder-course.png'} alt={course.name} />
                    <div className='result-info'>
                      <span className='title'>{course.name}</span>
                      <span className='level'>
                        {course.progress ? `${course.progress}% concluído` : 'Novo'}
                      </span>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && <div className='no-results'>Nenhum curso encontrado</div>}
              </div>
            </div>
          )}
          <section>
            <h2>Continue de onde parou</h2>
            <div className='card-row'>
              {continueCourses.map((course) => (
                <div key={course.id} className='course-card' onClick={() => openCourse(course.id)}>
                  <img src={course.image || '/placeholder-course.png'} alt={course.name} />
                  <div className='overlay'>
                    <span>{course.name}</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <div className='progress'>
                    <div style={{ width: `${course.progress || 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2>Novidades para você</h2>
            <div className='card-row'>
              {newCourses.map((course) => (
                <div key={course.id} className='course-card' onClick={() => openCourse(course.id)}>
                  <img src={course.imageUrl || '/placeholder-course.png'} alt={course.name} />
                  <div className='overlay'>
                    <span>{course.name}</span>
                    <span>Novo</span>
                  </div>
                  <div className='progress'>
                    <div style={{ width: '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      {visible && <div className='overlay-backdrop' />}
    </>
  );
}
