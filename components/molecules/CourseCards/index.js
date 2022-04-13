import React from 'react';
import { Card, Badge } from 'antd';
import Link from 'next/link';
import FormatRupiah from '../../../utils/FormatRupiah';

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category } = course;
  return (
    <Link href={`/course/${slug}`}>
      <a>
        <Card
          hoverable
          className="card shadow mb-4 p-1"
          bodyStyle={{
            padding: '3px',
            paddingLeft: '5px',
            width: '100%',
          }}
          style={{ borderRadius: '1em', minHeight: '333px' }}
          cover={
            <img
              src={image.Location}
              alt={name}
              className="p-2"
              style={{
                height: '180px',
                // width: '240px',
                objectFit: 'cover',
                borderRadius: '1.15em',
              }}
            />
          }
        >
          <div style={{ width: '100%' }}>
            <div
              style={{
                minHeight: '50px',
                fontSize: '1.35em',
              }}
            >
              <h6 className="font-weight-bold">{name}</h6>
            </div>
            <span className="badge badge-info">{category}</span>
            <h5 className="pt-2 font-weight-bold" style={{ fontSize: '1.2em' }}>
              {paid ? `Rp.${FormatRupiah(price)}` : 'Gratis'}
            </h5>
            <p>{instructor.name}</p>
          </div>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
