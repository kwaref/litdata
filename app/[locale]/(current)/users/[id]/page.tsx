import {type PropsWithChildren} from 'react'
import ProfileBody from './profile-body'
import ProfileSidebar from './profile-sidebar'
import {ActiveUserProvider} from '@/app/active-user-context'
import {FlyoutProvider} from '@/app/flyout-context'

interface ProfileProps extends PropsWithChildren {
  params: {id: string}
}

function ProfileContent({id}: {id: string}) {
  return (
    <div className="relative flex">
      {/* Profile sidebar */}
      <ProfileSidebar id={id} />

      {/* Profile body */}
      <ProfileBody />
    </div>
  )
}

export default function Profile({params}: any) {
  return (
    <FlyoutProvider>
      <ActiveUserProvider>
        <ProfileContent id={params.id} />
      </ActiveUserProvider>
    </FlyoutProvider>
  )
}
