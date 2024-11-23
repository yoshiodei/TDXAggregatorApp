import { Page } from 'framework7-react'
import React, { useState } from 'react'
import Navbar from '../components/navbar'

export default function ForgotPassword({ f7router }) {
  return (
    <Page name="login">
      <div className="w-full flex flex-col min-h-screen">
        <Navbar  title="Forgot Password" goBack={true} f7router={f7router} menu={false} />
        <div className="flex-1 w-full p-5 flex flex-col bg-background-primary">
          <div>
            <div className="mb-5">
              <h4 className="font-bold text-lg text-primary">Forgot Password?</h4>
            </div>
            <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Phone</label>
                  <div className="rounded w-full h-[2.5em] bg-white relative px-2 border border-slate-200">
                    <input min={0} placeholder="Enter phone number" type="number" className="rounded w-full h-full" />
                  </div>
                </div>
            </div>
          </div>
          <div className="mt-2">
            <button onClick={() => f7router.navigate('/dashboard/') } className="flex justify-center items-center w-full h-[2.5em] rounded bg-primary">
              <h6 className="text-base font-semibold text-white">Submit</h6>
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
