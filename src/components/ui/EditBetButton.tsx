"use client"
import React, { useState } from 'react'
import Modal from './Modal'

const EditButton = ({ id, betdata }: { id: string, betdata:any }) => {
  const [open, setOpen] = useState(false)
  const [Id, setId] = useState('')
  const handleClose = () => {
    setOpen(false);
  };
  const handelOpen = async (id: string) => {
    setOpen(true);
    setId(id)
  };
  return (
    <>
      <button onClick={() => handelOpen(id)} className="bg-black hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-300 dark:text-black ml-2 transition-all px-6 py-[6px]  rounded-xl">Edit</button>
      <Modal betId={Id} isOpen={open} Type={'edit'} onClose={handleClose} betData={betdata}/>
    </>
  )
}

export default EditButton
