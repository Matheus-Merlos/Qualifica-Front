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
    setSearchParams(q);
  }, []);

  return (
    <div className='search-container'>
      <SearchBar />

      <div className='courses'>
        {courses.length > 0 &&
          courses.map((course) => (
            <Link key={course.id} to={`/course/${course.id}`}>
              <div className='course-card'>
                <img src={course.imageUrl} alt={course.name} className='course-image' />
                <div className='course-info'>
                  <h3 className='course-title'>{course.name}</h3>
                </div>
              </div>
            </Link>
          ))}
      </div>
      {courses.length === 0 && <h1>Nenhum curso encontrado!</h1>}
    </div>
  );
}
