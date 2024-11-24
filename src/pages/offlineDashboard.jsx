import React,{useState, useEffect} from 'react'
import {
  Page
} from 'framework7-react'
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago' 
import en from 'javascript-time-ago/locale/en'
import Navbar from '../components/navbar'
import bagIcon from '../assets/bag-icon.png'
import scaleIcon from '../assets/scale-icon.png'
import farmerIcon from '../assets/farmer-icon.png'
import store from '../js/store'
import { MdCloudOff } from 'react-icons/md'

export default function OfflineDashboard({ f7router }) {
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

  TimeAgo.addLocale(en);

  return (
    <Page name="home">
    <div className="w-full flex flex-col min-h-full">
      <div className="bg-red-500 text-white flex items-center justify-center p-1 text-[0.9em] gap-x-1">
        <MdCloudOff  />
        <p className=" text-semibold">You are offline</p>
      </div>
      <Navbar  title="Dashboard" goBack={false} f7router={f7router}/>
      <div className="flex-1 w-full sm:p-5 p-3 flex flex-col gap-y-5 bg-background-primary">
        <div>
          <h1 className="font-bold mb-2">Hello, {store.state?.offlineUser?.firstname}</h1>
          <div className="p-3 rounded-lg bg-primary text-white">
            {(store.state?.offlineUser?.last_synced) && (<p className="text-[0.9em] text-right mb-1">
              Last updated 
              {' '}
              <ReactTimeAgo date={new Date(store.state?.offlineUser?.last_synced)} locale="en-US"/>
            </p>)}
            <h2 className="text-[1.5em] sm:text-[2em] font-bold leading-tight">{`Ghc ${store.state?.offlineUser?.account_balance || 'N/A'}`}</h2>
            <h5 className="text-[0.95em] sm:text-[1.1em] font-semi-bold leading-tight">Available Balance</h5>
            {/* <div className="flex justify-end">
              <button onClick={() => setTime(new Date().getMilliseconds())} className="flex justify-center items-center rounded-full bg-green-600 w-[1.6em] h-[1.6em]">
                <MdOutlineRefresh className="text-[1.45em]" />
              </button>
            </div> */}
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-y-14">
          <div className="flex flex-col gap-y-3">

            <div className="h-[60px] rounded bg-white p-[5px] flex justify-between gap-x-2">
              <div className="w-[50px] h-[50px] p-[8px] rounded bg-slate-300 flex justify-center items-center">
              <img src={farmerIcon} alt='bag icon' className='w-full h-full' />
              </div>  
              <div className="flex-1 flex items-center">
                <div>
                  <h6 className="text-[0.85em] font-semibold">Total farmers onboarded</h6>
                  <h4 className="font-semibold">{store.state?.offlineUser?.total_users}</h4>
                </div>  
              </div>  
              <div className="flex items-center">
                {/* <button className="bg-primary rounded-full text-white py-[1px] px-3 text-[0.85em] font-semibold">
                  View
                </button> */}
              </div>  
            </div>  

            <div className="h-[60px] rounded bg-white p-[5px] flex justify-between gap-x-2">
              <div className="w-[50px] h-[50px] p-[12px] rounded bg-slate-300 flex justify-center items-center">
                <img src={bagIcon} alt='bag icon' className='w-full h-full' />
              </div>  
              <div className="flex-1 flex items-center">
                <div>
                  <h6 className="text-[0.85em] font-semibold">Total cash transaction</h6>
                  <h4 className="font-semibold">{store.state?.offlineUser?.total_cost}</h4>
                </div>  
              </div>  
              <div className="flex items-center">
                {/* <button className="bg-primary rounded-full text-white py-[1px] px-3 text-[0.85em] font-semibold">
                  View
                </button> */}
              </div>  
            </div>

            <div className="h-[60px] rounded bg-white p-[5px] flex justify-between gap-x-2">
              <div className="w-[50px] p-[12px] h-[50px] rounded bg-slate-300 flex justify-center items-center">
                <img src={scaleIcon} alt='bag icon' className='w-full h-full' />
              </div>  
              <div className="flex-1 flex items-center">
                <div>
                  <h6 className="text-[0.85em] font-semibold">Total quantities sold</h6>
                  <h4 className="font-semibold">{store.state?.offlineUser?.total_quantity}</h4>
                </div>  
              </div>  
              <div className="flex items-center">
                {/* <button className="bg-primary rounded-full text-white py-[1px] px-3 text-[0.85em] font-semibold">
                  View
                </button> */}
              </div>  
            </div>
              
          </div>

          <div className="flex flex-col gap-y-2 mb-3">
            <button onClick={() => f7router.navigate('/sell-to-tdx-offline/')} className="rounded bg-primary h-[30px] sm:h-[3.5em] flex justify-center items-center">
              <h6 className="text-white font-bold">Sell to TDX</h6>
            </button>
            {(isOnline) && (<button onClick={() => f7router.navigate('/login/')} className="rounded bg-white border-2 border-primary h-[30px] sm:h-[3.5em] flex justify-center items-center">
              <h6 className="font-bold text-primary">Switch to online mode</h6>
            </button>)}
          </div>

        </div>

      </div>
    </div>
  </Page>
  )
}
