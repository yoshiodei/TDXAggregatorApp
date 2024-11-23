import React, { useState } from 'react'
import Navbar from '../components/navbar'
import { Page } from 'framework7-react'
import { RxCross2 } from "react-icons/rx";
import OrderListItem from '../components/orderListItem';


export default function OrderStatus({ f7router }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);  

    return (
    <Page name="home">
    <div className="relative w-full flex flex-col h-screen overflow-hidden">

      <Navbar  title="Order Status" goBack={false} f7router={f7router}/>

      <div className="flex-1 w-full p-5 flex flex-col justify-between gap-y-5 bg-background-primary">
        
        <div className="flex flex-col gap-y-1 h-auto text-white" >
          <div className="flex justify-between items-center">
            <h6 className="text-slate-400  font-bold">Farmer</h6>
            <h6 className="text-slate-800  font-semibold">John Doe</h6>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-2" />
          <div className="flex justify-between items-center">
            <h6 className="text-slate-400  font-bold">Order Id</h6>
            <h6 className="text-slate-800  font-semibold">DFTK6374903</h6>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-2" />
          <div className="flex justify-between items-center">
            <h6 className="text-slate-400  font-bold">Quantity</h6>
            <h6 className="text-slate-800  font-semibold">490</h6>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-2" />
          <div className="flex justify-between items-center">
            <h6 className="text-slate-400  font-bold">Total Cost</h6>
            <h6 className="text-slate-800  font-semibold">₵ 14,780</h6>
          </div>
          <div className="w-full h-[1px] bg-slate-300 my-2" />
          <div className="w-full mt-5">
            <button onClick={() => f7router.navigate('/dashboard/') } className="w-full rounded flex justify-center items-center h-[2.5em] bg-primary text-white text-lg font-semibold">
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-[5vh]">
          <button onClick={() => setIsPopupOpen(true)} className="h-[2.8em] w-auto px-5 rounded-full bg-green-300 text-primary flex justify-center items-center">
            <h5 className="font-bold">View Order Status</h5>
          </button>    
        </div>

      </div>

      <button
        onClick={() => setIsPopupOpen(false)}
        className={`absolute z-10 h-[50vh] w-screen ${ isPopupOpen? 'top-[0px] opacity-50' : 'top-[-55vh] opacity-0'} bg-black transition-opacity duration-300`}
      />

      <div
        className={`absolute z-20 left-[0px] right-[0px] ${ isPopupOpen? 'top-[20vh]' : 'top-[96vh]' } w-screen h-[85vh] p-3 bg-slate-900 rounded-t-3xl transition-all`}
      >
        <div className="h-[5px] w-full flex justify-center">
          <div className="h-full w-[45px] rounded-full bg-slate-500" />
        </div>
        <div className="relative flex justify-center items-center h-[4em]">
          <h5 className="text-lg font-semibold text-white">Order List</h5>
          <button onClick={() => setIsPopupOpen(false)} className="flex justify-center items-center bg-slate-800 w-[30px] h-[30px] rounded-full absolute z-30 right-[5px] top-[13px]">
            <RxCross2 className="text-[22px] text-white" />
          </button>
        </div>
        <div className="pt-3 px-3 pb-[7em] h-full overflow-scroll flex flex-col gap-y-3 ">

          <OrderListItem />
          <OrderListItem />
          <OrderListItem />
          <OrderListItem />
          <OrderListItem />
          <OrderListItem />

        </div>
      </div>

      
           

    </div>
 
    
      
      </Page>
  )
}
