import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { IoFilter } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import {
    Page, Block, Popup, BlockTitle, Button
  } from 'framework7-react';

export default function Farmers({ f7router }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [commodityValue, setCommodityValue] = useState("");

  return (
    <Page name="home">
      <div className="relative w-full flex flex-col h-screen overflow-hidden">
        <Navbar  title="Farmers" goBack={false} f7router={f7router}/>
        <div className="flex-1 w-full flex flex-col justify-between bg-background-primary">
          <div className="h-[6em] px-5 flex flex-col gap-y-1 justify-center">
            <div className="h-[1.5em] flex justify-between items-center">
              <h6 className="font-bold">All Farmers</h6>
              <div className="flex gap-x-1">
                <h6 className="font-bold">Filter</h6>
                <IoFilter className="text-[1.2em]" />
              </div>  
            </div>
            <div className="h-[2.5em] relative bg-white border border-slate-200 rounded ps-2 pe-[50px]">
              <IoSearch className="absolute z-10 top top-[0.5em] right-[10px] text-[1.1em]" />
              <input placeholder="Search Farmer" className="w-full h-full rounded" />  
            </div>
          </div>    
          <div className="min-h-full overflow-scroll border-t border-slate-200 bg-white">
          </div>  
        </div>
      </div>  
    </Page>
  )
}
