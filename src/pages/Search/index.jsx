/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import api from '../../utils/api';
import './styles.css';
import { useAtom } from 'jotai';
import { searchParamAtom } from '../../store/atom';

export default function Search() {
  const [courses, setCourses] = useState([]);
  const [params] = useSearchParams();

  const [searchParams, setSearchParams] = useAtom(searchParamAtom);

  const q = params.get('q') || '';

  useEffect(() => {
    async function fetchSearch() {
      try {
        const request = await api.get(`/course?q=${q}`);
        setCourses(request.data);
      } catch (error) {
        console.error(`Erro ao fazer requisição: ${error.reponse.data}`);
      }
    }

    fetchSearch();
  }, [q]);

  useEffect(() => {
    setSearchParams(q.replaceAll('+', ' '));
  }, []);

  return (
    <div className='search-container'>
      <SearchBar />

      <h1 className='search-title'>Resultados da pesquisa por "{searchParams}"</h1>

      <div className='search-course-result-list'>
        {courses.length > 0 &&
          courses.map((course) => (
            <Link key={course.id} to={`/course/${course.id}`} className='search-course-result-link'>
              <div className='course-card'>
                <img src={course.imageUrl} alt={course.name} className='course-image' />
                <div className='course-info'>
                  <h3 className='course-title'>{course.name}</h3>
                  <p>
                    {course.description
                      ? course.description.length > 400
                        ? course.description.slice(0, 400) + '...'
                        : course.description
                      : 'Curso sem descrição'}
                  </p>
                  <div className='search-result-course-card-tags'>
                    {course.tags.map((tag, index) => (
                      <span key={index} className='search-result-course-card-tag'>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
      {courses.length === 0 && <h1>Nenhum curso encontrado!</h1>}
    </div>
  );
}
