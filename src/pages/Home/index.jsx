import React from 'react';
import TopBar from '../../components/TopBar';
import './styles.css';

export default function Home() {
  return (
    <>
      <TopBar />
      <main>
        <input type="text" placeholder="Clique aqui para pesquisar" className="search-bar-main" />
        <section className="section">
          <h2>Continue de onde parou</h2>
          <div className="card-row">
            <div className="card-continue">
              <div className="card-info">
                <div className="card-info-text">
                  <span>Computação</span>
                  <span style={{ fontSize: '0.7rem' }}>50%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>

            <div className="card-continue">
              <div className="card-info">
                <div className="card-info-text">
                  <span>Finanças</span>
                  <span style={{ fontSize: '0.7rem' }}>50%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>

            <div className="card-continue">
              <div className="card-info">
                <div className="card-info-text">
                  <span>Excel</span>
                  <span style={{ fontSize: '0.7rem' }}>50%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Novidades para você</h2>
          <div className="card-row">
            <div className="card-novidade">
              <div className="card-info">
                <div className="card-info-text">
                  <span>Word</span>
                  <span style={{ fontSize: '0.7rem' }}>50%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
