import { Page, f7 } from 'framework7-react'
import React, { useState } from 'react'
import Navbar from '../components/navbar'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from "react-icons/fa";
import CryptoJS, { crypto } from 'crypto-js';
import axios from 'axios';
import store from '../js/store';

export default function Login({ f7router }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({ phone: '', password: '' });
  const [challenge, setChallenge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCredentials({ ...credentials, [name]:value }); 
  }

  const handleSubmit = async () => {
    const {phone, password} = credentials;
    setLoading(true);

    if ( !phone || !password ){
      f7.dialog.alert('Fields cannot be left empty');
      setLoading(false);
    }
    if(phone && password){
      await handleLogin();
      setLoading(false);
    }
  }

  const getChallenge = async () => {
    try {
        const response = await axios.post(`https://torux.app/api/get_challenge/${credentials.phone}`, {});
        if (response.data.challenge) {
          setChallenge(response.data.challenge);
          validateUser(response.data.challenge);
        } else {
          f7.dialog.alert('User not found');
        }
    } catch (error) {
      console.error('Error getting challenge', error);
      f7.dialog.alert('Error fetching user');
    }
};

const hashHMAC = (message, key) => {
  return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);
};

const handleLogin = async () => {
    // if (!challenge) {
        await getChallenge();
    // }
    // if (challenge) {
    //     // Convert password to SHA-256
    //     const sha256Password = CryptoJS.SHA256(credentials.password).toString();
    //     const response = hashHMAC(challenge, sha256Password);

    //     try {
    //         const result = await axios.post(`https://torux.app/api/validate_response/${response}`,{});
    //         if (!result.data.error) {
    //             store.dispatch('setUser', result.data);
    //             f7router.navigate('/sync-data/');
    //             console.log('user data', result.data);
    //         } else {
    //             console.log('response', response);
    //             console.log('user data', result);
    //             f7.dialog.alert('Incorrect Phone Number or Password.');
    //         }
    //     } catch (error) {
    //         console.error('Error validating response', error);
    //         f7.dialog.alert('Something went wrong. Try again later');
    //     }
    // }
};

  const validateUser = async (challenge) => {
    const sha256Password = CryptoJS.SHA256(credentials.password).toString();
        const response = hashHMAC(challenge, sha256Password);

        try {
            const result = await axios.post(`https://torux.app/api/validate_response/${response}`,{});
            if (!result.data.error) {
                store.dispatch('setUser', result.data);
                f7router.navigate('/sync-data/');
                console.log('user data', result.data);
            } else {
                console.log('response', response);
                console.log('user data', result);
                f7.dialog.alert('Incorrect Phone Number or Password.');
            }
        } catch (error) {
            console.error('Error validating response', error);
            f7.dialog.alert('Something went wrong. Try again later');
        }
  }

  return (
    <Page name="login">
      <div className="w-full flex flex-col min-h-screen">
        <Navbar  title="Log In" goBack={false} f7router={f7router} menu={false} />
        <div className="flex-1 w-full sm:p-5 p-3 flex flex-col bg-background-primary">
          <div>
            <div className="sm:mb-5 mb-3">
              <h4 className="font-bold sm:text-lg text-base text-primary text-center sm:text-left">Kindly Log In Your Credentials</h4>
            </div>
            <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Phone</label>
                  <div className="rounded w-full h-[2.5em] bg-white relative px-2 border border-slate-200">
                    {/* <h6 className="absolute top-[0.5em] left-[10px] font-semibold">+233</h6> */}
                    <input
                      min={0}
                      placeholder="Enter phone number"
                      type="number"
                      name="phone"
                      value={credentials.phone}
                      className="rounded w-full h-full"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Pin</label>
                  <div className="rounded w-full h-[2.5em] bg-white relative ps-2 pe-[50px] border border-slate-200">
                    {/* {!passwordVisible && (<button onClick={() => setPasswordVisible(!passwordVisible)} className="flex justify-center items-center absolute top-[0.5em] right-[10px] w-[1.5em] h-[1.5em]">
                      <FaEye className="text-slate-500" />
                    </button>)}
                    {passwordVisible && (<button onClick={() => setPasswordVisible(!passwordVisible)} className="flex justify-center items-center absolute top-[0.5em] right-[10px] w-[1.5em] h-[1.5em]">
                      <FaEyeSlash className="text-slate-500" />
                    </button>)} */}
                    <input
                      name="password"
                      value={credentials.password}
                      onChange={(e) => handleChange(e)}
                      placeholder="Enter password"
                      type="text"
                      className="rounded w-full h-full"
                    />
                  </div>
                </div>
                {/* <div className="flex justify-end w-full">
                  <button className="w-auto font-semibold text-primary text-[0.9em]" onClick={() => f7router.navigate('/forgot-password/')}>
                    <h6>Forgot Password</h6>
                  </button>  
                </div> */}
          </div>
          </div>
          <div className="mt-2">
            <button onClick={handleSubmit} className="flex justify-center items-center w-full sm:h-[2.5em] h-[30px] rounded bg-primary">
              <h6 className="text-base font-semibold text-white">{loading ? '...loading' : 'Log In'}</h6>
            </button>
            <div className="flex justify-center mt-1">
              <div className="text-[0.95em]">  
                <h6 className="w-auto font-semibold text-slate-500 sm:text-left text-center">Don't have an account yet? <button onClick={() => f7router.navigate('/signup/')}  className="w-auto text-primary font-semibold">Sign Up</button></h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
