import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { searchParamAtom } from '../../store/atom';
import { nameAtom } from '../../store/persistentAtoms';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { FiUser } from 'react-icons/fi';

export default function SearchBar() {
  const [searchParam, setSearchParam] = useAtom(searchParamAtom);

  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);
  const pictureRef = useRef(null);
  const searchRef = useRef(null);

  const [name] = useAtom(nameAtom);

  const navigate = useNavigate();

  function toggleCard() {
    setVisible((v) => !v);
  }

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

  function handleSearch(event) {
    if (event.key !== 'Enter') {
      return;
    }

    navigate(`/search?q=${searchParam.replaceAll(' ', '+')}`);
  }

  return (
    <>
      <header className='top-bar'>
        <div className='left'>
          <Link to={'/'} className='search-bar-link'>
            <h1 className='logo-text'>
              Qualifica<span>+</span>
            </h1>
          </Link>
          <div className='search-wrap' ref={searchRef}>
            <div className='search-box'>
              <input
                type='text'
                placeholder={'Pesquisar um curso...'}
                className='search-bar-top'
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                onKeyDown={(e) => handleSearch(e)}
              />
            </div>
          </div>
        </div>
        <div className='search-bar-right'>
          <div
            className='profile-card'
            ref={cardRef}
            style={{ display: visible ? 'block' : 'none' }}>
            <div className='profile-header'>
              <FiUser size={45} className='profile-picture-large' />
              <h3>{name}</h3>
            </div>
            <hr />
            <ul className='profile-options'>
              <li>
                <Link to='/profile'>Meus Dados</Link>
              </li>
              <li className='logout'>Sair</li>
            </ul>
          </div>

          <FiUser size={45} className='profile-picture' ref={pictureRef} onClick={toggleCard} />
        </div>
      </header>
    </>
  );
}
