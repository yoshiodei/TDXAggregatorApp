import React, { useState } from 'react'
import {
    Page,
  } from 'framework7-react';
import Navbar from '../components/navbar';

export default function SetPin({ f7router }) {
  const [pin, setPin] = useState('');

  const handleOTPChange = (value) => {
    setPin(value);
  };

  return (
    <Page name="setPIN">
      <div className="h-[100vh] w-[100vw] relative bg-background-primary">
        <Navbar title="Set PIN" />
        <div className="p-5">
        <h1 className="text-lg font-bold mt-6">Enter Your Pin to Login</h1>
        <div className="mt-3">
          <h6 className="">This PIN will be used to access your account in offline mode.</h6>
          <div className="flex flex-col gap-y-3">
            <div>
              <label className="mb-2">PIN (4 digit)</label>
              <input maxLength={4} type="number" className="h-[2.5em] w-full rounded border border-slate-300 px-5" />    
            </div>
            <div>
              <label className="mb-2">Confirm PIN</label>
              <input maxLength={4} type="number" className="h-[2.5em] w-full rounded border border-slate-300 px-5" />    
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-3 mt-5">
            <button
              //   onClick={() => handleVerify()}
              className="w-full h-[2.5em] rounded bg-primary text-white flex justify-center items-center px-5"
            >
              <h6 className="text-base font-bold">Set new PIN</h6>
            </button>
          </div>
        </div>
        </div>
      </div>
    </Page>
  )
}

