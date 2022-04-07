import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Button } from 'antd';
import CssMenu from './Left.module.css';
import Icon, {
  BarsOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import { Context } from '../../context';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const { Item, SubMenu, ItemGroup } = Menu;

const ArisNavbar = () => {
  const [current, setCurrent] = useState('');

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
    window.localStorage.removeItem('user');
    const { data } = await axios.get('/api/logout');
    toast(data.message);
    router.push('/login');
  };

  const HeartSvg = () => (
    <img
      src={'https://www.svgrepo.com/show/9682/avatar.svg'}
      width={50}
      height={50}
    />
  );
  const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[current]}
      style={{
        paddingBottom: '12px',
        paddingTop: '9px',
      }}
    >
      <Item key="/" onClick={(e) => setCurrent(e.key)}>
        <Link href="/" style={{ marginLeft: '27px' }}>
          <div
            style={{
              padding: '7px',

              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Image
              src={'/image/TeguhDemy.png'}
              alt=""
              height={32}
              width={140}
            />
          </div>
        </Link>
      </Item>

      {user && user.role && user.role.includes('Instructor') ? (
        <Item
          key="/instructor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create">
            <a>Create Course</a>
          </Link>
        </Item>
      ) : (
        <Item
          className={CssMenu.item}
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined style={{ fontSize: 26, fontWeight: 'bolder' }} />}
        >
          <Link href="/user/become-instructor">
            <a>Become Instructor</a>
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={
              <LoginOutlined style={{ fontSize: 23, fontWeight: 'bolder' }} />
            }
            className={[CssMenu.itemRight]}
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={
              <UserAddOutlined style={{ fontSize: 23, fontWeight: 'bolder' }} />
            }
            className={[CssMenu.itemRight]}
          >
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}

      {user !== null && (
        <SubMenu
          icon={
            <HeartIcon
              style={{ color: 'hotpink', width: '50px', height: '50px' }}
            />
          }
          title={user && `${user.name} Nurgustiani sdsfsd`}
          className={[CssMenu.itemRight]}
        >
          <ItemGroup style={{ fontSize: '21px' }}>
            <Item key="/user">
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default ArisNavbar;
