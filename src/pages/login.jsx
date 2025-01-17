import { Page, f7 } from 'framework7-react'
import React, { useState } from 'react'
import Navbar from '../components/navbar'
import OTPInput from 'react-otp-input'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from "react-icons/fa"
import CryptoJS, { crypto } from 'crypto-js'
import axios from 'axios'
import store from '../js/store'
import useConnection from '../hooks/useConnection'
import OfflinePanel from '../components/offlinePanel'

export default function Login({ f7router }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({ phone: '', password: '' });
  const [challenge, setChallenge] = useState('');
  const [enableOfflineMode, setEnableOfflineMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState('');
  const [pinIsHidden, setPinIsHidden] = useState(true);

  const {connectionStatus} = useConnection();

  const handleChange = (e) => {
    const {name, value} = e.target;
    
    if(name === 'password'){
      if(value.length <= 4){
        setCredentials({ ...credentials, [name]:value });
      }
    } else {
      setCredentials({ ...credentials, [name]:value }); 
    }
  }

  const handleSubmit = async () => {
    const {phone} = credentials;
    setLoading(true);

    if ( !phone || !otp ){
      f7.dialog.alert('Fields cannot be left empty','');
      setLoading(false);
      return;
    }
    if ( otp.length !== 4 ){
      f7.dialog.alert('PIN must be 4 digits','');
      setLoading(false);
      return;
    }
    if(phone && otp){
      await handleLogin();
      setLoading(false);
      return;
    }
  }

  const getChallenge = async () => {
    try {
        const response = await axios.post(`https://torux.app/api/get_challenge/${credentials.phone}`, {});
        if (response.data.challenge) {
          console.log('challenge data', response.data.challenge);
          setChallenge(response.data.challenge);
          validateUser(response.data.challenge);
        } else {
          f7.dialog.alert('User not found');
        }
    } catch (error) {
      console.error('Error getting challenge', error);
      if(error.code === 'ERR_NETWORK'){
        setEnableOfflineMode(true);
      }
      f7.dialog.alert('Error fetching user','');
    }
};

const hashHMAC = (message, key) => {
  return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);
};

  const handleLogin = async () => {
    await getChallenge();
  };

  const saveToDevice = (dataObj) => {
     const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
     const isDuplicate = existingUsers.some((user) => user.token === dataObj.token);
     if (isDuplicate) {
      let updatedExistingUsers = []; 
      updatedExistingUsers = existingUsers.map((user) => (
        (user.token !== dataObj.token) ? user : dataObj 
      ));
      localStorage.setItem('users', JSON.stringify(updatedExistingUsers));
      return; 
     }
     else {
       const updatedUsers = [...existingUsers, dataObj];
       localStorage.setItem('users', JSON.stringify(updatedUsers));
       return;
     }
  };

  const findUserByNumber = (users, mobile) => {
    return users.find((user) => user.mobile === mobile) || null;
  };

  const checkForOfflineUserData = (data) => {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if(!existingUsers?.length){
      return data;
    } else {
       const offlineUserData = findUserByNumber(existingUsers, data.mobile);
       if(!offlineUserData?.mobile){
        //  f7.dialog.alert('Unable to fetch offline data','');
         return data;
       }else {
         return {...data, pendingTransactions: (offlineUserData.pendingTransactions || [])}
       }
    }
  };

  const validateUser = async (challenge) => {
       const sha256Password = CryptoJS.SHA256(otp).toString();
       const response = hashHMAC(challenge, sha256Password);      

        try {
            const result = await axios.post(`https://torux.app/api/validate_response/${response}`,{});
            // console.log('Check user data ==>', result);
            
            if (!result.data.error) {

                const updatedOfflineUserData = checkForOfflineUserData(result.data);
                store.dispatch('setUser', updatedOfflineUserData);

                const userData = {
                  ...updatedOfflineUserData,
                  password: sha256Password,
                  firstname: result.data.firstname,
                  lastname: result.data.lastname,
                  community_id: result.data.community_id,
                  mobile: result.data.mobile,  
                  token: result.data.token,  
                };

                saveToDevice(userData);
                f7router.navigate('/sync-data/');
                console.log('global user data', updatedOfflineUserData);

            } else {
                console.log('response', response);
                console.log('user data', result);
                f7.dialog.alert('Incorrect Phone Number or Password.','');
            }
        } catch (error) {
            console.error('Error validating response', error);
            if(error.code === 'ERR_NETWORK'){
              setEnableOfflineMode(true);
            }
            f7.dialog.alert('Something went wrong. Try again later','');
        }
  }

  const handleChangePin = (value) => {
    if(!isNaN(Number(value))){    
      setOTP(value)
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
                  <div className="w-full h-auto flex justify-between mb-1">
                    <label className="text-[0.9em] font-bold text-slate-600">PIN</label>
                    <button className="text-[0.9em] font-bold text-slate-400 w-auto" onClick={() => setPinIsHidden(!pinIsHidden)}>{pinIsHidden ? 'Show PIN' : 'Hide PIN'}</button>
                  </div>

                  <OTPInput 
                    value={otp}
                    onChange={handleChangePin}
                    numInputs={4}
                    inputType= {pinIsHidden ? 'password' : 'number'}
                    containerStyle={{
                      display: 'flex',
                      width: '100%',
                      // backgroundColor: 'grey',
                      justifyContent: 'space-between',
                      columnGap: 15,
                    }}
                    inputStyle={{
                      width: '22%',
                      height: '2em',
                      fontWeight: '800',
                      fontSize: 22,
                      color: 'dimgrey',
                      borderRadius: 4,
                      border: '1px solid lightgrey',
                      backgroundColor: 'white',
                    }}
                    renderInput={(props) => <input {...props} />}
                  />    



                </div>

                
                <div className="flex justify-end w-full">
                  <button className="w-auto font-semibold text-primary text-[0.9em]" onClick={() => f7router.navigate('/forgot-password/')}>
                    <h6>Forgot PIN</h6>
                  </button>  
                </div>
          </div>
          </div>
          <div className="mt-2">
            {connectionStatus && (<div>
              <button onClick={handleSubmit} className="flex justify-center items-center w-full sm:h-[2.5em] h-[30px] rounded bg-primary">
                <h6 className="text-base font-semibold text-white">{loading ? '...loading' : 'Log In'}</h6>
              </button>
              <div className="flex justify-center mt-1">
                <div className="text-[0.95em]">  
                  <h6 className="w-auto font-semibold text-slate-500 sm:text-left text-center">Don't have an account yet? <button onClick={() => f7router.navigate('/signup/')}  className="w-auto text-primary font-semibold">Sign Up</button></h6>
                </div>
              </div>
            </div>)}
            {!connectionStatus && (
              <OfflinePanel f7router={f7router} />
             )
            }           
          </div>
        </div>
      </div>
    </Page>
  )
}
