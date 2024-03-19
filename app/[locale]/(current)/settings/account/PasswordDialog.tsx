import {useSupabase} from '@/app/supabase-provider'
import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {FormFieldControl, InputField} from '@/components/ui/Form'
import {useDialog} from '@/components/utils/use-dialog'
import useToggle from '@/components/utils/useToggle'
import {MailType} from '@/utils/sendgridConstants'
import toastAlert from '@/utils/toastAlert'
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import {zodResolver} from '@hookform/resolvers/zod'
import {useTranslations} from 'next-intl'
import {memo} from 'react'
import {useForm} from 'react-hook-form'
import zod from 'zod'
import axios from 'axios'

// interface PasswordDialogProps {};

export const PASSWORD_DIALOG = 'password-dialog'

const EmailSchema = zod
  .object({
    password: zod.string(),
    new_password: zod.string(),
  })
  .refine(schema => /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/.test(schema.new_password), {
    message:
      'Use a password at least 8 characters long containing at least one alphabet and one number',
    path: ['new_password'],
  })

function PasswordDialog() {
  const {isOpen: canSee, onToggle} = useToggle()
  const {supabase: supaAuth} = useSupabase()
  const {isOpen, closeDialog, payload} = useDialog(PASSWORD_DIALOG)
  const t = useTranslations('Settings.MyAccount.PasswordDialog')
  const commonT = useTranslations('Common')

  const {control, handleSubmit, reset} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      password: '',
      new_password: '',
    },
  })

  // Todo: Refactor shema base on MVP design
  const onPasswordSubmit = handleSubmit(async data => {
    // update password on supabase
    const {error} = await supaAuth.auth.updateUser({
      password: data.new_password,
    })
    if (error) toastAlert({message: error.message, type: 'error'})
    else {
      axios.post('/api/sendgrid', {
        params: {
          type: MailType.NewPassword,
          emails: [payload.email],
          data: {
            name: payload?.full_name,
            password: data.new_password,
          },
        },
      })

      toastAlert({message: 'Password updated!', type: 'success'})
      closeDialog()
      reset()
    }
  })

  return (
    <Dialog
      isOpen={isOpen}
      closeDialog={() => {
        closeDialog()
        reset()
      }}
      title={t('title')}
      classNames={{panel: 'py-6 px-8', title: 'mb-5'}}
    >
      <form className="flex min-h-[250px] w-full flex-col gap-4 md:min-w-[460px] md:max-w-[460px] ">
        <div>
          <FormFieldControl
            control={control}
            Component={InputField}
            name="password"
            label={t('passLabel')}
            required
            variant="outlined"
            type={'password'}
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="new_password"
            label={t('newPassLabel')}
            required
            variant="outlined"
            endIcon={
              !canSee ? (
                <EyeSlashIcon className="h-5 w-5 cursor-pointer" onClick={onToggle} />
              ) : (
                <EyeIcon className="h-5 w-5 cursor-pointer" onClick={onToggle} />
              )
            }
            type={canSee ? 'text' : 'password'}
          />
          <p>{t('validPass')}</p>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            variant="outlined"
            color="inherit"
            className="bg-transparent"
            onClick={closeDialog}
          >
            {commonT('cancel')}
          </Button>
          <Button type="button" onClick={onPasswordSubmit}>
            {commonT('saveChanges')}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default memo(PasswordDialog)
