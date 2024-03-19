import {useSupabase} from '@/app/supabase-provider'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/ButtonCVA'
import Drawer from '@/components/ui/Drawer'
import {CheckboxField} from '@/components/ui/Form'
import {useDrawer} from '@/components/utils/use-drawer'
import {useFetchUsersHierarchy} from '@/components/utils/use-fetch-users-hierarchy'
import {MailType} from '@/utils/sendgridConstants'
import axios from 'axios'
import {useTranslations} from 'next-intl'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'

// interface ShareReportsDrawerProps {}

export const SHARE_REPORT_DRAWER = 'share-report-drawer'

function ShareReportsDrawer() {
  const {isOpen, closeDrawer, payload} = useDrawer(SHARE_REPORT_DRAWER)
  const commonT = useTranslations('Common')
  const t = useTranslations('Report')
  const [selectedAll, setSelectedAll] = useState<boolean>(false)
  // Buscar los usuarios organizados por compañia
  const {data: usersHierarchy} = useFetchUsersHierarchy()
  // Estado para manejar los usuarios seleccionados
  // Este es el listado que se debe adicionar a los permisos del reporte
  const [allowedUsers, setAllowedUsers] = useState([])
  const {refresh} = useRouter()

  useEffect(() => {
    if (payload?.initialAllowedUsers?.length > 0) {
      setAllowedUsers(payload.initialAllowedUsers)
    }
  }, [payload])

  const {supabase} = useSupabase()

  const handleSelectAll = (e: any) => {
    if (e.target?.checked) {
      setSelectedAll(true)
      setAllowedUsers(
        // @ts-ignore
        usersHierarchy.reduce((acc, company) => {
          if (!payload?.reportQuestions?.every((el: any) => company?.permissions?.includes(el))) {
            return acc
          }
          return acc.concat(company.users.map((el: any) => el.id))
        }, []),
      )
    } else {
      setAllowedUsers([])
      setSelectedAll(false)
    }
  }

  const handleOnChangeCompany = (e: any, companyId: string, users: any[]) => {
    if (e.target.checked) {
      // @ts-ignore
      const usersToAdd = users.filter(user => !allowedUsers.includes(user.id)).map(el => el.id)
      // @ts-ignore
      setAllowedUsers([...allowedUsers, ...usersToAdd])
    } else {
      const usersToRemove = users.map(el => el.id)
      const usersAfterRemotion = [...allowedUsers].filter(el => !usersToRemove.includes(el))
      setAllowedUsers(usersAfterRemotion)
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
            label={t('share-drawer')}
            checked={selectedAll}
            onChange={handleSelectAll}
            disabled={payload?.reportQuestions?.length === 0}
          />
        </div>
        <article className="flex flex-col gap-5 overflow-hidden overflow-y-auto min-h-[calc(100dvh-16.5rem)] max-h-[calc(100dvh-16.5rem)]">
          {usersHierarchy?.map(
            (company: {
              [x: string]: any
              id: string
              full_name: string
              users: Array<{id: string; full_name: string}>
            }) => (
              <Accordion
                key={company.id}
                disabled={
                  !payload?.reportQuestions?.every((el: any) => company?.permissions?.includes(el))
                }
                title={
                  <div>
                    <CheckboxField
                      id={company.full_name}
                      label={company.full_name}
                      labelClass="text-base font-semibold z-50 checkbox-field"
                      indeterminate={
                        allowedUsers?.length > 0 &&
                        // @ts-ignore
                        !company?.users?.every((item: any) => allowedUsers.includes(item.id)) &&
                        // @ts-ignore
                        company?.users?.some((item: any) => allowedUsers.includes(item.id))
                      }
                      checked={
                        allowedUsers?.length > 0 &&
                        // @ts-ignore
                        company?.users?.every((item: any) => allowedUsers.includes(item.id)) &&
                        // @ts-ignore
                        company?.users?.some((item: any) => allowedUsers.includes(item.id))
                      }
                      onChange={e => handleOnChangeCompany(e, company.id, company.users)}
                      disabled={
                        !payload?.reportQuestions?.every(
                          (el: any) => company?.permissions?.includes(el),
                        )
                      }
                    />
                  </div>
                }
              >
                <div className="pl-3 flex flex-col gap-3">
                  {company?.users?.map((user: any) => (
                    <CheckboxField
                      key={user.id}
                      id={user.full_name}
                      label={user.full_name}
                      checked={// @ts-ignore
                      allowedUsers?.includes(user.id)}
                      onChange={e => handleOnChangeUser(e, user.id, company.id)}
                      disabled={
                        !payload?.reportQuestions?.every(
                          (el: any) => company?.permissions?.includes(el),
                        )
                      }
                    />
                  ))}
                </div>
              </Accordion>
            ),
          )}
        </article>
        <footer className="h-28 flex flex-col justify-end">
          <div className="flex justify-between items-center gap-5">
            <Button variant="outlined" color="inherit" onClick={closeDrawer}>
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

export default ShareReportsDrawer
