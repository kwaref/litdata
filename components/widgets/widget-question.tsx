/* eslint-disable tailwindcss/enforces-shorthand */
import {memo, useEffect, useState} from 'react'

import dynamic from 'next/dynamic'
import {useTranslations} from 'next-intl'
import {borderColors} from '@/app/[locale]/(current)/reports/[id]/component-to-show'
import Dropdown, {type MenuProps} from '@/components/ui/Dropdown'
import {EllipsisHorizontalIcon, ArrowsPointingOutIcon} from '@heroicons/react/24/outline'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/20/solid'
import {faker} from '@faker-js/faker'
import WidgetFilterList from '@/components/widgets/widget-filter'
import Button from '@/components/ui/ButtonCVA'
import Table from '@/components/widgets/widget-table'
import {type ColumnsProps, type WidgetQuestionProps} from './types'
import {useDialog} from '../utils/use-dialog'
import {CONFIRM_REMOVE_DIALOG} from '@/app/[locale]/(current)/dashboard/ConfirmRemoveDialog'

const Menu = ({handleRemove}: {handleRemove?: () => void}) => {
  const t = useTranslations('Dashboard')

  const menu: MenuProps[] = [
    {label: t('widgets.remove-from-dashboard'), onClick: handleRemove},
    // {label: t('widgets.open-in-new-tab'), onClick: maximize},
  ]

  return (
    <Dropdown
      menu={menu}
      classNames={{
        trigger:
          'bg-transparent border-primary-100 h-[38px] w-[38px] p-0 hover:text-primary-500 text-primary-500 hover:bg-transparent shadow-none',
        panel: 'right-0 left-auto !w-[222px]',
      }}
      variant={'outlined'}
    >
      <EllipsisHorizontalIcon className="h-5 w-5" />
    </Dropdown>
  )
}

const WidgetBars = dynamic(async () => await import('@/components/widgets/widget-bars'), {
  ssr: false,
})

const WidgetQuestion = ({
  data: {id, answers, type, matrixMap, description, filters},
  remove,
}: WidgetQuestionProps) => {
  const t = useTranslations('Dashboard')
  const {openDialog} = useDialog(CONFIRM_REMOVE_DIALOG)

  const [selectedColors, setSelectedColors] = useState([])

  const columns: ColumnsProps[] = [
    {
      headerName: t('widgets.answers'),
      accessor: ({description}, idx) => (
        <div className="flex items-center">
          <div
            style={{borderColor: selectedColors[idx]}}
            className="aspect-square rounded-full h-3 w-3 border-[3px] mr-1"
          />
          <span className="align-text-bottom text-left">{description}</span>
        </div>
      ),
      headerCellProps: {
        // className: 'min-w-[200px] ',
      },
      cellProps: {className: 'min-w-[190px]'},
    },
    {
      headerName: t('widgets.responses'),
      accessor: ({percent}) => <span>{percent}%</span>,
      // cellProps: {className: 'py-[3px]'},
      headerCellProps: {
        className: '',
      },
    },
    {
      headerName: t('widgets.number'),
      accessor: 'count',
      // cellProps: {className: 'py-[3px]'},
      headerCellProps: {
        className: '',
      },
    },
  ]

  useEffect(() => {
    const generatedColors = answers.reduce((acc: string[], item: any, index: any) => {
      const c: string =
        // colors[index] ?? faker.color.rgb({format: 'css'})
        item?.color ?? faker.color.rgb({format: 'css'})
      acc.push(c)
      return acc
    }, [])
    setSelectedColors(generatedColors)
  }, [answers])

  const [showFilters, setShowFilters] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)

  const maximize = (url: string | URL | undefined) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    localStorage.setItem(
      `widget-${id}`,
      JSON.stringify({id, answers, type, matrixMap, description, filters}),
    )
  }

  return (
    <div
      style={{borderTopColor: borderColors[0]}}
      className="flex w-full flex-col border-t-4 border border-primary-50 bg-background p-6 rounded-[5px]"
    >
      <div className="flex w-full items-start justify-between gap-3 mb-4">
        <h4
          className="text-primary-500 text-xl leading-7 md:leading-[30px] md:text-2xl font-degular tracking-normal font-semibold self-center"
          dangerouslySetInnerHTML={{__html: description}}
        />
        <div className="flex gap-2">
          <Button
            className="px-2"
            variant="outlined"
            color="inherit"
            onClick={() => maximize(`widgets/${id}`)}
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </Button>
          <Menu
            handleRemove={() => {
              openDialog({id, remove})
            }}
          />
        </div>
      </div>
      <div className="flex w-full items-start justify-between gap-3 mb-4">
        <p className="text-primary-300 text-xs self-center">
          <span>Trend by: </span>
          <span className="font-bold">{type}</span>
        </p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-primary-500 text-xs leading-[1.125rem] flex items-center h-[1.25rem]"
        >
          <span className="mr-1 inline-block align-text-bottom">
            {showFilters ? t('widgets.hide-filters') : t('widgets.view-filters')}
          </span>
          {showFilters ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <div
        className={`${
          showFilters ? 'flex' : 'hidden'
        } w-full items-start justify-between gap-3 mb-4`}
      >
        <WidgetFilterList filters={filters} />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <WidgetBars
          // chartData={answers.length > 3 ? answers.slice(0, 4) : answers}
          chartData={answers}
          type={type}
          matrixMap={matrixMap}
          colors={selectedColors}
        />
      </div>
      <div
        className={`flex w-full items-start pt-6 justify-between border-t border-primary-50 ${
          type === 'No trends' && 'mt-[45px]'
        }`}
      >
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="text-primary-500 text-xs leading-[1.125rem] flex items-center h-[1.25rem]"
        >
          <span className="mr-1 inline-block align-text-bottom">
            {showAnswers ? t('widgets.hide-answers') : t('widgets.view-answers')}
          </span>
          {showAnswers ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className={`${showAnswers ? 'flex' : 'hidden'} w-full items-start justify-between pt-4`}>
        {type === 'No trends' ? (
          <Table rows={answers || []} columns={columns} />
        ) : (
          <div className="w-full overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-primary-300 bg-[#E6E6EC] px-4 h-6 text-left text-[10px] font-medium w-[190px] min-w-[190px] max-w-[190px]">
                    ANSWERS
                  </th>
                  {answers?.map(({label}: any) => (
                    <th
                      key={label}
                      className="text-primary-300 bg-[#E6E6EC] px-2 h-6 text-center text-[10px] font-medium min-w-[40px]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {answers[0]?.questions[0]?.answers?.choices.map(
                  ({id: choiceId, description, color}: any, idx: number) => (
                    <tr
                      key={`${choiceId}-${crypto.randomUUID()}`}
                      className="h-7 border-b border-border last:border-b-0"
                    >
                      <td className="text-primary-900 last:border-b-0 px-1 text-left text-xs">
                        <div className="flex items-center">
                          <div
                            style={{borderColor: color}}
                            className="aspect-square rounded-full h-3 w-3 border-[3px] mr-1"
                          />
                          <span className="align-text-bottom text-left">{description}</span>
                        </div>
                      </td>
                      {answers?.map(({questions}: any) => (
                        <td
                          key={`${questions?.[0]?.id}-${crypto.randomUUID()}`}
                          className="text-primary-900 last:border-b-0 px-1 text-center text-xs w-[40px] min-w-[40px] max-w-[40px] "
                        >
                          {
                            questions?.[0]?.answers?.choices?.find((c: any) => c?.id === choiceId)
                              ?.percent
                          }
                          %
                        </td>
                      ))}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(WidgetQuestion)
