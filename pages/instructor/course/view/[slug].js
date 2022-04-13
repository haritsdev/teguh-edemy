import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import { Avatar, Tooltip, Button, Modal, List, Badge } from 'antd';
import {
  CheckOutlined,
  UploadOutlined,
  EditFilled,
  QuestionOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/Forms/AddFormLessons';
import { toast } from 'react-toastify';
import Item from 'antd/lib/list/Item';
import Link from 'next/link';

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

  const { confirm } = Modal;

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

  const handlePublish = async (e, courseId) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);

      toast.success(
        'Selamat anda berhasil mempublikasikan kursus anda di market place udemy, '
      );
    } catch (error) {
      console.log(error);
      toast.error(`Maaf terjadi galat coba beberapa saat lagi${error}`);
    }
  };
  const handleUnPublish = async (e, courseId) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);

      toast.success('Selamat anda berhasil mengunpublish kursus anda');
    } catch (error) {
      console.log(error);
      toast.error(`Maaf terjadi galat coba beberapa saat lagi${error}`);
    }
  };

  function showConfirm(e, courseId, isPublished) {
    isPublished === true
      ? confirm({
          title: `Sudah yakin tidak ingin mempublikasikan kursus anda?`,
          icon: <ExclamationCircleOutlined />,
          content: `Ketika anda tidak ingin mempublikasikan kursus anda mempublikasikan maka user akan bisa melihat course anda ${courseId}`,
          onOk() {
            console.log('OK');
            return handleUnPublish(e, courseId);
          },
          onCancel() {
            console.log('Cancel');
          },
        })
      : confirm({
          title: `Sudah yakin ingin mempublikasikan kursus anda?`,
          icon: <ExclamationCircleOutlined />,
          content: `Ketika anda mempublikasikan maka user akan bisa melihat course anda ${courseId}`,
          onOk() {
            console.log('OK');
            return handlePublish(e, courseId);
          },
          onCancel() {
            console.log('Cancel');
          },
        });
  }

  return (
    <InstructorRoute>
      {/* <pre> {JSON.stringify(course, null, 6)} </pre> */}

      {course && (
        <>
          <div className="card shadow mb-5">
            <div className="card-body">
              <div className="container-fluid pt-3">
                <div className="container-fluid pt-1">
                  <div className="media-body row col-md-12 d-flex  p-0 justify-content-around mb-3">
                    <div className="col-md-6 text-left">
                      <Avatar
                        shape="square"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '1em',
                        }}
                        src={course.image ? course.image.Location : ''}
                      />
                    </div>

                    <div className="col-md-6 col-sm-12">
                      <div className="row p-0 justify-content-around">
                        <div className="col-md-9">
                          <h5 className="mt-2 text-primary">
                            <Link href={`/instructor/course/edit/${slug}`}>
                              <a>
                                <div>{course.name}</div>
                              </a>
                            </Link>
                          </h5>

                          <p>
                            {course.lessons && course.lessons.length} Lessons
                          </p>
                          <div className="row justify-content-around col-md-6 col-sm-12">
                            <div className="col-6 p-0">
                              <span className="badge badge-info text-left px-2 py-2">
                                {course.category}
                              </span>
                            </div>
                            <div className="col-6  p-0">
                              {course.published ? (
                                <span className="badge badge-success text-right p-2">
                                  Sudah Publish
                                </span>
                              ) : (
                                <span className="badge badge-warning text-right p-2">
                                  Belum Publish
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="row justify-content-left col-md-6 col-sm-12 mt-4">
                            <h5>
                              <strong>Deskripsi</strong>
                            </h5>
                          </div>

                          <div className="row justify-content-left col-md-12 col-sm-12 text-left">
                            <div>
                              <ReactMarkdown source={course.description} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 ">
                          <div className="row d-flex justify-content-end">
                            <Tooltip title="Edit">
                              <Button
                                shape="circle"
                                size="large"
                                className="bg-warning aris-button"
                                style={{
                                  marginRight: '5px',
                                  color: 'white',
                                  borderColor: '1px solid white',
                                }}
                                icon={
                                  <EditFilled
                                    style={{
                                      fontSize: '1.2em',
                                      fontWeight: 'bolder',
                                    }}
                                    onClick={() =>
                                      router.push(
                                        `/instructor/course/edit/${slug}`
                                      )
                                    }
                                  />
                                }
                              ></Button>
                            </Tooltip>

                            {course.lessons && course.lessons.length < 5 ? (
                              <Tooltip title="Min 5 lessons required to published">
                                <Button
                                  shape="circle"
                                  size="large"
                                  className="bg-danger aris-button"
                                  style={{
                                    marginLeft: '5px',
                                    color: 'white',
                                    borderColor: '1px solid white',
                                  }}
                                  icon={
                                    <QuestionOutlined
                                      style={{
                                        fontSize: '1.1em',
                                        fontWeight: '900',
                                      }}
                                    />
                                  }
                                ></Button>
                              </Tooltip>
                            ) : course.published ? (
                              <Tooltip title="Unpublished">
                                <Button
                                  onClick={(e) =>
                                    showConfirm(e, course._id, course.published)
                                  }
                                  shape="circle"
                                  size="large"
                                  className="bg-danger aris-button"
                                  style={{
                                    marginLeft: '5px',
                                    color: 'white',
                                    borderColor: '1px solid white',
                                  }}
                                  icon={
                                    <CloseOutlined
                                      style={{
                                        fontSize: '1.2em',
                                        fontWeight: 'bolder',
                                      }}
                                    />
                                  }
                                ></Button>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Publish">
                                <Button
                                  onClick={(e) =>
                                    showConfirm(e, course._id, course.published)
                                  }
                                  shape="circle"
                                  size="large"
                                  className="bg-success aris-button"
                                  style={{
                                    marginLeft: '5px',
                                    color: 'white',
                                    borderColor: '1px solid white',
                                  }}
                                  icon={
                                    <CheckOutlined
                                      style={{
                                        fontSize: '1.2em',
                                        fontWeight: 'bolder',
                                      }}
                                    />
                                  }
                                ></Button>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex justify-content-left">
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
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow">
            <div className="container-fluid pt-3">
              <div className="row pb-5">
                <div className="col lesson-list">
                  <h4>
                    {course && course.lessons && course.lessons.length} Lessons
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
          </div>
        </>
      )}
    </InstructorRoute>
  );
};

export default CourseView;
