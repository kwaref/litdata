import React from 'react'
import {SignUpForm} from './SignUpForm'
import Logo from '@/components/icons/Logo'

export default async function SignUp() {
  return (
    <div className="height-screen-helper flex justify-center pt-10">
      <div className="m-auto flex w-80 max-w-lg flex-col justify-between p-3 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
