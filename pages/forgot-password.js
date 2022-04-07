import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';
import HeroPage from '../components/Hero/HeroPage';

const ForgotPassword = () => {
  // state
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(true);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // context
  const {
    state: { user },
  } = useContext(Context);
  // router
  const router = useRouter();

  // redirect if user is logged in
  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/forgot-password', { email });
      setSuccess(true);
      toast.sucess('Check your email for the secret code');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // console.log(email, code, newPassword);
    // return;
    try {
      setLoading(true);
      const { data } = await axios.post('/api/reset-password', {
        email,
        code,
        newPassword,
      });
      setEmail('');
      setCode('');
      setNewPassword('');
      setLoading(false);
      toast('Great! Now you can login with your new password');
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  return (
    <>
      <HeroPage title={'Forgot Password'} />

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            disabled={success}
          />
          {success && (
            <>
              <input
                type="text"
                className="form-control mb-4 p-4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code"
                required
              />
              <div style={{ width: '100%' }}>
                <OTPInput
                  value={code}
                  inputClassName="aris-input"
                  onChange={setCode}
                  autoFocus
                  OTPLength={4}
                  otpType="number"
                  disabled={false}
                  secure
                />
                <ResendOTP
                  onResendClick={() => console.log('Resend clicked')}
                />
                <span
                  onClick={() => setSuccess(false)}
                  style={{
                    cursor: 'pointer',
                    color: 'green',
                    fontSize: 13,
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  Whant to Change Your Email?
                </span>
              </div>

              <input
                type="password"
                className="form-control mb-4 p-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block p-2"
            disabled={loading || !email}
          >
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
