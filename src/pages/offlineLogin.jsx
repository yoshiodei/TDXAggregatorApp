import React, { useState } from 'react'
import { Page, f7 } from 'framework7-react'
import Navbar from '../components/navbar'
import CryptoJS from 'crypto-js';
import store from '../js/store';
import { MdCloudOff } from "react-icons/md";

export default function OfflineLogin({ f7router }){
  const [credentials, setCredentials] = useState({ phone: '', password: '' });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCredentials({ ...credentials, [name]:value }); 
  }

  const findUserByNumber = (users, mobile) => {
    return users.find((user) => user.mobile === mobile) || null;
  };

  const handleSubmit = () => {
    const {phone, password} = credentials;
    const existingUsers = JSON.parse(localStorage.getItem('users'));

    if(existingUsers.length === 0){
        f7.dialog.alert('No data available.');
    }
    if ( !phone || !password ){
      f7.dialog.alert('Fields cannot be left empty');
    }
    if(phone && password){
        const matchedUser = findUserByNumber(existingUsers, phone);
        if(!matchedUser){ f7.dialog.alert('User is not available in offline mode. Please try again.'); }
        if(matchedUser.mobile){
          const sha256Password = CryptoJS.SHA256(credentials.password).toString();
            if(sha256Password === matchedUser.password){
              store.dispatch('setOfflineUser', matchedUser); 
              console.log('offline user', matchedUser); 
              f7router.navigate('/offline-dashboard/');    
            } else {
              f7.dialog.alert('User is not available in offline mode. Please try again.')
            }
        }
    }
  }

  return (
    <Page name="login">
      <div className="w-full flex flex-col min-h-screen">
        <div className="bg-red-500 text-white flex items-center justify-center p-1 text-[0.9em] gap-x-1">
          <MdCloudOff  />
          <p className=" text-semibold">You are offline</p>
        </div>
        <Navbar  title="Log In" goBack={false} f7router={f7router} />
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
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">PIN</label>
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
                      placeholder="Enter PIN"
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
              <h6 className="text-base font-semibold text-white">Log In</h6>
            </button>
          </div>
        </div>
      </div>
    </Page>
  )
}
