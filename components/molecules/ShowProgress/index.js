import React from 'react';
import { Progress } from 'antd';

const ShowProgress = ({ percent, step }) => {
  return (
    <Progress
      percent={percent}
      step={step}
      className="d-flex justify-content-center pt-2"
    />
  );
};

export default ShowProgress;
