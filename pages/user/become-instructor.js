import { useContext, useState } from 'react';
import { Context } from '../../context';
import { Button, Alert } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/UserRoute';
import HeroPage from '../../components/Hero/HeroPage';

const BecomeInstructor = () => {
  // state
  const [loading, setLoading] = useState(false);

  const onClose = (e) => {
    console.log(e, 'I was closed.');
  };

  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor = () => {
    // console.log("become instructor");
    setLoading(true);
    axios
      .post('/api/make-instructor')
      .then((res) => {
        console.log(res, 'MAKE INSTRUCTOR');
        window.location.href = res.data;
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.status);
        toast.error('Stripe onboarding failed. Try again.');
        setLoading(false);
      });
  };

  return (
    <>
      <HeroPage title={'Login'} />

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div
              className="card shadow text-center my-3 mb-3"
              style={{ width: 500, marginBottom: '50px' }}
            >
              <div className="card card-body pt-4">
                <Image width={290} height={290} src={'/image/payment.jpg'} />

                <br />
                <h2>
                  Setup payout to publish courses on{' '}
                  <span className="p-aris-rubik-paint">Teguh</span>
                  <span className="p-aris-rubik-paint text-primary">Demy</span>
                </h2>
                <Alert
                  className="my-3"
                  message="Edemy partners with stripe to transfer earnings to your bank
                  account"
                  type="warning"
                  closable
                  onClose={onClose}
                />
                <Button
                  className="my-2"
                  type="primary"
                  onClick={becomeInstructor}
                  icon={
                    loading ? (
                      <LoadingOutlined style={{ fontSize: '25px' }} />
                    ) : (
                      <SettingOutlined style={{ fontSize: '25px' }} />
                    )
                  }
                  size="large"
                  disabled={
                    (user && user.role && user.role.includes('Instructor')) ||
                    loading
                  }
                >
                  {loading ? (
                    <LoadingOutlined>Loading...</LoadingOutlined>
                  ) : (
                    <span style={{ fontSize: '17px', marginLeft: '15px' }}>
                      <strong> Show Button</strong>
                    </span>
                  )}
                </Button>
                <p className="my-3" style={{ fontSize: '14px' }}>
                  You will be redirected to stripe to complete onboardning
                  process
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
