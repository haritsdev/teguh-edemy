import { useState, useEffect } from 'react';
import Link from 'next/link';

const InstructorNav = () => {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div
      className="card shadow bg-white nav flex-column nav-pills my-3"
      style={{ marginLeft: '-10px', width: '200px' }}
    >
      <Link href="/instructor">
        <a className={`nav-link ${current === '/instructor' && 'active'} py-3`}>
          Dashboard
        </a>
      </Link>
      <Link href="/instructor/course/create">
        <a
          className={`nav-link py-3 ${
            current === '/instructor/course/create' && 'active'
          }`}
        >
          Course Create
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;
