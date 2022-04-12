import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import ShowProgress from '../molecules/ShowProgress';

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
  handleVideoRemove,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          value={values.title}
          className="form-control square"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          placeholder="enter title here"
          autoFocus
          required
        />
        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Enter content description"
        ></textarea>

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadButtonText}
            <input
              name="uploadVideo"
              onChange={handleVideo}
              type="file"
              accept="video/*"
              hidden
            />
          </label>
          {!uploading && values.video.Location && (
            <Tooltip title="Remove">
              <span className="pt-1 pl-3" onClick={handleVideoRemove}>
                <CloseCircleFilled
                  size="large"
                  className="text-danger d-flex justify-content-center pointer pt-4"
                  style={{ fontSize: 19 }}
                />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && <ShowProgress percent={progress} step={10} />}

        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
