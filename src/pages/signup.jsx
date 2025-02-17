import { f7, Page } from 'framework7-react'
import React, { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import { IoIosArrowDown } from 'react-icons/io'
import OTPInput from 'react-otp-input'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa'
import CryptoJS, { crypto } from 'crypto-js';
import axios from 'axios'
import store from '../js/store'
import { communityList } from '../config/constant'

export default function Signup({ f7router }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [communities, setCommunities] = useState([]);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinIsHidden, setPinIsHidden] = useState(true);
  const [confirmPinIsHidden, setConfirmPinIsHidden] = useState(true);
  

  const handleChangePin = (value) => {
    if(!isNaN(Number(value))){
      setPin(value);
    }
  }

  const handleChangeConfirmPin = (value) => {
    if(!isNaN(Number(value))){
      setConfirmPin(value);
    }
  }

  const initialState = {
    fullname: '',
    mobile:'',
    password:'',
    confirmpassword:'',
    deviceId:'',
    community:'',
  };

  const [userData, setUserData] = useState(initialState);

  const handleChange = (e) => {
    const {value, name} = e.target;
    if(name === 'confirmpassword' || name === 'password'){
      if(value.length <= 4){
        setUserData({...userData, [name]: value});
      }
    } else {
      setUserData({...userData, [name]: value});
    }
  };

  const saveToDevice = (dataObj) => {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const isDuplicate = existingUsers.some((user) => user.token === dataObj.token);
    if (isDuplicate) { return; }
    else {
      const updatedUsers = [...existingUsers, dataObj];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      console.log('registration complete');
      return;
    }
 };

  const registerUser = async (data) => {
    try {
      const response = await axios.post(
        'https://torux.app/api/signup',
        {...data}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const registerData = response.data;
      console.log('register Data', registerData);
      if(registerData.error){
        f7.dialog.alert(registerData.message,'');
      }else{
        f7router.navigate('/login/');
        f7.toast.show({
          text: 'Registration Completed Successfully',
          position: 'top',
          closeTimeout: 2000,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // setErrorMessage(error.code);
      f7.dialog.alert('Something went wrong. Please try again','');
    }
}

  const handleRegister = async () => {
    const { mobile, community } = userData;
    if(!mobile.trim() || !firstName.trim() || !lastName.trim() || !pin.trim() || !confirmPin.trim() || !community.trim()){
      f7.dialog.alert('Fields cannot be left empty','');
      return;
    }
    if(pin !== confirmPin) {
      f7.dialog.alert('PINs provided do not match','');
      return;
    }
    if(mobile.length !== 10) {
      f7.dialog.alert('Phone number must be 10 digits','');
      return;
    }
    if(pin.length !== 4 || confirmPin.length !== 4) {
      f7.dialog.alert('PINs must be 4 digits','');
      return;
    }
    else {
      const finalData = {
        fullname: `${firstName} ${lastName}`,
        mobile,
        password: pin,
        confirmpassword: confirmPin,
        deviceId:'',
        community,
        pin:true,
      };
      
      console.log('sign in finalData', finalData);
      
      setIsLoading(true);
      await registerUser(finalData);
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   fetchCommunities();
  // }, []);

  return (
    <Page name="login">
      <div className="w-full flex flex-col min-h-screen">
        <Navbar  title="Sign Up" goBack={true} f7router={f7router} menu={false} />
        <div className="flex-1 w-full p-5 flex flex-col bg-background-primary">
          <div>
            <div className="mb-5">
              <h4 className="font-bold text-lg text-primary">Create New Account</h4>
              <p className="font-semibold text-[0.95em]">Join the <span className="text-primary">TDX</span> aggregator community</p>
            </div>
            <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">First Name</label>
                  <div className="rounded w-full h-[2.5em] bg-white relative px-2 border border-slate-200">
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" type="text" className="rounded w-full h-full" />
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Last Name</label>
                  <div className="rounded w-full h-[2.5em] bg-white relative px-2 border border-slate-200">
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" type="text" className="rounded w-full h-full" />
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Phone Number</label>
                  <div className="rounded w-full h-[2.5em] bg-white relative px-2 border border-slate-200">
                    <input value={userData.mobile} onChange={handleChange} name="mobile" placeholder="Enter phone number" type="number" className="rounded w-full h-full" />
                  </div>
                </div>
                
              <div className="w-full">
                  <div className="w-full h-auto flex justify-between mb-1">
                    <label className="text-[0.9em] font-bold text-slate-600">PIN</label>
                    <button className="text-[0.9em] font-bold text-slate-400 w-auto" onClick={() => setPinIsHidden(!pinIsHidden)}>{pinIsHidden ? 'Show PIN' : 'Hide PIN'}</button>
                  </div>
                  
                  <OTPInput 
                    value={pin}
                    onChange={handleChangePin}
                    numInputs={4}
                    inputType={pinIsHidden ? 'password' : 'number'}
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

                <div className="w-full">
                  <div className="w-full h-auto flex justify-between mb-1">
                    <label className="text-[0.9em] font-bold text-slate-600">Confirm PIN</label>
                    <button className="text-[0.9em] font-bold text-slate-400 w-auto" onClick={() => setConfirmPinIsHidden(!confirmPinIsHidden)}>{confirmPinIsHidden ? 'Show PIN' : 'Hide PIN'}</button>
                  </div>
                  
                  <OTPInput 
                    value={confirmPin}
                    onChange={handleChangeConfirmPin}
                    numInputs={4}
                    inputType= {confirmPinIsHidden ? 'password' : 'number'}
                    containerStyle={{
                      display: 'flex',
                      width: '100%',
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

                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Community</label>
                  <div className="rounded bg-white h-[2.5em] w-full relative border border-slate-200">
                    <button className="w-[1.2em] h-[1.2em] flex justify-center items-center z-10 absolute top-[0.7em] right-[10px]">
                      <IoIosArrowDown />
                    </button>     
                  <select value={userData.community} onChange={handleChange} name="community" className="rounded px-3 h-full w-full">
                    <option value="">Select Community</option>
                    {communityList.map((community) => {
                      if(community.name){
                        return (<option key={community.id} value={community.id}>{community.name}</option>)
                     }
                    })}
                  </select> 
                </div>
              </div>
          </div>
          </div>
          <div className="mt-2">
            <button onClick={handleRegister} className="flex justify-center items-center w-full h-[2.5em] rounded bg-primary">
              <h6 className="text-base font-semibold text-white">{ isLoading ? '...loading' : 'Register' }</h6>
            </button>
            <div className="flex justify-center mt-1">
              <div className="text-[0.95em]">  
                <h6 className="w-auto font-semibold text-slate-500">Already have an account? <button onClick={() => f7router.navigate('/login/')} className="w-auto text-primary font-semibold">Log In</button></h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
