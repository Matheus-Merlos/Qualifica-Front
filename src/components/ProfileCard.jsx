import React, { forwardRef } from 'react';

const ProfileCard = forwardRef(({ isVisible, onClose }, ref) => {
  return (
    <div
      className="profile-card"
      ref={ref}
      style={{
        display: isVisible ? 'block' : 'none',
        position: 'absolute',
        right: '20px',
        top: '60px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '1rem',
        zIndex: 1001
      }}
    >
      <div className="profile-header">
        <img src="/google.png" alt="Foto de Perfil" className="profile-picture-large" />
        <h3>Yuri Alberto</h3>
      </div>
      <hr />
      <ul className="profile-options">
        <li>Meus Dados</li>
        <li>Meus Cursos</li>
        <li>Configurações</li>
        <li style={{ color: "red" }} onClick={onClose}>Sair</li>
      </ul>
    </div>
  );
});

export default ProfileCard;
