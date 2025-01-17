import React from 'react'
import { MdCloudOff } from 'react-icons/md'

export default function OfflinePanel({ f7router }) {
  return (
    <div className="rounded border border-slate-300 bg-slate-200 sm:p-2 p-1">
      <div className="flex flex-col items-center justify-center text-slate-400 sm:mb-2 mb-1">
        <MdCloudOff className="sm:text-[2.5em] text-[1.5em]" />
        <h6 className="sm:text-base text-[0.9em] font-semibold text-center">You are offline</h6>
      </div>
      <button
        onClick={() => f7router.navigate('/offline-login/')}
        className="flex justify-center items-center w-full sm:h-[2.5em] h-[1.8em] rounded bg-slate-300"
      >
        <h6 className="text-base font-semibold text-slate-500">Continue Offline</h6>
      </button>
    </div>
  )
}



