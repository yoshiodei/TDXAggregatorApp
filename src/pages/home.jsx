import React, {useEffect, useState} from 'react'
import FooterImg from '../assets/cultivating.png'
import { FaChevronRight } from 'react-icons/fa6'
import {
  Page
} from 'framework7-react';
import useConnection from '../hooks/useConnection';
import OfflinePanel from '../components/offlinePanel';

const HomePage = ({ f7router }) => {

  const {connectionStatus} = useConnection();

  return (<Page name="home"> 
  <div className="h-[100vh] w-[100vw] bg-primary p-2 sm:p-5 relative">
     <div className="mb-5 mt-[20px] sm:mt-[10vh] w-full text-font-light">  
       <h1 className="text-lg font-bold">Hi TDX Aggregator!</h1>
       <p>Use this platform to simplify the process of collecting commodities from farmers in your community.</p>
     </div>

     {connectionStatus && (<button
       onClick={() => f7router.navigate('/login/')}
       className="w-full h-[30px] sm:h-11 sm:p-[5px] p-[2px] rounded bg-primary-light text-font-light flex justify-between items-center px-5"
     >
       <h6 className="text-base font-bold">Get Started</h6>
       <FaChevronRight />
     </button>)}

     {!connectionStatus && (
       <OfflinePanel f7router={f7router} /> 
     )}

     <img 
       src={FooterImg}
       alt="footer"
       className="absolute z-10 bottom-0 w-[100vw] left-0"
     />
   </div>
 </Page>)
};
export default HomePage;