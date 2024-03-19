import {type ColumnsProps} from '@/components/ui/Table'
import UsersTableItemMenu from './users-table-item-menu'
import {useTranslations} from 'next-intl'
import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline'
import {CONFIRM_DELETE_USER_DIALOG} from '../users/users-delete-confirm'
import {useDialog} from '@/components/utils/use-dialog'
import {ADD_USER_DIALOG} from './users-create-form'

export function useUsersTable() {
  const t = useTranslations('Users.table')
  const {openDialog} = useDialog(ADD_USER_DIALOG)
  const {openDialog: openDeleteDialog} = useDialog(CONFIRM_DELETE_USER_DIALOG)

  const columns: ColumnsProps[] = [
    {
      headerName: '',
      accessor: (user, idx, users) => (
        <UsersTableItemMenu
          user={user}
          className="w-12 justify-center "
          align="left"
          placement={idx >= 0 && (idx < users.length - 1 || users.length === 1) ? 'bottom' : 'top'}
          options={[
            {
              label: t('edit'),
              Icon: PencilSquareIcon,
              isLink: true,
              showDivider: true,
              onClick: () => openDialog({user}),
            },
            {label: t('delete'), Icon: TrashIcon, onClick: () => openDeleteDialog({user})},
          ]}
        />
      ),
      cellProps: {className: 'w-12'},
    },
    {
      headerName: t('col-fullname').toUpperCase(),
      accessor: 'full_name',
      cellProps: {className: 'truncate'},
      width: 9,
    },
    {
      headerName: t('col-role').toUpperCase(),
      accessor: 'role',
      cellProps: {className: 'truncate'},
      width: 6,
    },
    {
      headerName: t('col-phone').toUpperCase(),
      accessor: 'phone',
      cellProps: {className: 'truncate'},
      width: 8,
    },
    {
      headerName: t('col-mobile').toUpperCase(),
      accessor: 'mobile',
      cellProps: {className: 'truncate'},
      width: 8,
    },
    {
      headerName: t('col-email').toUpperCase(),
      accessor: 'email',
      cellProps: {className: 'truncate'},
      width: 9,
    },
    {
      headerName: t('col-company').toUpperCase(),
      accessor: ({company}) => company?.full_name,
      cellProps: {className: 'truncate'},
      width: 9,
    },
    {
      headerName: t('col-department').toUpperCase(),
      accessor: 'department',
      cellProps: {className: 'truncate'},
      width: 9,
    },
    {
      headerName: t('col-job-title').toUpperCase(),
      accessor: 'job_title',
      cellProps: {className: 'truncate'},
      width: 9,
    },
    {
      headerName: t('col-address').toUpperCase(),
      accessor: 'address',
      cellProps: {className: 'truncate'},
      width: 6,
    },
    {
      headerName: t('col-city').toUpperCase(),
      accessor: 'city',
      cellProps: {className: 'truncate'},
      width: 6,
    },
    {
      headerName: t('col-country').toUpperCase(),
      accessor: 'location',
      cellProps: {className: 'truncate'},
      width: 6,
    },
    {
      headerName: t('col-zip').toUpperCase(),
      accessor: 'zip_code',
      cellProps: {className: 'truncate'},
      width: 6,
    },
  ]

  return {columns}
}
