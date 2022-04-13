import { useState, useEffect } from 'react';
import { Select, Button, Upload, Avatar, Badge, Skeleton } from 'antd';
import { SaveOutlined, UserOutlined } from '@ant-design/icons';
import FormatRupiah from '../../utils/FormatRupiah';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
const { Option } = Select;

const CourseCreateForm = ({
  values,
  setValues,
  handleImage,
  handleSubmit,
  handleChange,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  handleDescriptionChange,
  editPage = false,
}) => {
  const [currentPrice, setCurrentPrice] = useState(values.price);

  useEffect(() => {
    changePrice();
  }, [currentPrice]);

  const changePrice = () => {
    setCurrentPrice(values.price);
  };
  const children = [];
  const price = [109000, 129000, 179000, 349000, 798000, 1596000];
  let defaultValue = price.includes(values.price);
  // if (defaultValue) {
  //   setCurrentPrice(values.price);
  // }
  for (let i = 0; i <= price.length - 1; i++) {
    children.push(
      <Option key={price[i]} value={price[i]}>
        Rp. {FormatRupiah(price[i])}
      </Option>
    );

    console.log(price[i], 'price');
  }

  // Initialize a markdown parser
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  return (
    <>
      <div className="card shadow">
        <div className="card-body">
          {values ? (
            <>
              <form onSubmit={handleSubmit} className="form-group">
                <div className="row g-3 gy-3 mb-3">
                  <div className="col-sm-7">
                    {preview ? (
                      <Badge
                        style={{
                          fontSize: 19,
                          padding: '9px',
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                        count="X"
                        onClick={handleImageRemove}
                      >
                        <Avatar
                          className="img-fluid"
                          shape="square"
                          style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                          }}
                          src={preview}
                        />
                      </Badge>
                    ) : editPage && values.image ? (
                      <Badge
                        style={{
                          fontSize: 19,
                          padding: '9px',
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                        count="X"
                        onClick={handleImageRemove}
                      >
                        <Avatar
                          className="img-fluid"
                          shape="square"
                          style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                          }}
                          src={values.image.Location}
                        />
                      </Badge>
                    ) : (
                      <Avatar
                        shape="square"
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'contain',
                        }}
                        src="http://4.bp.blogspot.com/-MowVHfLkoZU/VhgIRyPbIoI/AAAAAAAATtE/qHST4Q2YCCc/s1600/placeholder-image.jpg"
                      />
                    )}

                    <div className="form-group">
                      <label className="btn btn-outline-secondary btn-block text-left">
                        {editPage && values.image
                          ? values?.image?.Location
                          : uploadButtonText}
                        <input
                          type="file"
                          name="image"
                          onChange={handleImage}
                          accept="image/*"
                          hidden
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-sm">
                    <div className="row mt-3">
                      <div className="col">
                        <div className="form-group">
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Name"
                            value={values.name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col">
                        <div className="form-row pt-3">
                          <div className="col">
                            <div
                              className="form-group"
                              style={{ width: '100%' }}
                            >
                              <Select
                                style={{ width: '100%' }}
                                size="large"
                                value={values.paid}
                                onChange={(v) =>
                                  setValues({ ...values, paid: v, price: 0 })
                                }
                              >
                                <Option value={true}>Paid</Option>
                                <Option value={false}>Free</Option>
                              </Select>
                            </div>
                          </div>
                          {values.paid && (
                            <div className="col-md-6">
                              <div className="form-group">
                                <Select
                                  style={{ width: '100%' }}
                                  size="large"
                                  defaultValue={values?.price}
                                  onChange={(v) => {
                                    console.log('CHANGE PRICE', v);
                                    setCurrentPrice(v);
                                    setValues({ ...values, price: v });
                                  }}
                                  tokenSeparators={[,]}
                                >
                                  {children}
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col">
                        <div className="form-group">
                          <input
                            type="text"
                            name="category"
                            className="form-control"
                            placeholder="Category"
                            value={values.category}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-5">
                      <div className="col">
                        <div className="form-group mt-4 text-right">
                          <Button
                            onClick={handleSubmit}
                            disabled={values.loading || values.uploading}
                            className="btn btn-primary"
                            icon={<SaveOutlined />}
                            type="primary"
                            size="large"
                          >
                            {values.loading
                              ? 'Saving...'
                              : editPage
                              ? 'Update Course'
                              : 'Save & Continue'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <MdEditor
                      style={{ height: '500px' }}
                      value={values.description}
                      renderHTML={(text) => mdParser.render(text)}
                      onChange={handleDescriptionChange}
                    />
                    {/* <textarea
                      name="description"
                      cols="7"
                      rows="7"
                      value={values.description}
                      className="form-control"
                      onChange={handleChange}
                    ></textarea> */}
                  </div>
                </div>
              </form>
            </>
          ) : (
            <Skeleton active />
          )}
        </div>
      </div>
    </>
  );
};

export default CourseCreateForm;
