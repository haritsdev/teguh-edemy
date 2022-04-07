import React, { useState } from 'react';
import { Menu, Grid } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import Link from 'next/link';
import {
  CarryOutFilled,
  CarryOutOutlined,
  TeamOutlined,
  BookOutlined,
} from '@ant-design/icons';
import CssMenu from './Left.module.css';
const { useBreakpoint } = Grid;
import { useRouter } from 'next/router';

const LeftMenu = ({ currentPath, onChangePathName }) => {
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const router = useRouter();
  const path = router.pathname;

  const { md } = useBreakpoint();
  return (
    <Menu mode={md ? 'horizontal' : 'inline'}>
      <Menu.Item
        className={CssMenu.item}
        onClick={() => onChangePathName(path)}
        icon={
          currentPath?.toString() === '/instructor/course/create' ? (
            <CarryOutFilled style={{ fontSize: 24, fontWeight: 'bolder' }} />
          ) : (
            <CarryOutOutlined style={{ fontSize: 24, fontWeight: 'bolder' }} />
          )
        }
        key="mail"
      >
        <Link
          href="/instructor/course/create"
          style={{ color: 'black !important' }}
        >
          <a className={CssMenu.colorA}>Create Course</a>
        </Link>
      </Menu.Item>
      <SubMenu
        key="sub1"
        className={CssMenu.item}
        title={<span>Blogs</span>}
        icon={<TeamOutlined style={{ fontSize: 24, fontWeight: 'bolder' }} />}
        // onClick={onChangePathName(path)}
      >
        <MenuItemGroup title="Item 1">
          <Menu.Item key="setting:1">Option 1</Menu.Item>
          <Menu.Item key="setting:2">Option 2</Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup title="Item 2">
          <Menu.Item key="setting:3">Option 3</Menu.Item>
          <Menu.Item key="setting:4">Option 4</Menu.Item>
        </MenuItemGroup>
      </SubMenu>
      <Menu.Item
        key="alipay"
        className={CssMenu.item}
        icon={<BookOutlined style={{ fontSize: 24, fontWeight: 'bolder' }} />}
      >
        <a href="">Contact Us</a>
      </Menu.Item>
    </Menu>
  );
};

export default LeftMenu;
