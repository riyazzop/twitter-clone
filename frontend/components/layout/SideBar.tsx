"use client"
import { useAuth } from '@/context/AuthContext'
import { Bell, Bookmark, Home, Mail, MoreHorizontal, Search, User, Feather, Settings, LogOut } from 'lucide-react'
import React from 'react'
import TwitterLogo from '../TwitterLogo'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

import { Avatar, AvatarImage } from '../ui/avatar'

const SideBar = ({ currentPage = 'home', onNavigate }: any) => {
    const { user, logout } = useAuth()

    const navigation = [
        { name: "Home",          href: "home",          icon: Home },
        { name: "Explore",       href: "explore",       icon: Search },
        { name: "Notifications", href: "notifications", icon: Bell },
        { name: "Messages",      href: "messages",      icon: Mail },
        { name: "Bookmarks",     href: "bookmarks",     icon: Bookmark },
        { name: "Profile",       href: "profile",       icon: User },
        { name: "More",          href: "more",          icon: MoreHorizontal },
    ]

    return (
        <div className='flex flex-col h-full px-2 xl:px-4 py-3 justify-between'>
            {/* Top section */}
            <div className='flex flex-col gap-1'>
                {/* X Logo */}
                <div className='mb-3 p-3 rounded-full w-fit hover:bg-gray-900 transition-colors cursor-pointer'>
                    <div className='w-7 h-7 text-white fill-white'>
                        <TwitterLogo />
                    </div>
                </div>

                {/* Nav items */}
                {navigation.map((item) => {
                    const isActive = currentPage === item.href
                    return (
                        <button
                            key={item.name}
                            onClick={() => onNavigate?.(item.href)}
                            className={`flex items-center gap-4 px-3 py-3 rounded-full w-fit xl:w-full transition-colors group cursor-pointer
                                ${isActive
                                    ? 'font-bold'
                                    : 'font-normal hover:bg-gray-900'
                                }`}
                        >
                            <item.icon
                                className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-white'}`}
                                strokeWidth={isActive ? 2.5 : 1.75}
                            />
                            <span className={`hidden xl:block text-xl text-white ${isActive ? 'font-bold' : ''}`}>
                                {item.name}
                            </span>
                        </button>
                    )
                })}

                {/* Post button */}
                <button className='mt-4 bg-[#1d9bf0] hover:bg-[#1a8cd8] transition-colors rounded-full p-3 xl:px-6 xl:py-3 w-fit xl:w-full flex items-center justify-center gap-2 cursor-pointer'>
                    <Feather className='w-5 h-5 text-white xl:hidden' />
                    <span className='hidden xl:block text-white font-bold text-lg'>Post</span>
                </button>
            </div>
            {/* Bottom — user profile chip */}
            <div className='mb-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className='flex items-center gap-3 px-3 py-3 rounded-full w-fit xl:w-full hover:bg-gray-900 transition-colors cursor-pointer'>
                            <Avatar className='w-9 h-9 flex-shrink-0'>
                                <AvatarImage src={user?.avatar} className='object-cover'/>
                            </Avatar>
                            <div className='hidden xl:flex flex-col items-start flex-1 min-w-0'>
                                <span className='text-white font-bold text-sm truncate w-full'>{user?.name}</span>
                                <span className='text-gray-500 text-sm truncate w-full'>@{user?.username}</span>
                            </div>
                            <MoreHorizontal className='hidden xl:block w-5 h-5 text-white flex-shrink-0'/>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='top' align='start' className='bg-black border-gray-800 text-white w-56 rounded-2xl shadow-xl'>
                        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer hover:bg-gray-900 rounded-xl'>
                            <Settings className='w-4 h-4'/>
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='bg-gray-800'/>
                        <DropdownMenuItem onClick={logout} className='flex items-center gap-2 cursor-pointer hover:bg-gray-900 rounded-xl text-red-400'>
                            <LogOut className='w-4 h-4'/>
                            <span>Log out @{user?.username}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default SideBar