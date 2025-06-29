import React from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Logo from "../Logo";

export default function Login() {
  function showForm(type) {
    const forms = {
      login: document.getElementById('login-form'),
      cadastro: document.getElementById('cadastro-form')
    };
    const tabs = document.querySelectorAll(`.tab`);

    Object.keys(forms).forEach(key => {
      forms[key].classList.toggle("active", key === type);
      tabs[key === 'login' ? 0 : 1].classList.toggle("active", key === type);
    });
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="form-box bg-light p-4 rounded shadow">
        <Logo color='#2c2c2c' />
        <div className="tab-buttons mb-3">
          <Button className="tab active" onClick={() => showForm('login')}>Login</Button>
          <Button className="tab" onClick={() => showForm('cadastro')}>Cadastro</Button>
        </div>

        <Form id="login-form" className={`form active`}>
          <Form.Group controlId="login-email">
            <Form.Label>Seu e-mail</Form.Label>
            <Form.Control type="email" required />
          </Form.Group>

          <Form.Group controlId="login-password">
            <Form.Label>Sua senha</Form.Label>
            <Form.Control type="password" required />
          </Form.Group>

          <Form.Group controlId="remember-me" className="mb-3">
            <Form.Check type="checkbox" label="Lembrar meu login" />
          </Form.Group>

          <Button type="submit" className="w-100">Entrar</Button>
        </Form>

        <Form id="cadastro-form" className={`form`}>
          <Form.Group controlId="cadastro-email">
            <Form.Label>Seu e-mail</Form.Label>
            <Form.Control type="email" required />
          </Form.Group>

          <Form.Group controlId="cadastro-password">
            <Form.Label>Sua senha</Form.Label>
            <Form.Control type="password" required />
          </Form.Group>

          <Form.Group controlId="cadastro-confirm-password">
            <Form.Label>Confirmar senha</Form.Label>
            <Form.Control type="password" required />
          </Form.Group>

          <Button type="submit" className="w-100">Cadastrar</Button>
        </Form>
      </div>
    </Container>
  );
}
