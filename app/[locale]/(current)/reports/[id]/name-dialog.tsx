import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import zod from 'zod'
import {useSupabase} from '@/app/supabase-provider'
import {toast} from 'react-toastify'
import {useTranslations} from 'next-intl'
import {InputField} from '@/components/ui/Form'
import {reportStore} from '@/components/utils/use-reports'

export const NAME_DIALOG = 'name-dialog'

const NameSchema = zod.object({
  title: zod.string().min(1, 'Un título es requerido'), // Actualiza el esquema para 'title'
})

function NameDialog() {
  const {isOpen, closeDialog, payload} = useDialog(NAME_DIALOG)
  const [localTitle, setLocalTitle] = useState('')
  const path = usePathname()
  const {supabase} = useSupabase()
  const commonT = useTranslations('Common')
  const t = useTranslations('Report.NameDialog')
  const setIsDirty = reportStore(state => state.setIsDirty)

  useEffect(() => {
    if (payload?.title) setLocalTitle(payload?.title)
  }, [payload?.title])

  const onNameSubmit = async (e: any) => {
    e.preventDefault()
    // Guarda el valor del estado local en el payload utilizando payload.setTitle
    payload.setTitle(localTitle)

    // Coloca aquí cualquier lógica adicional necesaria antes de cerrar el diálogo
    // Por ejemplo, puedes realizar una solicitud para guardar los cambios en el título.
    if (!path.includes('/reports/filter') && !path.includes('/reports/crosstab') && payload?.id) {
      const id = payload.id

      const {error} = await supabase.from('reports').update({title: localTitle}).eq('id', id)
      if (error) {
        toast.error(error.message)
        return
      } else {
        toast.success(t('toast-success'))
      }
    }
    setIsDirty(true)
    // Cierra el diálogo
    closeDialog()
  }

  return (
    <Dialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('header')}
      classNames={{panel: 'py-6 px-8', title: 'mb-6'}}
    >
      <form className="w-full md:min-w-[460px] md:max-w-[460px]" onSubmit={onNameSubmit}>
        <InputField
          className="mb-4"
          type="text"
          label={t('name')}
          value={localTitle}
          onChange={e => setLocalTitle(e.target.value)}
          variant="outlined"
          required
        />

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            variant="outlined"
            color="inherit"
            className="bg-transparent"
            onClick={closeDialog}
          >
            {commonT('cancel')}
          </Button>
          <Button onClick={onNameSubmit} type="submit">
            {commonT('saveChanges')}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default NameDialog
