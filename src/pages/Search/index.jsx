import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import api from '../../utils/api';
import './style.module.css';

export default function Search() {
  const [courses, setCourses] = useState([]);
  const [params] = useSearchParams();

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
  }, []);

  return (
    <div className='search-container'>
      <SearchBar />

      <div className='course-grid'>
        {courses.map((course) => (
          <div key={course.id} className='course-card'>
            <img src={course.imageUrl} alt={course.name} className='course-image' />
            <div className='course-info'>
              <h3 className='course-title'>{course.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
