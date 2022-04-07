import React from 'react';

const HeroPage = ({ title }) => {
  return (
    <h1 className="page-jumbotron bg-primary text-center square">{title}</h1>
  );
};

export default HeroPage;
