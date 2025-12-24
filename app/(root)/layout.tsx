"use client"
import { SideBar } from '@/components/SideBar';
import SideBarTop from '@/components/SideBarTop';
import { useUserStore } from '@/lib/store/userStore';
import { useRouter } from 'next/navigation';


const Layout = ({children} : {children: React.ReactNode}) => {
  const {isLogin, token} = useUserStore()
  const route = useRouter()
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
          <SideBarTop />
        <div className='flex flex-1 overflow-hidden'>
          <SideBar />
        <main className='flex-1 overflow-auto p-6 bg-gray-200 rounded-ss-[12px]'>
          {children}
        </main>
        </div>
  
      </div>
  )
          
}

export default Layout

