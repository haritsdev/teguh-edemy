import React, { useState, useEffect } from 'react';
import { Button, Switch } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import ShowProgress from '../molecules/ShowProgress';
import ReactPlayer from 'react-player';

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploading,
  uploadVideoButtonText,
  progress,
  handleVideoUpload,
}) => {
  return (
    <div className="container pt-3">
      {/* <pre>{JSON.stringify(current, null, 4)}</pre> */}
      <form onSubmit={handleUpdateLesson}>
        <input
          type="text"
          value={current.title}
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          placeholder="enter title here"
          autoFocus
          required
        />
        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
        ></textarea>

        <div>
          {!uploading && current.video && current.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
              <ReactPlayer
                url={current.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )}

          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadVideoButtonText}
            <input
              name="uploadVideo"
              onChange={handleVideoUpload}
              type="file"
              accept="video/*"
              hidden
            />
          </label>
        </div>

        {progress > 0 && <ShowProgress percent={progress} step={10} />}

        <div className="d-flex justify-content-between">
          <span className="pt-3 badge">Preview</span>
          <Switch
            className="float-right mt-2"
            disabled={uploading}
            defaultChecked={current.free_preview}
            name="free_preview"
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>

        <Button
          onClick={handleUpdateLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdateLessonForm;
