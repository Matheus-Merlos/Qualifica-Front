import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import './styles.css'; // Certifique-se de que o CSS seja importado

// --- SUBCOMPONENTE PARA RENDERIZAR A PROVA E SEUS RESULTADOS ---
const ExamComponent = ({ examData, onExamSubmit }) => {
  // Estado para as respostas que o usuário está selecionando
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Estado para armazenar o gabarito final recebido da API
  const [examResult, setExamResult] = useState(null);

  const handleAnswerChange = (questionId, alternativeId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: alternativeId,
    }));
  };

  const handleSubmit = async () => {
    const totalQuestions = examData.questions.length;
    const totalAnswers = Object.keys(answers).length;

    if (totalAnswers < totalQuestions) {
      if (
        !window.confirm(
          `Você respondeu ${totalAnswers} de ${totalQuestions} perguntas. Deseja finalizar mesmo assim?`
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await onExamSubmit(answers);
      setExamResult(result); // Armazena o gabarito para renderizar a tela de resultados
    } catch (error) {
      alert('Houve um erro ao enviar sua prova. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERIZAÇÃO DA TELA DE RESULTADOS ---
  if (examResult) {
    return (
      <div className='exam-container'>
        <h2>Resultado: {examResult.name}</h2>
        <Alert variant='info' className='text-center'>
          <h4 className='alert-heading'>Nota Final</h4>
          <p className='display-4 fw-bold'>{examResult.finalScore}</p>
        </Alert>

        {examData.questions.map((originalQuestion, index) => {
          // Encontra os dados de resultado para esta questão
          const resultInfo = examResult.questionsWithAnswers.find(
            (r) => r.questionId === originalQuestion.questionId
          );
          // Encontra a resposta que o usuário deu
          const userAnswerId = answers[originalQuestion.questionId];

          return (
            <Card key={originalQuestion.questionId} className='mb-4'>
              <Card.Header
                as='h6'
                className={resultInfo.answeredCorrectly ? 'bg-success-soft' : 'bg-danger-soft'}>
                Questão {index + 1}: {originalQuestion.question}
              </Card.Header>
              <Card.Body>
                {originalQuestion.alternatives.map((alt) => {
                  const isCorrectAnswer = resultInfo.answeredCorrectly;
                  const isUserChoice = alt.id === userAnswerId;

                  let customClass = '';
                  let feedbackText = '';

                  // Cenário 1: Esta é a resposta correta E foi a escolha do usuário
                  if (isCorrectAnswer && isUserChoice) {
                    customClass = 'correct-answer';
                    feedbackText = ' (Sua Resposta Correta)';
                  } else if (!isCorrectAnswer && isUserChoice) {
                    customClass = 'incorrect-answer';
                    feedbackText = ' (Sua Resposta)';
                  }

                  return (
                    <div
                      key={alt.id}
                      className={`p-2 rounded mb-2 exam-alternative ${customClass}`}>
                      {alt.description}
                      <span className='fw-bold'>{feedbackText}</span>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    );
  }

  // --- RENDERIZAÇÃO DO FORMULÁRIO DA PROVA ---
  return (
    <div className='exam-container'>
      <h2>{examData.name}</h2>
      <p className='text-muted'>
        Responda as questões abaixo e clique em "Finalizar Prova" quando terminar.
      </p>
      <hr />
      {examData.questions.map((q, index) => (
        <Card key={q.questionId} className='mb-4'>
          <Card.Header as='h6'>
            Questão {index + 1}: {q.question}
          </Card.Header>
          <Card.Body>
            <Form>
              {q.alternatives.map((alt) => (
                <Form.Check
                  key={alt.id}
                  type='radio'
                  id={`q${q.questionId}-alt${alt.id}`}
                  name={`question-${q.questionId}`}
                  label={alt.description}
                  onChange={() => handleAnswerChange(q.questionId, alt.id)}
                  className='mb-2'
                />
              ))}
            </Form>
          </Card.Body>
        </Card>
      ))}
      <div className='d-grid'>
        <Button onClick={handleSubmit} disabled={isSubmitting} size='lg'>
          {isSubmitting ? <Spinner as='span' size='sm' /> : 'Finalizar Prova'}
        </Button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ResourceViewer (SEM MUDANÇAS) ---
export default function ResourceViewer({ resource, onProgress, startTime, onExamSubmit }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (resource?.type !== 'lesson' || !videoRef.current) return;
    const videoElement = videoRef.current;

    const handleMetadataLoaded = () => {
      if (startTime > 0 && startTime < videoElement.duration) {
        videoElement.currentTime = startTime;
      }
    };
    const handleTimeUpdate = () => onProgress?.({ playedSeconds: videoElement.currentTime });

    videoElement.addEventListener('loadedmetadata', handleMetadataLoaded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleMetadataLoaded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [resource, onProgress, startTime]);

  if (!resource) {
    return (
      <div className='resource-placeholder'>
        <h2>Selecione um item na barra lateral.</h2>
      </div>
    );
  }

  switch (resource.type) {
    case 'lesson':
      return (
        <div className='resource-content'>
          <div className='video-player-wrapper-final'>
            <video
              ref={videoRef}
              key={resource.data.url}
              controls
              playsInline
              style={{ width: '100%', height: 'auto' }}>
              <source src={resource.data.url} type='video/mp4' />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
          <h3>{resource.data.name}</h3>
          <p>{resource.data.description}</p>
        </div>
      );
    case 'exam':
      return <ExamComponent examData={resource.data} onExamSubmit={onExamSubmit} />;
    case 'material':
      return (
        <div className='resource-placeholder'>
          <h2>Material de Apoio: {resource.data[0].name}</h2>
          <p>{resource.data[0].description}</p>
          <Button href={resource.data[0].url} target='_blank' rel='noopener noreferrer'>
            Acessar Material
          </Button>
        </div>
      );
    default:
      return (
        <div className='resource-placeholder'>
          <h2>Tipo de recurso não suportado.</h2>
        </div>
      );
  }
}

ResourceViewer.propTypes = {
  resource: PropTypes.shape({
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  }),
  onProgress: PropTypes.func,
  startTime: PropTypes.number,
  onExamSubmit: PropTypes.func,
};
