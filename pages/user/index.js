import { useContext } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import HeroPage from '../../components/Hero/HeroPage';

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  return (
    <UserRoute>
      <HeroPage title={'My Dashboard'} />
    </UserRoute>
  );
};

export default UserIndex;
