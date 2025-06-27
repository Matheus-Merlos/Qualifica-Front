import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function Home() {
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);
  const profileCardRef = useRef(null);
  const profilePictureRef = useRef(null);
  const overlayRef = useRef(null);

  const navigate = useNavigate();

  const toggleProfileCard = () => setProfileCardVisible((v) => !v);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(e.target) &&
        profilePictureRef.current &&
        !profilePictureRef.current.contains(e.target)
      ) {
        setProfileCardVisible(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* --- top-bar omitido para brevidade --- */}

      <main>
        {/* barra de pesquisa */}
        <input type="text" placeholder="Clique aqui para pesquisar" className="search-bar-main" />

        {/* seção “continue de onde parou” */}
        <section className="section">
          <h2>Continue de onde parou</h2>
          <div className="card-row">
            {/* card 1 → abre o curso */}
            <div className="card-continue" onClick={() => navigate('/curso')}>
              <div className="card-info">
                <div className="card-info-text">
                  <span>Computação</span>
                  <span style={{ fontSize: '0.7rem' }}>50%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ width: '50%' }} />
                </div>
              </div>
            </div>

            {/* cards 2 e 3 mantêm comportamento antigo */}
            <div className="card-continue">{/* ... */}</div>
            <div className="card-continue">{/* ... */}</div>
          </div>
        </section>

        {/* seção “Novidades para você” – intacta */}
        <section className="section">
          <h2>Novidades para você</h2>
          <div className="card-row">{/* ... */}</div>
        </section>
      </main>

      {/* overlay para o profile card */}
      <div
        className="overlay"
        style={{ display: isProfileCardVisible ? 'block' : 'none' }}
        ref={overlayRef}
      />
    </>
  );
}
