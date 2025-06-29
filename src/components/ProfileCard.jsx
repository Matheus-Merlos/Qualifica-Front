import React, { forwardRef } from 'react';
import { Card } from 'react-bootstrap';

const ProfileCard = forwardRef(({ isVisible, onClose }, ref) => {
  return (
    <Card
      ref={ref}
      style={{
        display: isVisible ? 'block' : 'none',
        position: 'absolute',
        right: '20px',
        top: '60px',
        zIndex: 1001
      }}
    >
      <Card.Body>
        <div className="profile-header d-flex align-items-center">
          <img src="/google.png" alt="Foto de Perfil" className="profile-picture-large" />
          <h3>Yuri Alberto</h3>
        </div>
        <hr />
        <ul className="list-unstyled">
          <li onClick={onClose}>Meus Dados</li>
          <li onClick={onClose}>Meus Cursos</li>
          <li onClick={onClose}>Configurações</li>
          <li style={{ color: "red" }} onClick={onClose}>Sair</li>
        </ul>
      </Card.Body>
    </Card>
  );
});

export default ProfileCard;
