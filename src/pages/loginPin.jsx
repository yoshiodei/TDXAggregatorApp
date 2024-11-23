import React, { useState } from 'react'
import OTPInput from 'react-otp-input'
import {
    Page,
  } from 'framework7-react';
import Navbar from '../components/navbar';

export default function LoginPin({ f7router }) {
  const [pin, setPin] = useState('');

  const handleOTPChange = (value) => {
    setPin(value);
  };

  return (
    <Page name="verifyOTP">
      <div className="h-[100vh] w-[100vw] relative bg-background-primary">
        <Navbar title="Offline Log In" />
        <div className="p-5">
        <h1 className="text-lg font-bold mt-6">Enter Your Pin to Login</h1>
        <div className="mt-3">
          <h6 className="font-semibold">Enter code</h6>
          <div className="rounded w-full h-auto my-1">
            <OTPInput 
              value={pin}
              onChange={handleOTPChange}
              numInputs={4}
              inputType="number"
              containerStyle={{
                display: 'flex',
                justifyContent: 'space-between',
                columnGap: 15,
              }}
              inputStyle={{
                width: '25%',
                height: 60,
                fontWeight: '800',
                fontSize: 22,
                color: 'dimgrey',
                borderRadius: 4,
                border: '1px solid lightgrey',
              }}
              renderInput={(props) => <input {...props} />}
            />
          </div>

          <div className="w-full flex flex-col gap-y-3 mt-5">
            <button
              //   onClick={() => handleVerify()}
              className="w-full h-[2.5em] rounded bg-primary text-white flex justify-center items-center px-5"
            >
              <h6 className="text-base font-bold">Log In</h6>
            </button>
            <button onClick={() => f7router.navigate('/set-pin/')}>
              <h6 className="underline font-semibold text-primary">Set new PIN</h6>    
            </button>
          </div>
        </div>
        </div>
      </div>
    </Page>
  )
}
