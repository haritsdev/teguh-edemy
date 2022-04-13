import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../components/routes/InstructorRoute';
import HeroPage from '../../components/Hero/HeroPage';
import { Avatar, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get('/api/instructor-courses');
    setCourses(data);
  };

  const myStyle = { marginTop: '-15px', fontSize: '11px' };
  return (
    <InstructorRoute>
      <HeroPage title={'Instructor Dashboard'} />

      {courses &&
        courses.map((course) => (
          <div className="media pt-2" key={course._id}>
            <Avatar
              size={80}
              src={course.image ? course.image.Location : '/course.png'}
            />
            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <Link
                    href={`/instructor/course/view/${course.slug}`}
                    className="pointer"
                  >
                    <a className="h5 mt-2 text-primary">
                      <h5 className="pt-2"> {course.slug}</h5>
                    </a>
                  </Link>
                  <p className="mt-3">{course.lessons.length} Lessons</p>

                  {course.lessons.length < 5 ? (
                    <p style={myStyle} className="text-warning">
                      At Least 5 Lessons are required to publish this course
                    </p>
                  ) : course.published ? (
                    <p style={myStyle} className="text-success">
                      Your course is live in the market place
                    </p>
                  ) : (
                    <p style={myStyle} className="text-success">
                      Your course is ready to be published
                    </p>
                  )}
                </div>
                <div className="col-md-3 mt-3 text-center">
                  {course.published ? (
                    <Tooltip title="Published">
                      <CheckCircleOutlined className="h5 pointer text-success" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unpublished">
                      <CloseCircleOutlined className="h5 pointer text-warning" />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}
    </InstructorRoute>
  );
};

export default InstructorIndex;
