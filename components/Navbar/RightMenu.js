import React from 'react';
import { Menu, Grid } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import Link from 'next/link';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import Left from './Left.module.css';
const { useBreakpoint } = Grid;

const RightMenu = () => {
  const { md } = useBreakpoint();
  return (
    <Menu mode={md ? 'horizontal' : 'inline'}>
      <Menu.Item
        key="mail"
        className={Left.item}
        icon={<UserOutlined style={{ fontSize: 24, fontWeight: 'bolder' }} />}
      >
        {' '}
        <Link href="/register">
          <a href="">Signin</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        key="app"
        className={Left.item}
        icon={
          <UserAddOutlined style={{ fontSize: 24, fontWeight: 'bolder' }} />
        }
      >
        <Link href="/register">
          <a>Register</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default RightMenu;
