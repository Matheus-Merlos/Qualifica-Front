import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

// Componente para renderizar o conteúdo principal (vídeo, prova ou material)
export default function ResourceViewer({ resource, onProgress = console.log, startTime = 0 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleMetadataLoaded = () => {
      if (startTime > 0 && startTime < videoElement.duration) {
        console.log(`Pulando o vídeo para ${startTime} segundos.`);
        videoElement.currentTime = startTime;
      }
    };

    const handleTimeUpdate = () => {
      if (onProgress) {
        onProgress({ playedSeconds: videoElement.currentTime });
      }
    };

    videoElement.addEventListener('loadedmetadata', handleMetadataLoaded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleMetadataLoaded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [resource, onProgress, startTime]);

  if (!resource || resource.type !== 'lesson') {
    return (
      <div className='resource-placeholder'>
        <h2>Selecione uma aula na barra lateral.</h2>
      </div>
    );
  }

  const videoUrl = resource.data?.url;
  if (!videoUrl) {
    return <div className='resource-placeholder'>URL da aula não encontrada.</div>;
  }

  return (
    <div className='resource-content'>
      <div className='video-player-wrapper-final'>
        <video
          ref={videoRef}
          key={videoUrl}
          controls
          playsInline
          style={{ width: '100%', height: 'auto' }}>
          <source src={videoUrl} type='video/mp4' />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>
      <h3>{resource.data.name}</h3>
      <p>{resource.data.description}</p>
    </div>
  );
}

ResourceViewer.propTypes = {
  resource: PropTypes.shape({
    type: PropTypes.string.isRequired,
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  }).isRequired,
  onProgress: PropTypes.func,
  startTime: PropTypes.number,
};
