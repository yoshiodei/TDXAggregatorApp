import { f7, Page } from 'framework7-react'
import Navbar from '../components/navbar'
import React, { useState } from 'react'
import OTPInput from 'react-otp-input'
import axios from 'axios';

export default function ForgotPassword({ f7router }) {
  const initialState = {
    phone: '',
    pin: '',
    confirmPin: '',
  };

  const [isLoading, setIsLoading] = useState(false);
  const [resetData, setResetData] = useState(initialState);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otp, setOTP] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otpIsHidden, setOtpIsHidden] = useState(true);
  const [pinIsHidden, setPinIsHidden] = useState(true);
  const [confirmPinIsHidden, setConfirmPinIsHidden] = useState(true);

  const handleChangeOTP = (value) => {
    if(!isNaN(Number(value))){
      setOTP(value);
    }
  }
  
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

  const handleVerifyOTP = async () => {
    if(!otp || !pin || !confirmPin){
      f7.dialog.alert('All fields must be filled','');
      return;
    }
    if(otp.length !== 4 || pin.length !== 4 || confirmPin.length !== 4){
      f7.dialog.alert('Fields must have 4 digits','');
      return;
    }
    if(pin !== confirmPin){
      f7.dialog.alert('PINs entered do not match','');
      return;
    } else {
      try {
        const response = await axios.post(
          `https://torux.app/api/resetpassword/${otp}`,
          {
            mobile: resetData.phone,
            password: pin,
            confirmpassword: confirmPin
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const resetPinStatus = response.data;
        if(!resetPinStatus.error){
          f7router.navigate('/login/');
          f7.toast.show({
            text: 'PIN reset successful',
            position: 'top',
            closeTimeout: 2000,
          });
        } else {
          console.log('reset data', resetPinStatus);
          f7.dialog.alert(resetPinStatus.message, '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        f7.dialog.alert('Something went wrong. Please try again','');
      } 
    }
  };

  const handleVerifyNumber = async () => {
    if(resetData.phone.trim().length !== 10){
      f7.dialog.alert('Phone number must be 10 digits','');
      return;
    } else {
      try {
        const response = await axios.post(
          `https://torux.app/api/resetpassword`,
          {
            mobile: resetData.phone,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const resetStatus = response.data;
        if(!resetStatus.error){
          setIsOTPSent(true);
          f7.toast.show({
            text: 'OTP has been sent to your phone',
            position: 'top',
            closeTimeout: 2000,
          });
        } else {
          setIsOTPSent(false);
          console.log('reset data', resetStatus);
          f7.dialog.alert(resetStatus.message, '');
        }
      } catch (error) {
        setIsOTPSent(false);
        console.error('Error fetching data:', error);
        f7.dialog.alert('Something went wrong. Please try again','');
      } 
    }
  }

  const handleLoadVerification = async () => {
    setIsLoading(true);
    await handleVerifyNumber();
    setIsLoading(false);
  }

  const resetPin = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/resetpassword/0000`,
        {
          mobile: resetData.phone,
          password: resetData.pin,
          confirmpassword: resetData.confirmPin,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const resetStatus = response.data;
      if(!resetStatus.error){
        
        f7router.navigate('/login/');

        f7.toast.show({
          text: 'PIN reset successful!',
          position: 'top',
          closeTimeout: 2000,
        });

      } else {
        console.log('reset data', resetStatus);
        f7.dialog.alert(resetStatus.message, '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // setErrorMessage(error.code);
      f7.dialog.alert('Unable to fetch data','');
    }
  }

  const handleSubmit = async () => {
    const {phone, pin, confirmPin} = resetData;
    if(!phone || !pin || !confirmPin){
      f7.dialog.alert('Fields cannot be left','');
      return;
    }
    if(phone.length !== 10){
      f7.dialog.alert('Phone number must be 10 digits','');
      return;
    }
    if(pin.length !== 4 || confirmPin.length !== 4){
      f7.dialog.alert('PIN must be 4 digits','');
      return;
    }
    if(pin !== confirmPin){
      f7.dialog.alert('PINs do not match','');
      return;
    }
    else {
      setIsLoading(true);
      await resetPin();
      setIsLoading(false);
    }
  }

  const handleOnchange = (e) => {
    const {value, name} = e.target;
    if(name === 'pin' || name === 'confirmPin'){
      if(value.length <= 4){
        setResetData({...resetData, [name]:value});
      }
    } else {
      setResetData({...resetData, [name]:value});
    }
  }

  const loadOTPVerification = async () => {
    setIsLoading(true);
    await handleVerifyOTP();
    setIsLoading(false);
  }

  return (
    <Page name="login">
      <div className="w-full flex flex-col min-h-screen">
        <Navbar  title="Reset PIN" goBack={true} f7router={f7router} menu={false} />
        <div className="flex-1 w-full p-5 flex flex-col bg-background-primary">
          <div>
            <div className="mb-5">
              <h4 className="font-bold text-lg text-primary">Reset PIN?</h4>
            </div>
            <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Phone</label>
                  <div className={`rounded w-full h-[2.5em] ${isOTPSent ? 'bg-slate-100' :'bg-white'} relative px-2 border border-slate-200`}>
                    <input readOnly={isOTPSent} onChange={handleOnchange} value={resetData.phone} name="phone" min={0} placeholder="Enter phone number" type="number" className="rounded w-full h-full" />
                  </div>
                </div>
            </div>
            {isOTPSent && (<div>
            <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="w-full">
                  <div className="w-full h-auto flex justify-between mb-1">
                    <label className="text-[0.9em] font-bold text-slate-600">Verify OTP</label>
                    <button className="text-[0.9em] font-bold text-slate-400 w-auto" onClick={() => setOtpIsHidden(!otpIsHidden)}>{otpIsHidden ? 'Show OTP' : 'Hide OTP'}</button>
                  </div>
                  <OTPInput 
                    value={otp}
                    onChange={handleChangeOTP}
                    numInputs={4}
                    inputType={otpIsHidden ? 'password' : 'number'}
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
            </div>
            <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="w-full">
                  <div className="w-full h-auto flex justify-between mb-1">
                    <label className="text-[0.9em] font-bold text-slate-600">new PIN</label>
                    <button className="text-[0.9em] font-bold text-slate-400 w-auto" onClick={() => setPinIsHidden(!pinIsHidden)}>{pinIsHidden ? 'Show PIN' : 'Hide PIN'}</button>
                  </div>
                  
                  <OTPInput 
                    value={pin}
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
            </div>
            <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="w-full">
                  {/* <label className="text-[0.9em] font-bold text-slate-600 mb-1">Confirm PIN</label> */}
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
            </div>
            </div>)}
          </div>
          {
            isOTPSent &&
            (
              <div className="mt-2">
                <button onClick={ loadOTPVerification } className="flex justify-center items-center w-full h-[2.5em] rounded bg-primary">
                  <h6 className="text-base font-semibold text-white">{isLoading ? '...loading' : 'Reset PIN'}</h6>
                </button>
                <div className="flex justify-center mt-1">
                  <div className="text-[0.95em]">  
                    <h6 className="w-auto font-semibold text-slate-500"><button onClick={() => setIsOTPSent(false)} className="w-auto text-primary font-semibold">Edit Number</button></h6>
                  </div>
                </div>
              </div>
            )
          }
          {
           !isOTPSent && (
              <div className="mt-2">
                <button onClick={handleLoadVerification} className="flex justify-center items-center w-full h-[2.5em] rounded bg-primary">
                  <h6 className="text-base font-semibold text-white">{isLoading ? '...loading' : 'Verify Number'}</h6>
                </button>
                <div className="flex justify-center mt-1">
                  <div className="text-[0.95em]">  
                    <h6 className="w-auto font-semibold text-slate-500">Already have an account? <button onClick={() => f7router.navigate('/login/')} className="w-auto text-primary font-semibold">Log In</button></h6>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </Page>
  )
}
