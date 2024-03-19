import {type ColumnsProps} from '@/components/ui/Table'
import UsersTableItemMenu from '../users/users-table-item-menu'
import {useTranslations} from 'next-intl'
import Button from '@/components/ui/ButtonCVA'
import {PencilSquareIcon, QueueListIcon} from '@heroicons/react/24/outline'
import {useDrawer} from '@/components/utils/use-drawer'
import {QUESTIONS_DRAWER} from './questions-drawer'
import {cn} from '@/components/utils/tailwindMerge'
import {ADD_COMPANY_DIALOG} from './companies-create-form'
import {useDialog} from '@/components/utils/use-dialog'

export function useCompaniesTable() {
  const t = useTranslations('Companies.table')
  const {openDrawer} = useDrawer(QUESTIONS_DRAWER)
  const {openDialog: openDialogCompany} = useDialog(ADD_COMPANY_DIALOG)

  const columns: ColumnsProps[] = [
    {
      headerName: t('col-action'),
      accessor: (company, idx, companies) => (
        <UsersTableItemMenu
          user={companies}
          className="w-12 justify-center "
          align="left"
          placement={
            idx >= 0 && (idx < companies.length - 1 || companies.length === 1) ? 'bottom' : 'top'
          }
          options={[
            {
              label: t('edit'),
              Icon: PencilSquareIcon,
              showDivider: true,
              onClick: () => openDialogCompany({company}),
            },
            {
              label: t('questions'),
              Icon: QueueListIcon,
              onClick: () =>
                openDrawer({
                  header: company?.full_name,
                  id: company?.id,
                  allowed_questions: company?.allowed_questions || [],
                }),
            },
          ]}
        />
      ),
      cellProps: {className: cn('w-12')},
    },
    {
      headerName: t('col-company').toUpperCase(),
      accessor: 'full_name',
      cellProps: {className: 'truncate'},
      width: 6,
    },
    {
      headerName: t('col-group').toUpperCase(),
      accessor: ({group_id}) => group_id?.title,
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-address').toUpperCase(),
      accessor: 'address',
      cellProps: {className: 'truncate'},
      width: 6,
    },
    {
      headerName: t('col-zip').toUpperCase(),
      accessor: 'zip_code',
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
      headerName: t('col-manager-contact').toUpperCase(),
      accessor: 'primary_contact',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-manager-contact-email').toUpperCase(),
      accessor: 'email',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-mobile').toUpperCase(),
      accessor: 'mobile',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-phone').toUpperCase(),
      accessor: 'phone',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-job-title').toUpperCase(),
      accessor: 'job_title',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-department').toUpperCase(),
      accessor: 'department',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-manager-address').toUpperCase(),
      accessor: 'manager_address',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-manager-zip').toUpperCase(),
      accessor: 'manager_zip_code',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-manager-city').toUpperCase(),
      accessor: 'manager_city',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-country').toUpperCase(),
      accessor: 'location',
      cellProps: {className: 'truncate'},
      width: 6,
    },
    {
      headerName: t('col-ap-contact-name').toUpperCase(),
      accessor: 'ap_primary_contact',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-ap-contact-email').toUpperCase(),
      accessor: 'ap_primary_contact_email',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-mk-contact-name').toUpperCase(),
      accessor: 'mk_primary_contact',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-mk-contact-email').toUpperCase(),
      accessor: 'mk_primary_contact_email',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-aditional-contact').toUpperCase(),
      accessor: 'aditional_contact',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-aditional-email').toUpperCase(),
      accessor: 'aditional_email',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
    {
      headerName: t('col-license-expire').toUpperCase(),
      accessor: 'licence_expiry_date',
      cellProps: {className: 'truncate'},
      width: 9.5,
    },
  ]

  return {columns}
}
