import React from 'react'
import { FaHeart } from "react-icons/fa";
import Navbar from '../components/navbar';
import { Page } from 'framework7-react';

export default function SaleComplete({ f7router }) {
  return (
    <Page name="home">
      <div className="relative w-full flex flex-col justify-between h-screen overflow-hidden">

        <Navbar  title="Sale Complete" f7router={f7router}/>

        <div className="flex-1 w-full p-5 flex flex-col justify-center items-center bg-background-primary">
          <div className="flex flex-col gap-y-2 justify-center items-center">
            <div className="flex justify-center">
              <FaHeart className="text-primary text-[4.5em]" />  
            </div> 
            <h6 className="text-center text-xl font-bold text-slate-600 w-[160px]">Thank you for selling to TDX!</h6>
            <p className="text-center text-semibold w-[240px]">We'll process your sales order as soon as possible. We will keep you updated on the progress through the app.</p>  
          </div>
        </div>
        <div className="px-5 pb-10">
          <button onClick={() => f7router.navigate('/dashboard/') } className="flex justify-center items-center w-full h-[3em] rounded bg-primary">
            <h6 className="text-lg font-semibold text-white">Back to Dashboard</h6>
          </button>
        </div>
      </div>
    </Page>
  )
}
