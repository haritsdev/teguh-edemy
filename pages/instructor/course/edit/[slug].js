import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroPage from '../../../../components/Hero/HeroPage';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import CourseCreateForm from '../../../../components/Forms/CourseCreateForm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { List, Avatar, Button, Tooltip, Modal } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/Forms/UpdateLessonForm';

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    uploading: false,
    paid: true,
    loading: false,
    lessons: [],
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');
  const [fileList, setFileList] = useState([]);
  const [description, setDescription] = useState('');
  const [params, setParams] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentLessons, setCurrentLessons] = useState({});
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState('Upload Video');

  //router.get('/')
  const router = useRouter();
  const { slug } = router.query;

  const { Item } = List;

  useEffect(() => {
    if (router && router.query) {
      console.log(router.query);
      setParams(router.query.params);
    }

    loadCourse();
  }, [router, slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleDescriptionChange = ({ html, text }) => {
    setDescription(text);
    setValues({ ...values, description: description });
  };
  //router routes

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });
    // console.log(file);
    // resize;
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        });

        // set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
        toast.success('Gambar berhasil di upload');
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast.error('Image upload failed. Try later.');
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      // console.log(values);
      setValues({ ...values, loading: true });
      const res = await axios.post(`/api/course/remove-image/${slug}`, {
        image,
      });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
      toast.success('Berhasil menghapus thumbnail');
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast.warning('Gagal menghapus thumbnail coba lagi');
    }
  };

  const onChange = ({ fileList: newFileList }) => {
    console.log(newFileList, 'BARU');
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    console.log(src, 'SRC');
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast.success('Berhasil ! Mengupdate data');
      // router.push('/instructor');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    // console.log('ON DRAG', index);
    e.dataTransfer.setData('itemIndex', index);
  };

  const handleDrop = async (e, index) => {
    // console.log('ON DROP', index);
    const movingItemIndex = e.dataTransfer.getData('itemIndex');
    const targetItemIndex = index;

    let allLessons = values.lessons;
    let movingItem = allLessons[movingItemIndex]; //clicked/dragged item to reorder
    allLessons.splice(movingItemIndex, 1); //remove 1 item from givens Index
    allLessons.splice(targetItemIndex, 0, movingItem); //push item after target item index

    setValues({ ...values, lessons: [...allLessons] });
    //sve new lessons order in db
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    console.log('LESSONS REARANGED RES=>', data);
    toast.success('Lessons has been rearanged successfully');
  };

  // * FUNCTION DELETE LESSONS OF INSTRUCCTORS  COURSE
  const handleDelete = async (index) => {
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });

    //send request to server
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${removed[0]._id}`
    );
    toast.success('Item has been removed');
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (currentLessons.video && currentLessons.video.Location) {
      const res = await axios.post(
        `/api/course/remove-video/${values.instructor._id}`,
        currentLessons.video
      );
      console.log('REMOVED ===', res);
    }

    //upload video
    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);

    //send video as form data;
    const videoData = new FormData();
    videoData.append('video', file);
    videoData.append('courseId', values._id);

    //save progress bar and send vidoe as form data to backend
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );

    console.log('DAATA UPLOAD UPDATE VIDEO', data);
    setCurrent({ ...currentLessons, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/update/${slug}/${currentLessons._id}`,
      currentLessons
    );

    setUploadVideoButtonText('Upload Video');

    setVisible(false);

    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === currentLessons._id);
      arr[index] = currentLessons;
      setValues({ ...values, lessons: arr });

      toast.success('Lesson Updated');
    }
  };
  return (
    <InstructorRoute>
      {slug !== undefined ? (
        <>
          <HeroPage title={'Update Course'} />
          <div className="pt-3 pb-3">
            <CourseCreateForm
              handleSubmit={handleSubmit}
              handleImage={handleImage}
              handleChange={handleChange}
              values={values}
              setValues={setValues}
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              preview={preview}
              uploadButtonText={uploadButtonText}
              handleImageRemove={handleImageRemove}
              handleDescriptionChange={handleDescriptionChange}
              editPage={true}
            />
          </div>

          <div className="card shadow py-5 pb-5">
            <div className="col lesson-list">
              <h4>
                {values && values?.lessons && values?.lessons?.length} Lessons
              </h4>
              <div>
                {(values && values?.lessons != []) || values?.lessons != 0 ? (
                  <List
                    onDragOver={(e) => e.preventDefault()}
                    itemLayout="horizontal"
                    dataSource={values && values.lessons}
                    renderItem={(item, index) => (
                      <Item
                        draggable
                        onDragStart={(e) => handleDrag(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <Item.Meta
                          onClick={() => {
                            setVisible(true);
                            setCurrentLessons(item);
                          }}
                          avatar={
                            <Avatar className="bg-success">{index + 1}</Avatar>
                          }
                          title={item.title}
                        />

                        <Tooltip title="Delete Course">
                          <Button
                            shape="circle"
                            size="large"
                            className="bg-danger"
                            style={{
                              marginRight: '5px',
                              color: 'white',
                              borderColor: '1px solid white',
                            }}
                            icon={
                              <DeleteFilled
                                style={{
                                  fontSize: '1.2em',
                                  fontWeight: 'bolder',
                                }}
                                onClick={() => handleDelete(index, item)}
                              />
                            }
                          ></Button>
                        </Tooltip>
                      </Item>
                    )}
                  />
                ) : (
                  <>KOSONG</>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          Page not found Back to{' '}
          <Link href="/instructor/">
            <a>Instructor</a>
          </Link>
        </>
      )}
      <Modal
        className="card shadow"
        title="Update Lesson"
        width={700}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className="col">
          <UpdateLessonForm
            currentLessons={currentLessons}
            setCurrentLessons={setCurrentLessons}
            handleVideoUpload={handleVideoUpload}
            handleUpdateLesson={handleUpdateLesson}
            uploadVideoButtonText={uploadVideoButtonText}
            progress={progress}
            uploading={uploading}
          />
          {/* <pre>{JSON.stringify(currentLessons, null, 4)}</pre> */}
        </div>
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
