import {useTranslations} from 'next-intl'

const WidgetFilter = ({text}: {text: string}) => (
  <p className="text-primary-500 text-sm leading-5 py-2.5">{text}</p>
)

const WidgetFilterList = ({filters}: {filters: string[]}) => {
  const t = useTranslations('Dashboard.widgets')
  return (
    <ul className="w-full">
      {filters.length > 0 ? (
        filters?.map((filter: string) => (
          <li className="flex border-b-primary-50 border-b last:border-0" key={filter}>
            <WidgetFilter text={filter} />
          </li>
        ))
      ) : (
        <li
          className="flex mt-2.5 pb-[14px] text-primary-200 text-xs leading-[18px] border-b-primary-50 border-b"
          key={crypto.randomUUID()}
        >
          <p>{t('no-filters')}</p>
        </li>
      )}
    </ul>
  )
}

export default WidgetFilterList
