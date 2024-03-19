'use client'
import useUserDetails from '@/utils/useUserDetails'
import Link from 'next/link'
import {useUser} from '../utils/use-user'
import LitLogo from '../icons/LitLogo'

export default function Logo() {
  const {userDetails} = useUser()

  return (
    <Link className="block" href={userDetails?.role === 'client' ? '/dashboard' : '/dashboard'}>
      <LitLogo />
    </Link>
  )
}
