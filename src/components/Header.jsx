import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import ProfileCard from './ProfileCard';
import { Container, Row, Col, Form, Image } from 'react-bootstrap';

export default function Header({ searchable = true }) {
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);
  const profilePictureRef = useRef(null);
  const profileCardRef = useRef(null);

  const toggleProfileCard = () => {
    setProfileCardVisible(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target) &&
        profilePictureRef.current &&
        !profilePictureRef.current.contains(event.target)
      ) {
        setProfileCardVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="top-bar" style={{ position: 'relative' }}>
        <Container className="left">
          <div className="logo">
            <Logo color="#2c2c2c" />
          </div>

          {searchable && (
              <Container className="text-center d-flex justify-content-start align-items-start flex-column w-100 m-0 p-0">
                <Form.Control
                  type="text"
                  placeholder="Clique aqui para pesquisar"
                  className="rounded-pill"
                  style={{ backgroundColor: '#e9ecef', maxWidth: '25rem', margin: '0 10px' }}
                />
              </Container>
            )}
        </Container>

        <Container className="right">
          <ProfileCard
            isVisible={isProfileCardVisible}
            onClose={() => setProfileCardVisible(false)}
            ref={profileCardRef}
          />
          <img
            src="/google.png"
            alt="Foto de Perfil"
            className="profile-picture"
            ref={profilePictureRef}
            onClick={toggleProfileCard}
            style={{ cursor: 'pointer', zIndex: 1002 }}
          />
        </Container>
      </header>

      {isProfileCardVisible && (
        <div
          className="overlay"
          onClick={() => setProfileCardVisible(false)}
          style={{
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
    </>
  );
}
