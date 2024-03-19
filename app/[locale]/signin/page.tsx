import AuthUI from './AuthUI'
import {getSession, getUserDetails} from '@/app/supabase-server'
// import Logo from '@/components/icons/Logo'
import LitLogo from '@/components/icons/LitLogo'
import Image from 'next/image'
import {redirect} from 'next/navigation'

export default async function SignIn() {
  // const session = await getSession()
  // const userDetails = await getUserDetails()

  // if (session) {
  // if (userDetails?.role === 'client') redirect('/client-home')
  // if (userDetails?.role === 'admin') redirect('/dashboard')
  // redirect('/dashboard')
  // }

  return (
    <div className="flex w-full relative">
      <div className="relative h-[100dvh] w-full md:w-6/12 bg-gray-100">
        <LitLogo className="h-8 w-7 absolute sm:left-8 top-11 max-sm:left-1/2 max-sm:-translate-x-1/2" />
        <div className="bg-white h-full flex justify-center items-center w-full">
          <AuthUI />
        </div>
      </div>
      <div className="w-full hidden md:flex md:flex-col md:justify-between md:w-6/12">
        <div className="self-end md:w-[400px] lg:w-[500px] xl:w-[600px] md:h-[400px] lg:h-[500px] xl:h-[600px] relative">
          <Image
            src="/images/login-3d.png"
            sizes="100vw"
            fill
            style={{objectFit: 'contain'}}
            alt="404 illustration"
          />
        </div>
        <div className="md:pl-8 lg:px-16 xl:pl-24 pb-16 mb-4">
          <p className="md:text-4xl xl:text-5xl font-semibold font-degular text-primary-500">
            Real Data. Real Time.
          </p>
          <span className="text-primary-300 md:text-sm lg:text-[17px]">
            Elevate your analytical capabilities with Lit Data
          </span>
        </div>
      </div>
    </div>
  )
}
