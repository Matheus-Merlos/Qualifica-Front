import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { bioAtom, emailAtom, nameAtom, tokenAtom, userIdAtom } from '../../store/persistentAtoms';
import './styles.css';

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerBirthdate, setRegisterBirthdate] = useState('');
  const [registerBio, setRegisterBio] = useState('');

  const [, setUserId] = useAtom(userIdAtom);
  const [, setToken] = useAtom(tokenAtom);
  const [, setEmail] = useAtom(emailAtom);
  const [, setName] = useAtom(nameAtom);
  const [, setBio] = useAtom(bioAtom);

  const handleChangeForm = (showLogin) => setIsLogin(showLogin);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/user/login', {
        email: loginEmail,
        password: loginPassword,
      });
      const { id, name, email, token, bio } = data;

      setUserId(id);
      setName(name);
      setEmail(email);
      setToken(token);
      setBio(bio);

      navigate('/pages/Home/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Falha no login. Verifique suas credenciais.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      //TODO toast
      alert('As senhas não coincidem');
      return;
    }
    try {
      await api.post('/user/register', {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        birthdate: registerBirthdate,
        bio: registerBio,
      });
      alert('Cadastro realizado com sucesso! Faça login.');
      setIsLogin(true);
    } catch (error) {
      console.error('Register failed:', error);
      alert('Falha no cadastro. Tente novamente.');
    }
  };

  return (
    <div className='container'>
      <img src='/fundo.jpg' alt='Computação' className='background-image' />

      <div className='form-box'>
        {/* abas */}
        <div className='tab-buttons'>
          <button
            type='button'
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => handleChangeForm(true)}>
            Login
          </button>
          <button
            type='button'
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => handleChangeForm(false)}>
            Cadastro
          </button>
        </div>

        {/* formulário de login */}
        {isLogin ? (
          <form id='login-form' className='form active' onSubmit={handleLoginSubmit}>
            <label htmlFor='login-email'>Seu e-mail</label>
            <input
              type='email'
              id='login-email'
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <label htmlFor='login-password'>Sua senha</label>
            <input
              type='password'
              id='login-password'
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <button type='submit'>Entrar</button>
          </form>
        ) : (
          /* formulário de cadastro */
          <form id='cadastro-form' className='form active' onSubmit={handleRegisterSubmit}>
            <label htmlFor='cadastro-name'>Nome</label>
            <input
              type='text'
              id='cadastro-name'
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />

            <label htmlFor='cadastro-email'>Seu e-mail</label>
            <input
              type='email'
              id='cadastro-email'
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />

            <label htmlFor='cadastro-password'>Sua senha</label>
            <input
              type='password'
              id='cadastro-password'
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />

            <label htmlFor='cadastro-confirm-password'>Confirmar senha</label>
            <input
              type='password'
              id='cadastro-confirm-password'
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
            />

            <label htmlFor='cadastro-bio'>Biografia</label>
            <textarea
              id='cadastro-bio'
              value={registerBio}
              onChange={(e) => setRegisterBio(e.target.value)}
              required
            />

            <label htmlFor='cadastro-birthdate'>Data de nascimento</label>
            <input
              type='date'
              id='cadastro-birthdate'
              value={registerBirthdate}
              onChange={(e) => setRegisterBirthdate(e.target.value)}
              required
            />

            <button type='submit'>Cadastrar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
