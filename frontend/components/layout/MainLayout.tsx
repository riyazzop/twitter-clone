"use client"
import { useAuth } from '@/context/AuthContext'
import React, { useState } from 'react'
import LoadingSpinner from '../LoadingSpinner'
import SideBar from './SideBar'
import ProfilePage from '../ProfilePage'

const MainLayout = ({children}:any) => {
    const {user, isloading} = useAuth()
    const [currentPage, setCurrentPage] = useState("home")

    if(isloading){
        return (
            <div className='flex items-center justify-center h-screen bg-black'>
                <LoadingSpinner/>
            </div>
        )
    }

    if(!user){
        return <>{children}</>
    }

    return (
        <div className='min-h-screen bg-black text-white'>
            <div className='flex max-w-7xl mx-auto'>
                {/* Fixed Sidebar */}
                <div className='w-16 xl:w-72 flex-shrink-0'>
                    <div className='fixed h-screen w-16 xl:w-72 flex flex-col'>
                        <SideBar currentPage={currentPage} onNavigate={setCurrentPage}/>
                    </div>
                </div>

                {/* Main content */}
                <main className='flex-1 min-h-screen border-x border-gray-800 max-w-2xl'>
                    {currentPage==="profile"?<ProfilePage/>: children}
                </main>

                {/* Right panel (placeholder for future widgets) */}
                <div className='hidden lg:block w-80 xl:w-96 flex-shrink-0'/>
            </div>
        </div>
    )
}

export default MainLayout