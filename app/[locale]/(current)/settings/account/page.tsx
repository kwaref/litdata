'use client'

import {FormFieldControl, InputField} from '@/components/ui/Form'
import {memo, useEffect} from 'react'
import Button, {buttonVariants} from '@/components/ui/ButtonCVA'
import {useDialog} from '@/components/utils/use-dialog'
import PasswordDialog, {PASSWORD_DIALOG} from './PasswordDialog'
import {useUser} from '@/components/utils/use-user'
import AccountPanel from './account-panel'
import {cn} from '@/components/utils/tailwindMerge'
import {useTranslations} from 'next-intl'
import {EnvelopeIcon, LockClosedIcon} from '@heroicons/react/24/outline'
import {ArrowTopRightOnSquareIcon} from '@heroicons/react/20/solid'
import AccountPanelManager from './account-panel-manager'

// interface MyAccountProps {}
function MyAccount() {
  const {userDetails} = useUser()
  const {openDialog} = useDialog(PASSWORD_DIALOG)
  const t = useTranslations('Settings.MyAccount')

  return (
    <>
      <PasswordDialog />
      <div>
        <h2 className="text-2xl font-degular font-bold mb-5">{t('title')}</h2>

        {userDetails?.is_company ? <AccountPanelManager /> : <AccountPanel />}
        <h3 className="mt-8 flex items-center text-base tracking-normal font-bold">
          <EnvelopeIcon className="h-4 w-4" />
          <span className="ml-2">{t('email')}</span>
        </h3>
        <p className="text-primary-300 text-sm">{t('emailDesc')}</p>
        <form className="mt-4 flex w-full max-lg:items-start items-center gap-4 max-lg:flex-col max-lg:gap-2">
          <InputField
            name="email"
            type="text"
            value={userDetails?.email ?? ''}
            placeholder="email@domain.com"
            className="max-lg:w-full"
            classNames={{input: 'sm:min-w-[300px]'}}
            disabled
          />
          <a
            className={cn('p-0', buttonVariants({color: 'inherit', variant: 'link'}))}
            href={'mailto:support@litdata.org'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2">{t('contact-btn')}</span>
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </a>
        </form>

        <h3 className="mt-8 flex items-center text-base tracking-normal font-bold">
          <LockClosedIcon className="h-5 w-5" />
          <span className="ml-2">{t('password')}</span>
        </h3>
        <p className="text-primary-300 text-sm">{t('passwordDesc')}</p>
        <Button className="mt-4" onClick={() => openDialog(userDetails)}>
          <span>{t('setPass')}</span>
        </Button>
      </div>
    </>
  )
}

export default memo(MyAccount)
