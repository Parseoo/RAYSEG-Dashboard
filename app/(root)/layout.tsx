"use client"
import { SideBar, MobileSidebar } from '@/components/SideBar';
import SideBarTop from '@/components/SideBarTop';
import { useUserStore } from '@/lib/store/userStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const Layout = ({children} : {children: React.ReactNode}) => {
  const {isLogin, token} = useUserStore()
  const route = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // const data = useGetUser()
  // console.log(data)

  // if (isLogin === false) {
  //   if (token) {
  //     useGetUser()
  //     console.log('SUCCESS')
  //     return
  //   }
  //   <SignUp />
    
  // }
    return (
      <div className='flex flex-col h-screen'>
          <SideBarTop onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className='flex flex-1 overflow-hidden'>
          <SideBar />
          <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className='flex-1 overflow-auto p-4 sm:p-6 bg-gray-200 rounded-ss-[12px]'>
          {children}
        </main>
        </div>
  
      </div>
  )
          
}

export default Layout

