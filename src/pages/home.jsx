import React, {useEffect, useState} from 'react'
import FooterImg from '../assets/cultivating.png'
import { FaChevronRight } from 'react-icons/fa6'
import { MdCloudOff } from 'react-icons/md'
import {
  Page
} from 'framework7-react';

const HomePage = ({ f7router }) => {

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [time, setTime] = useState('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [time]);

  return (<Page name="home"> 
  <div className="h-[100vh] w-[100vw] bg-primary p-2 sm:p-5 relative">
     <div className="mb-5 mt-[20px] sm:mt-[10vh] w-full text-font-light">  
       <h1 className="text-lg font-bold">Hi TDX Aggregator!</h1>
       <p>Use this platform to simplify the process of collecting commodities from farmers in your community.</p>
     </div>

     {(isOnline === true) && (<button
       onClick={() => f7router.navigate('/login/')}
       // onClick={() => f7router.navigate('/test/')}
       className="w-full h-[30px] sm:h-11 sm:p-[5px] p-[2px] rounded bg-primary-light text-font-light flex justify-between items-center px-5"
     >
       <h6 className="text-base font-bold">Get Started</h6>
       <FaChevronRight />
     </button>)}

     {(isOnline === false) && (<div className="rounded border border-slate-300 bg-slate-200 sm:p-2 p-1">
        <div className="flex flex-col items-center justify-center text-slate-400 sm:mb-2 mb-1">
          <MdCloudOff className="sm:text-[2.5em] text-[1.5em]" />
          <h6 className="sm:text-base text-[0.9em] font-semibold text-center">You are offline</h6>
        </div>
        <button
          onClick={() => f7router.navigate('/offline-login/')}
          className="flex justify-center items-center w-full sm:h-[2.5em] h-[1.8em] rounded bg-slate-300">
          <h6 className="text-base font-semibold text-slate-500">Continue Offline</h6>
        </button>
      </div>)}

     <img 
       src={FooterImg}
       alt="footer"
       className="absolute z-10 bottom-0 w-[100vw] left-0"
     />
   </div>
 </Page>)
};
export default HomePage;