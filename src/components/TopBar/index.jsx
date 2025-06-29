import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import Logo from '../Logo';
import { nameAtom } from '../../store/persistentAtoms';

export default function TopBar() {
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);
  const profileCardRef = useRef(null);
  const profilePictureRef = useRef(null);
  const overlayRef = useRef(null);

  const [name] = useAtom(nameAtom);

  function toggleProfileCard() {
    setProfileCardVisible(!isProfileCardVisible);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target) &&
        profilePictureRef.current &&
        !profilePictureRef.current.contains(event.target)
      ) {
        setProfileCardVisible(false);
      }
    }

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <>
      <div
        className="overlay"
        id="overlay"
        style={{ display: isProfileCardVisible ? 'block' : 'none' }}
        ref={overlayRef}
      />
      <header className="top-bar">
        <div className="left">
          <Logo />
        </div>

        <div className="right">
          <div
            className="profile-card"
            id="profileCard"
            style={{ display: isProfileCardVisible ? 'block' : 'none' }}
            ref={profileCardRef}
          >
            <div className="profile-header">
              <img src="/google.png" alt="Foto de Perfil" className="profile-picture-large" />
              <h3>{name}</h3>
            </div>
            <hr />
            <ul className="profile-options">
              <li>Meus Dados</li>
              <li>Meus Cursos</li>
              <li>Configurações</li>
              <li style={{ color: 'red' }}>Sair</li>
            </ul>
          </div>

          <img
            src="/google.png"
            alt="Foto de Perfil"
            className="profile-picture"
            ref={profilePictureRef}
            onClick={toggleProfileCard}
          />
        </div>
      </header>
    </>
  );
}
