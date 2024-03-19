import {useSupabase} from '@/app/supabase-provider'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/ButtonCVA'
import Drawer from '@/components/ui/Drawer'
import {CheckboxField} from '@/components/ui/Form'
import {useDrawer} from '@/components/utils/use-drawer'
import {useFetchUsersHierarchy} from '@/components/utils/use-fetch-users-hierarchy'
import {useUser} from '@/components/utils/use-user'
import {MailType} from '@/utils/sendgridConstants'
import axios from 'axios'
import {useTranslations} from 'next-intl'
import {useRouter} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import {toast} from 'react-toastify'

// interface ShareReportsMembersDrawerProps {}

export const SHARE_REPORT_MEMEBER_DRAWER = 'share-report-member-drawer'

function ShareReportsMembersDrawer() {
  const {isOpen, closeDrawer, payload} = useDrawer(SHARE_REPORT_MEMEBER_DRAWER)
  const commonT = useTranslations('Common')
  const t = useTranslations('Report')
  const [selectedAll, setSelectedAll] = useState<boolean>(false)
  // Buscar los usuarios organizados por compañia
  const {data: usersHierarchy} = useFetchUsersHierarchy()
  // Estado para manejar los usuarios seleccionados
  // Este es el listado que se debe adicionar a los permisos del reporte
  const [allowedUsers, setAllowedUsers] = useState([])
  const {refresh} = useRouter()
  const {userDetails} = useUser()

  const company = useMemo(() => {
    const _company = usersHierarchy?.find((c: any) => c?.id === userDetails?.company)
    return {..._company, users: _company?.users.filter((u: any) => u?.id !== userDetails?.id)}
  }, [usersHierarchy, userDetails])

  useEffect(() => {
    if (payload?.initialAllowedUsers?.length > 0) {
      setAllowedUsers(payload.initialAllowedUsers)
    }
  }, [payload])

  useEffect(() => {
    if (!selectedAll && allowedUsers.length === company?.users?.length) {
      setSelectedAll(true)
    }
  }, [allowedUsers, company?.users, selectedAll])

  const {supabase} = useSupabase()

  const handleSelectAll = (e: any) => {
    if (e.target?.checked) {
      setSelectedAll(true)
      setAllowedUsers(
        // @ts-ignore
        company?.users?.map((el: any) => el.id),
      )
    } else {
      setAllowedUsers([])
      setSelectedAll(false)
    }
  }

  const handleOnChangeUser = (e: any, userId: string, companyId: string) => {
    if (e.target.checked) {
      // do add to users list
      // @ts-ignore
      setAllowedUsers([...allowedUsers, userId])
    } else {
      // do remove from users list
      setAllowedUsers(allowedUsers.filter((el: string) => el !== userId))
      setSelectedAll(false)
    }
  }

  const handleSubmit = async () => {
    const {error} = await supabase
      .from('reports')
      .update({allowed_users: allowedUsers})
      .eq('id', payload.reportId)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Report has been shared!')
      const newUsers = allowedUsers.filter(el => !payload.initialAllowedUsers.includes(el))
      const {data: users, error: usersError} = await supabase
        .from('users')
        .select('full_name, email')
        .in('id', newUsers)

      if (usersError) {
        toast.error(usersError.message)
      } else {
        await axios.post('/api/sendgrid', {
          params: {
            type: MailType.ShareReport,
            emails: users?.map(el => el.email),
            data: {
              users,
              report: {
                id: payload?.reportId || '',
                name: payload?.reportName || '',
                created_at: payload?.reportDate || '',
              },
            },
          },
        })
      }

      refresh()
      closeDrawer()
    }
  }

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      onBackdropClose={closeDrawer}
      header={t('share-report')}
    >
      <form>
        <div className="pb-5 mb-5 border-b border-border">
          <CheckboxField
            id={'all'}
            label={t('share-drawer-members')}
            checked={selectedAll}
            indeterminate={
              // @ts-ignore
              allowedUsers.length < company?.users?.length && allowedUsers.length > 0
            }
            onChange={handleSelectAll}
          />
        </div>
        <article className="flex flex-col gap-5 overflow-hidden overflow-y-auto min-h-[calc(100dvh-16.5rem)] max-h-[calc(100dvh-16.5rem)]">
          <p className="text-base font-semibold">{company?.full_name}</p>
          <div className="pl-3 flex flex-col gap-3">
            {company?.users?.map((user: any) => (
              <CheckboxField
                key={user.id}
                id={user.full_name}
                label={user.full_name}
                checked={// @ts-ignore
                allowedUsers?.includes(user.id)}
                onChange={e => handleOnChangeUser(e, user.id, company?.id)}
                // disabled={payload?.reportQuestions?.every(
                //   (el: any) => company?.permissions?.includes(el),
                // )}
              />
            ))}
          </div>
        </article>
        <footer className="h-28 flex flex-col justify-end">
          <div className="flex justify-between items-center gap-5">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                closeDrawer()
                setAllowedUsers(payload.initialAllowedUsers)
              }}
            >
              <span>{commonT('cancel')}</span>
            </Button>
            <Button onClick={handleSubmit}>
              <span>{commonT('share')}</span>
            </Button>
          </div>
        </footer>
      </form>
    </Drawer>
  )
}

export default ShareReportsMembersDrawer
