import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import {
    Page,
  } from 'framework7-react';

export default function PaymentDetails({ f7router }) {
  const [buttonChecked, setButtonChecked] = useState(false);
  const [numberToPayTo, setNumberToPayTo] = useState("same number");

  return (
    <Page name="home">
    <div className="relative w-full flex flex-col h-screen overflow-hidden">

      <Navbar  title="Sell to TDX" goBack={true} f7router={f7router}/>

      <div className="bg-slate-900 flex justify-between items-center h-[5em] px-5">
        <div className="flex gap-x-3">
          <div className="w-[40px] h-[40px] bg-slate-800 rounded-full" />
          <div>
            <h6 className="font-bold text-white">Yellow maize</h6>  
            <h6 className="text-primary font-semibold">24 bags, 2400 KG</h6>  
          </div>
        </div>
        <div>
          <h6 className="font-bold text-white">₵ 64,800</h6>    
        </div>
      </div>

      <div className="h-[5em] flex justify-center items-center" style={{ backgroundColor: "#C5EBBD" }}>
        <div>
          <h6 className="text-[0.95em] text-center">Payment for</h6>
          <h6 className="text-[1.1em] text-center font-bold">Ebo Taylor</h6>
        </div>
      </div>

      <div className="flex-1 w-full p-5 flex flex-col justify-between gap-y-5 bg-background-primary">
        <div>
          <div>
            <h6 className="font-bold text-lg">Payment detail</h6>
          </div>

          <div className="flex flex-col items-center gap-3 mb-3 w-full">
            <div className="w-full">
                <label className="text-[0.9em] font-bold text-slate-600 mb-1">Pay to</label>
                <div className="rounded bg-white h-[2.5em] w-full relative border border-slate-200">
                <div className="w-[1.2em] h-[1.2em] flex justify-center items-center z-10 absolute top-[0.7em] right-[10px]">
                <IoIosArrowDown />
                </div>     
                <select className="rounded px-3 h-full w-full" onChange={(e) => setNumberToPayTo(e.target.value)}>
                  <option value="same number">Farmer's Momo Number</option>
                  <option value="different number">Different Momo number</option>
                </select> 
                </div>
            </div>
            <div className="w-full">   
              {(numberToPayTo === "same number" ) && (<div className="flex flex-col gap-y-3">
                <div className="w-full">
                    <label className="text-[0.9em] font-bold text-slate-600 mb-1">Name</label>
                    <div className="rounded w-full h-[2.5em] bg-slate-300 relative px-2">
                    <input readOnly={true} value="Ebo Taylor" className="bg-slate-300 text-slate-700 rounded w-full h-full font-semibold" />
                    </div>
                </div>
                <div className="w-full">
                    <label className="text-[0.9em] font-bold text-slate-600 mb-1">Momo phone number</label>
                    <div className="rounded w-full h-[2.5em] bg-slate-300 relative px-2">
                    <input readOnly={true} value="+233244419419" className="bg-slate-300 text-slate-700 rounded w-full h-full font-semibold" />
                    </div>
                </div>
              </div>)}
                
              {(numberToPayTo === "different number" ) && (<div className="flex flex-col gap-y-3">
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">
                    Name
                  </label>
                  <div className="rounded w-full h-[2.5em] relative px-2 bg-white border border-slate-200">
                    <input placeholder="Enter full name" className=" rounded w-full h-full" />
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-[0.9em] font-bold text-slate-600 mb-1">Momo phone number</label>
                  <div className="rounded w-full h-[2.5em] bg-white relative pe-2 ps-[50px] border border-slate-200">
                  <h6 className="absolute top-[0.5em] left-[10px] font-semibold">+233</h6>
                   <input min={0} placeholder="Enter phone number" type="number" className="rounded w-full h-full" />
                </div>
            </div>
              </div>)}
            </div>
          </div>

          <div className="flex gap-x-2 px-2 my-[30px] items-center">
            <button onClick={() => setButtonChecked(!buttonChecked)} className={`w-[28px] h-[28px] rounded-md flex justify-center items-center ${buttonChecked ? 'bg-primary text-white border border-primary' : 'border border-slate-300 bg-white text-slate-100'}`}>
              <FaCheck />
            </button>
            <p className="leading-tight flex-1">I confirm that the information provided is accurate.</p>
          </div>

          <div className="mt-5">
            <button onClick={() => f7router.navigate('/sale-complete/') } className="flex justify-center items-center w-full h-[3em] rounded bg-primary">
              <h6 className="text-lg font-semibold text-white">Continue</h6>
            </button>
          </div>
        </div>

      </div>

    </div>
      </Page>
  )
}
