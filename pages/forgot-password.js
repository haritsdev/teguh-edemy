import { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';
import HeroPage from '../components/Hero/HeroPage';
import OtpInput from 'react-otp-input';

const ForgotPassword = () => {
  // state
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [completCode, setCompletCode] = useState(false);

  //timer react js
  const [seconds, setSeconds] = useState(0);
  const [canSendAgain, setCanSendAgain] = useState(true);
  const countDown = (e) => {
    if (seconds >= 0) {
      intervalRis.current = setInterval(decreaseSeconds, 1000);
    }
  };

  const [newPassword, setNewPassword] = useState(0);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [loading, setLoading] = useState(false);

  const decreaseSeconds = () => setSeconds((prev) => prev - 1);
  const intervalRis = useRef();

  // context
  const {
    state: { user },
  } = useContext(Context);
  // router
  const router = useRouter();

  const handleChangeCode = (myCode) => {
    setCode(myCode);
    if (code.length === 3) {
      setCompletCode(true);
    }
  };

  // redirect if user is logged in
  useEffect(() => {
    if (user !== null) router.push('/');

    if (seconds <= 0) {
      setSeconds(0);
      clearInterval(intervalRis.current);
      seconds > 0 ? setCanSendAgain(false) : setCanSendAgain(true);
    }
  }, [user, seconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/forgot-password', { email });
      setSuccess(true);
      console.log(data);
      toast.success('Check your email for the secret code');
      setLoading(false);
      setSeconds(17);
      countDown();
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post('/api/reset-password', {
        email,
        code,
        newPassword,
      });
      console.log(data, 'DATA KU');
      console.log('OTP', code);
      console.log('MY email', email);
      console.log('PASSWORD', newPassword);
      console.log('reset password sayang');
      setEmail('');
      setCode('');
      setNewPassword('');
      setLoading(false);
      toast.success('Great! Now you can login with your new password');
      router.push('/login');
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    if (!canSendAgain) {
      console.log('mundur');
      countDown(e);
      console.log(seconds);
      console.log('tunggu');
    }
    if (canSendAgain && !success) {
      return handleSubmit(e);
      console.log('UDAH BISA KIRIM');
    }
    if (
      canSendAgain &&
      success &&
      completCode &&
      passwordConfirmation !== null
    ) {
      console.log('MANTAP RIS');
      return handleResetPassword(e);
    }
    return;
  };

  return (
    <>
      <HeroPage title={'Forgot Password'} />

      <div className="container col-md-5 col-sm-8 offset-md-4 pb-5" style={{}}>
        {/**
           * 1. STEP NUMBER 1 user input email and receive OTP in their email
           
           **/}
        <form onSubmit={formSubmit} autoComplete="off">
          {success === false && completCode === false ? (
            <input
              type="email"
              className="form-control mb-4 p-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          ) : (
            <></>
          )}
          {/* {success && <>Back to OTP code</>} */}

          {/**
           *2 STEP NUMBER 2User Enter OTP 
           
           **/}
          {success && (
            <>
              {/* <input
                type="text"
                className="form-control mb-4 p-4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code"
                required
              /> */}
              <div
                style={{
                  marginBottom: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {completCode === false ? (
                  <>
                    <OtpInput
                      // isDisabled={seconds > 0}
                      value={code}
                      containerStyle={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center !important',
                      }}
                      onChange={handleChangeCode}
                      inputStyle={{
                        width: 56,
                        height: 56,
                        borderRadius: 10,

                        marginLeft: 5,
                        fontSize: 21,
                        border: '1px solid black',
                      }}
                      numInputs={4}
                      isInputNum
                      separator={<span>&nbsp;</span>}
                    />
                    <div
                      style={{
                        marginTop: '1.43em',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Send Otp in 00:0{seconds} </span>
                      <button className="btn btn-primary" onClick={countDown}>
                        Send Again
                      </button>
                    </div>
                    <div
                      className="text-primary"
                      style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        cursor: 'pointer',
                        marginTop: 13,
                      }}
                      onClick={() => setSuccess(false)}
                    >
                      Do You want to change email?&nbsp;{' '}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              {completCode ? (
                <>
                  <input
                    type="password"
                    className="form-control mb-4 p-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    autoFocus={false}
                    autoComplete="off"
                    required
                  />
                  <input
                    type="password"
                    className="form-control mb-4 p-4"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    autoFocus={false}
                    autoComplete="off"
                    placeholder="password Confirmation"
                    required
                    disabled={newPassword === '' || newPassword == null}
                  />

                  {newPassword === '' ? (
                    <div
                      className="mb-4 text-danger"
                      onClick={() => setCompletCode(false)}
                    >
                      Password must be filled
                    </div>
                  ) : newPassword === setPasswordConfirmation ? (
                    <div>
                      apakah{' '}
                      {newPassword === passwordConfirmation ? 'sama' : 'beda'}
                    </div>
                  ) : (
                    <div className="mb-4 text-primary">Oke password same</div>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {canSendAgain ? (
            <>
              <button
                type="submit"
                className="btn btn-primary btn-block p-2"
                disabled={loading || !email}
              >
                {loading ? (
                  <SyncOutlined spin />
                ) : completCode && success && newPassword !== '' ? (
                  'Reset Password'
                ) : (
                  'Send to your email'
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="btn btn-primary btn-block p-2"
                disabled={
                  loading ||
                  !email ||
                  newPassword === '' ||
                  passwordConfirmation === ''
                }
              >
                {loading ? (
                  <SyncOutlined spin />
                ) : completCode && success && newPassword !== '' ? (
                  'Reset Password'
                ) : (
                  'Send to your email'
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
