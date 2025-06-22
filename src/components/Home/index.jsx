import React from "react";
import Header from "../Header.jsx";
import CardProgresso from "./CardProgresso.jsx";
import CardNovidade from "./CardNovidade.jsx";
import "./styles.css";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <input type="text" placeholder="Clique aqui para pesquisar" className="search-bar-main" />

        <section className="section">
          <h2>Continue de onde parou</h2>
          <div className="card-row">
            <CardProgresso titulo="Computação" progresso={50} />
            <CardProgresso titulo="Finanças" progresso={50} />
            <CardProgresso titulo="Excel" progresso={50} />
          </div>
        </section>

        <section className="section">
          <h2>Novidades para você</h2>
          <div className="card-row">
            <CardNovidade titulo="Word" progresso={50} />
          </div>
        </section>
      </main>
    </>
  );
}
