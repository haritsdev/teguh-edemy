import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroPage from '../../../../components/Hero/HeroPage';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import CourseCreateForm from '../../../../components/Forms/CourseCreateForm';
import { useRouter } from 'next/router';

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    uploading: false,
    paid: true,
    loading: false,
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');
  const [fileList, setFileList] = useState([]);
  const [description, setDescription] = useState('');

  //router.get('/')
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setValues(data);
  };

  const handleDescriptionChange = ({ html, text }) => {
    console.log('handleEditorChange', text);

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
        toast.success('Upload data success');
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
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast('Image upload failed. Try later.');
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
      const { data } = await axios.post('/api/course', {
        ...values,
        image,
      });
      toast.success('Great! Now you can start adding lessons');
      router.push('/instructor');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <InstructorRoute>
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
    </InstructorRoute>
  );
};

export default CourseEdit;
