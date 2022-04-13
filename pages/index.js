import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroMainPage from '../components/Hero/HeroMainPage';
import CourseCard from '../components/molecules/CourseCards';
import { Row, Col, Divider } from 'antd';

const Index = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await axios.get('/api/courses/');
      setCourses(data);
    };

    fetchCourses();
  }, []);

  const style = { background: '#0092ff', padding: '8px 0' };

  return (
    <>
      <HeroMainPage />
      <div className="container-fluid mt-4 my-3">
        <div className="row flex-row-ris">
          {courses.map((course) => (
            <div
              key={course._id}
              className="flexris col-xl-2 "
              style={{ width: '20%' }}
            >
              {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
