import React from 'react'

export default function OrderListItem() {
  return (
    <div>  
      <div className="flex flex-col gap-y-1 h-auto text-white" >
        <div className="flex justify-between items-center">
        <h6 className="text-white  font-bold">Farmer</h6>
        <h6 className="text-white  font-semibold">John Doe</h6>
        </div>
        <div className="flex justify-between items-center">
        <h6 className="text-white  font-bold">Quantity</h6>
        <h6 className="text-white  font-semibold">552</h6>
        </div>
        <div className="flex justify-between items-center">
        <h6 className="text-white  font-bold">Total Cost</h6>
        <h6 className="text-white  font-semibold">₵ 14,780</h6>
        </div>
        <div className="flex justify-between items-center">
        <h6 className="text-white  font-bold">Payment Status</h6>
        <h6 className="text-white text-[0.8em] font-semibold py-[1px] px-[5px] rounded bg-slate-400">Pending</h6>
        </div>
      </div>
      <div className="w-full h-[1px] border-b border-slate-700 mt-2" />  
    </div>
  )
}
