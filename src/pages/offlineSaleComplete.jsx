import React from 'react'
import { FaHeart } from "react-icons/fa";
import OfflineNavbar from '../components/offlineNavbar';
import { Page } from 'framework7-react';

export default function OfflineSaleComplete({ f7router }) {
  return (
    <Page name="home">
      <div className="relative w-full flex flex-col justify-between h-screen overflow-hidden">

        <OfflineNavbar  title="Sale Complete" f7router={f7router}/>

        <div className="flex-1 w-full p-5 flex flex-col justify-center items-center bg-background-primary">
          <div className="flex flex-col gap-y-2 justify-center items-center">
            <div className="flex justify-center">
              <FaHeart className="text-primary text-[4.5em]" />  
            </div> 
            <h6 className="text-center text-xl font-bold text-slate-600 w-[160px]">Sale Request Submitted!</h6>
            <p className="text-center text-semibold w-[240px]">You can complete your transaction when connect to the internet.</p>  
          </div>
        </div>
        <div className="px-5 pb-10">
          <button onClick={() => f7router.navigate('/offline-dashboard/') } className="flex justify-center items-center w-full sm:h-[3em] h-[35px] rounded bg-primary">
            <h6 className="text-base sm:text-lg font-semibold text-white">Back to Dashboard</h6>
          </button>
        </div>
      </div>
    </Page>
  )
}
