import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import { Avatar, Tooltip, Button, Modal, List } from 'antd';
import { EditOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/Forms/AddFormLessons';
import { toast } from 'react-toastify';
import Item from 'antd/lib/list/Item';

const CourseView = () => {
  const [course, setCourse] = useState({});
  //for Lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const slug = router.query.slug;

  useEffect(() => {
    loadCourse();
  }, [slug, progress, uploading]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
    console.log(data);
  };

  // * FUNCTION FOR ADD LESSONS
  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: '', content: '', video: {} });
      setVisible(false);
      setUploadButtonText('Upload video');
      setCourse(data);
      toast.success('Lesson success to added');
    } catch (error) {
      console.log(error);
      toast.error(`CANNOT SAVE DATA ${JSON.stringify(error.message)}`);
    }
  };

  //* FUNCTION FOR HANDLING VIDEO AND
  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);
      const videoData = new FormData();
      videoData.append('video', file);
      // * save progress bar and send fvideo as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      setProgress(100);

      //once response is received

      setValues({ ...values, video: data });
      toast.success('Video was uploaded');
      setTimeout(() => setProgress(100), 400);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      toast.error(
        `Error when uploading video ${JSON.stringify(error.message)}`
      );
    }
  };

  //* FUNCTION FOR REMOVE VIDEO
  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/remove-video/${course.instructor._id}`,
        values.video
      );

      setValues({ ...values, video: {} });
      setUploading(false);
      setProgress(0);
      toast.success('Video was removed');
      setUploadButtonText('Upload another video');
    } catch (error) {
      setUploading(false);
      toast.error('Remove video failed');
    }
  };

  return (
    <InstructorRoute>
      <div className="card shadow mb-5">
        <div className="card-body">
          <div className="container-fluid pt-3">
            {/* <pre> {JSON.stringify(course, null, 6)} </pre> */}

            {course && (
              <div className="container-fluid pt-1">
                <Avatar
                  size={80}
                  src={course.image ? course.image.Location : ''}
                />
                <div className="media-body pl-2">
                  <div className="row">
                    <div className="col">
                      <h5 className="mt-2 text-primary">
                        <div>{course.name}</div>
                      </h5>
                      <p>{course.lessons && course.lessons.length} Lessons</p>
                      <p>{course.category}</p>
                    </div>

                    <div className="d-flex">
                      <Tooltip title="Edit">
                        <EditOutlined
                          onClick={() =>
                            router.push(`/instructor/course/edit/${slug}`)
                          }
                          className="h5 pointer text-warning mr-4"
                        ></EditOutlined>
                      </Tooltip>
                      <Tooltip title="publish">
                        <CheckOutlined className="h5 pointer text-success mr-4"></CheckOutlined>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <ReactMarkdown source={course.description} />
                  </div>
                </div>

                <div className="row  my-3 d-flex justify-content-center">
                  <div className="col col-xs-12 col-md-9 col-xl-6  mb-3">
                    <Button
                      style={{ width: '100%' }}
                      className="bg-primary  d-flex justify-content-center py-3 align-items-center"
                      onClick={() => setVisible(true)}
                      size="large"
                      icon={
                        <UploadOutlined
                          style={{
                            fontSize: '1.6em',
                            fontWeight: 'bold',
                            color: 'white',
                          }}
                        />
                      }
                    >
                      <span style={{ fontSize: '1.1em', color: 'white' }}>
                        Add Lesson
                      </span>
                    </Button>
                  </div>
                  <Modal
                    title="+Add Lesson"
                    centered
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                  >
                    <AddLessonForm
                      uploading={uploading}
                      values={values}
                      setValues={setValues}
                      handleAddLesson={handleAddLesson}
                      uploadButtonText={uploadButtonText}
                      handleVideo={handleVideo}
                      progress={progress}
                      handleVideoRemove={handleVideoRemove}
                    />
                  </Modal>
                </div>

                <div className="row pb-5">
                  <div className="col lesson-list">
                    <h4>
                      {course && course.lessons && course.lessons.length}{' '}
                      Lessons
                    </h4>
                    <div>
                      {/* <pre> {JSON.stringify(course.lessons, null, 4)}</pre> */}

                      <List
                        itemLayout="horizontal"
                        dataSource={course && course.lessons}
                        renderItem={(item, index) => (
                          <Item>
                            <Item.Meta
                              avatar={<Avatar>{index + 1}</Avatar>}
                              title={item.title}
                            />
                          </Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
