import React, { useState, useEffect, useContext } from 'react';
import ArisNavbar from './ArisNavbar';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Button, Drawer } from 'antd';
import CssMenu from './Left.module.css';
import { BarsOutlined } from '@ant-design/icons';
import { Context } from '../../context';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import MyMenu from './MyMenu.module.css';

const MyNavbar = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav className={MyMenu.menuBar}>
      <div style={{ width: '95%' }}>
        <ArisNavbar />
      </div>

      <div className={MyMenu.barsMenu}>
        <Button onClick={showDrawer} size="large">
          <BarsOutlined style={{ fontSize: '21px' }} />
        </Button>
      </div>

      {/* <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <LeftMenu />
        <RightMenu />
      </Drawer> */}
    </nav>
  );
};

export default MyNavbar;
