import React from "react";

export default function CardProgresso({ titulo, progresso }) {
  return (
    <div className="card-continue">
      <div className="card-info">
        <div className="card-info-text">
          <span>{titulo}</span>
          <span style={{ fontSize: "0.7rem" }}>{progresso}%</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: `${progresso}%` }}></div>
        </div>
      </div>
    </div>
  );
}
