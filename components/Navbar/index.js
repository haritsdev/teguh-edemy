import React, { useState, useEffect, useContext, Component } from 'react';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import { Drawer, Button } from 'antd';
import Image from 'next/image';
import { Context } from '../../context';
import styles from './Navbar.module.css';
import './Navbar.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav className={styles.menuBar}>
      <div
        className={[styles.arisCenterFlex]}
        style={{
          marginRight: '20px',
          padding: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          textAlign: 'center',
        }}
      >
        <Link href="/">
          <a
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Image
              src={'/image/TeguhDemy.png'}
              alt=""
              height={32}
              width={140}
            />
          </a>
        </Link>
      </div>
      <div className={styles.menuCon}>
        <div className={styles.leftMenu}>
          <LeftMenu
            currentPath={currentPath}
            onChangePathName={(currentPath) => {
              setCurrentPath(currentPath);
            }}
          />
        </div>
        <div className={styles.rightMenu}>
          <RightMenu />
        </div>

        <Button
          className={styles.barsMenu}
          type="primary"
          onClick={showDrawer}
        ></Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu />
          <RightMenu />
        </Drawer>
      </div>
    </nav>
  );
};
export default Navbar;
