import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import ProfileCard from './ProfileCard';


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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="top-bar" style={{ position: 'relative'}}>
        <div className="left" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          height: '7vh',
          backgroundColor: 'white',
          padding: '1rem',
        }}>
          <div className="logo" style={{
            width: '10rem',
            fill: '#2c2c2c'
          }}>
            <Logo color="#2c2c2c" />
          </div>
          
       {searchable && (
            <input
              type="text"
              placeholder="Clique aqui para pesquisar"
              className="search-bar-top"
              style={{
                flex: 1,
                margin: '0 1rem',
                padding: '0.6rem 1rem',
                borderRadius: '20px',
                border: 'none',
                fontSize: '1rem',
                backgroundColor: '#ccc',
                maxWidth: '30vw'
              }}
            />
          )}
        </div>
        <div className="right" style={{ position: 'relative' }}>
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
        </div>
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
};

