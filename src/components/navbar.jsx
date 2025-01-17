import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';
import { GrUserSettings } from 'react-icons/gr';
import { IoPricetagsOutline } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import { IoStatsChart } from 'react-icons/io5';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import { IoIosSettings } from 'react-icons/io';
import { MdPendingActions } from "react-icons/md";
import { ImSwitch } from 'react-icons/im';
import { ImUser } from 'react-icons/im';
import { AiFillDashboard } from "react-icons/ai";
import FooterImg from '../assets/cultivating.png';
import { AiOutlineFileDone } from "react-icons/ai";
import {
    Page,
    Popup,
    BlockTitle,
    Block,
    NavRight,
    Link,
    Button,
    View,
    f7,
  } from 'framework7-react';
import store from '../js/store';
import useConnection from '../hooks/useConnection';
import OfflinePanel from './offlinePanel';
  

export default function Navbar({f7router, goBack, title, menu}) {
  const [popupOpened, setPopupOpened] = useState(false);

  const {connectionStatus} = useConnection();
  
  const navigate = (path) => {
    f7router.navigate(path);
    setPopupOpened(false);
  }

  const handleLogout = () => {
    store.dispatch('resetState');
    setPopupOpened(false);
    f7router.navigate('/');
  };

  const showLogoutDialog = () => {
    f7.dialog.confirm(
      'Are you sure you want to log out?',
      'Confirm Logout',
      () => {
        handleLogout();
      },
      () => {
        f7.toast.show({
          text: 'Logout canceled',
          position: 'top',
          closeTimeout: 2000,
        });
      }
    );
  };

  return (
    <>
    <div className="sm:px-5 px-3 flex items-center justify-between bg-white h-[40px] sm:h-[60px] w-screen">
        {goBack && (<button
          className="flex items-center w-auto h-auto"
          onClick={() => f7router.back() }
        >
          <FaChevronLeft className="sm:text-[1.2em] text-[0.95em]" />
        </button>)}
        {!goBack && (<div className="sm:w-[1.2em] sm:h-[1.2em] w-[0.95em] h-[0.95em]" />)}
        <h1 className="text-base sm:text-lg font-bold">{title}</h1>
        { menu ? (<button
          className="flex items-center w-auto h-auto"
          onClick={() => setPopupOpened(true)}
        >
          <GiHamburgerMenu className="sm:text-[1.5em] text-[1.25em] text-primary-dark" />
        </button>) :
        (<div className="sm:w-[1.2em] sm:h-[1.2em] w-[0.95em] h-[0.95em]" />)
        }
      </div>

      <Popup
        className="demo-popup"
        opened={popupOpened}
        onPopupClosed={() => setPopupOpened(false)}
      >
        <Page>
          {/* <Link popupClose>Close</Link> */}
          <div className="bg-primary min-h-screen relative pb-[200px]">
            <div className="p-5">
              <div className="h-[60px] flex justify-between items-center text-white">
                <button
                  className="w-auto h-auto flex gap-x-2 items-center" 
                  onClick={() => setPopupOpened(false)}
                >
                  <h6 className="font-semibold text-white text-[1.25em]">Close</h6>
                  <IoClose className="text-white text-[1.8em] font-bold" />
                </button>
                <button
                  onClick={() => navigate('/aggregator-profile/')}
                  className="flex w-auto h-[1.7em] items-center gap-x-1 px-[10px] py-[5px] rounded-full bg-green-600 text-white"
                >
                  <GrUserSettings className="text-[0.85em]" />
                  <div className="w-[1px] h-full bg-white" />
                  <h6 className="text-[0.85em] font-semibold">Profile</h6>
                </button>
              </div>

              {connectionStatus && (<div>
                <button
                  onClick={() => navigate('/dashboard/')}
                  className="flex justify-between items-center h-[38px] sm:h-[65px]"
                >
                  <div className="flex items-center h-full text-white">
                    <AiFillDashboard className="text-[1.2em] sm:text-[1.8em] sm:me-8 me-4 text-primary-light" />
                    <h4 className="font-semibold sm:text-[1.4em] text-[1em]">Dashboard</h4>
                  </div>
                  <FaChevronRight className="sm:text-[1.4em] text-[1em] text-white" />
                </button>
                <div className="h-[1px] w-full bg-green-200" />
                <button
                  onClick={() => navigate('/sell-to-tdx/')} 
                  className="flex justify-between items-center h-[38px] sm:h-[65px]"
                >
                  <div className="flex items-center h-full text-white">
                    <BsArrowRightCircleFill className="text-[1.2em] sm:text-[1.8em] sm:me-8 me-4 text-primary-light" />
                    <h4 className="font-semibold sm:text-[1.4em] text-[1em]">Sell to TDX</h4>
                  </div>
                  <FaChevronRight className="sm:text-[1.4em] text-[1em] text-white" />
                </button>
                <div className="h-[1px] w-full bg-green-200" />
                <button
                  onClick={() => navigate('/submitted-transactions/')}  
                  className="flex justify-between items-center h-[38px] sm:h-[65px]"
                >
                  <div className="flex items-center h-full text-white">
                    <AiOutlineFileDone className="text-[1.2em] sm:text-[1.8em] sm:me-8 me-4 text-primary-light" />
                    <h4 className="font-semibold sm:text-[1.4em] text-[1em]">Submitted Transactions</h4>
                  </div>
                  <FaChevronRight className="sm:text-[1.4em] text-[1em] text-white" />
                </button>
                <div className="h-[1px] w-full bg-green-200" />
                <button
                  onClick={() => navigate('/pending-transactions/')}  
                  className="flex justify-between items-center h-[38px] sm:h-[65px]"
                >
                  <div className="flex items-center h-full text-white">
                    <MdPendingActions className="text-[1.2em] sm:text-[1.8em] sm:me-8 me-4 text-primary-light" />
                    <h4 className="font-semibold sm:text-[1.4em] text-[1em]">Pending Transactions</h4>
                  </div>
                  <FaChevronRight className="sm:text-[1.4em] text-[1em] text-white" />
                </button>
              </div>)}

              {
                !connectionStatus && (
                  <OfflinePanel f7router={f7router} />
                )
              }

              <div className="mt-10">
                <button onClick={showLogoutDialog} className=" w-auto sm:h-[35px] h-[25px] flex text-white gap-x-2 items-center bg-green-600 rounded-full px-4">
                  <ImSwitch className="text-[0.95em] sm:text-[1.2em]" />    
                  <h6 className="font-semibold">Logout</h6>
                </button>
              </div>

            </div>

            <img 
              src={FooterImg}
              alt="footer"
              className="absolute z-10 bottom-0 w-[100vw] left-0"
            />

          </div>
        </Page>
      </Popup>
      </>

  )
}
