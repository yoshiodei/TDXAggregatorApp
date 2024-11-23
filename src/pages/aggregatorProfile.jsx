import React from 'react';
import {
    Page
} from 'framework7-react';
import Navbar from '../components/navbar';
import { LuUser2 } from "react-icons/lu";
import store from '../js/store';

export default function AggregatorProfile({ f7router }) {
  return (
    <Page name="home">
    <div className="w-full flex flex-col min-h-full">

      <Navbar  title="Aggregator Profile" goBack={false} f7router={f7router} menu={true}/>

      <div className="flex-1 w-full p-5 flex flex-col gap-y-5 bg-background-primary">
        <div className="sm:h-[100px] h-[60px] flex items-center justify-center">
          <div className="sm:w-[100px] sm:h-[100px] w-[60px] h-[60px] flex justify-center items-center rounded-lg border border-slate-200 bg-slate-200">
            <LuUser2 className="text-slate-500 text-[2.5em] sm:text-[4em]" />
          </div>
        </div>
        <div>
          <div>
            <h6 className="text-slate-500 sm:text-[1.1em] text-[0.9em] font-bold">Name</h6>
            <p className="font-semibold sm:text-[1.3em] text-[1em]">{`${store.state?.user?.firstname} ${store.state.user.lastname}`}</p>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-3" />
          <div>
            <h6 className="text-slate-500 text-[1.1em] text-[0.9em] font-bold">Date of Birth</h6>
            <p className="font-semibold sm:text-[1.3em] text-[1em]">{store.state?.user?.dOB || 'N/A'}</p>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-3" />
          <div>
            <h6 className="text-slate-500 text-[1.1em] text-[0.9em] font-bold">Address</h6>
            <p className="font-semibold sm:text-[1.3em] text-[1em]">{store.state?.user?.address || 'N/A'}</p>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-3" />
          <div>
            <h6 className="text-slate-500 text-[1.1em] text-[0.9em] font-bold">Phone Number</h6>
            <p className="font-semibold sm:text-[1.3em] text-[1em]">{store.state?.user?.mobile || 'N/A'}</p>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-3" />
          <div>
            <h6 className="text-slate-500 text-[1.1em] text-[0.9em] font-bold">Alt Phone Number</h6>
            <p className="font-semibold sm:text-[1.3em] text-[1em]">{store.state?.user?.altrnumber || 'N/A'}</p>
          </div>
        </div>  
      </div>
    </div>
  </Page>
  )
}
