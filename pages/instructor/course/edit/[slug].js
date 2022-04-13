import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroPage from '../../../../components/Hero/HeroPage';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import CourseCreateForm from '../../../../components/Forms/CourseCreateForm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { List, Avatar } from 'antd';

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
          {/* <pre>{JSON.stringify(values, null, 4)}</pre>
    <pre>{JSON.stringify(image, null, 4)}</pre> */}
          <div className="card shadow py-5 pb-5">
            <div className="col lesson-list">
              <h4>
                {values && values?.lessons && values?.lessons?.length} Lessons
              </h4>
              <div>
                {/* <pre> {JSON.stringify(course.lessons, null, 4)}</pre> */}

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
                          avatar={
                            <Avatar className="bg-success">{index + 1}</Avatar>
                          }
                          title={item.title}
                        />
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
    </InstructorRoute>
  );
};

export default CourseEdit;
// export async function getStaticPaths() {
//   const { data } = await axios.get(`/api/course/belajar-laravel-basic`);

//   const paths = data.map((course) => ({
//     params: { id: course._id.toString() },
//   }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps() {
//   const { data } = await axios.get(`/api/course/belajar-laravel-basic`);
//   return {
//     props: {
//       dataCourse: data,
//     },
//   };
// }
