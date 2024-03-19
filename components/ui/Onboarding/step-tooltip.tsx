import {type TooltipRenderProps} from 'react-joyride'
import Button from '../ButtonCVA'
import {ArrowRightIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {useTranslations} from 'next-intl'
import {cn} from '@/components/utils/tailwindMerge'

function TooltipStep({
  index,
  step,
  backProps,
  skipProps,
  primaryProps,
  tooltipProps,
  closeProps,
  isLastStep,
  showHelp,
}: TooltipRenderProps & {showHelp: boolean}) {
  const t = useTranslations('Common.onboarding')

  return (
    <div
      className="bg-background max-w-[342px] md:max-w-[25.18rem] p-4 rounded-sm"
      {...tooltipProps}
    >
      {step.title && (
        <header className="w-full flex justify-between items-baseline gap-2 mb-4">
          <h1 className="font-degular text-xl font-semibold">{step.title}</h1>
          <Button className="p-0" variant="link" color="inherit" {...skipProps}>
            <XMarkIcon className="size-5" />
          </Button>
        </header>
      )}
      <article className="text-primary-400 mb-5">{step.content}</article>
      <footer
        className={cn('w-full flex justify-between items-center', {
          'justify-end': index === 0 && showHelp,
        })}
      >
        {((!showHelp && index > 0) || (showHelp && index > 1)) && (
          <Button className="p-0" variant="link" color="inherit" {...backProps}>
            <span id="back" className="text-sm">
              {t('back')}
            </span>
          </Button>
        )}
        {((!showHelp && index === 0) || (showHelp && index === 1)) && (
          <Button className="p-0" variant="link" color="inherit" {...skipProps}>
            <span id="skip" className="text-sm">
              {t('skip')}
            </span>
          </Button>
        )}
        {isLastStep ? (
          <Button {...closeProps}>
            <span id="close" className="mr-2 text-sm">
              {t('gotit')}
            </span>
          </Button>
        ) : (
          <Button endIcon={<ArrowRightIcon className="size-5" />} {...primaryProps}>
            {showHelp ? (
              <span className="mr-2 text-sm" id="next">
                {index === 0 ? t('ready') : index === 1 ? t('start') : t('next')}
              </span>
            ) : (
              <span className="mr-2 text-sm" id="next">
                {index === 0 ? t('start') : t('next')}
              </span>
            )}
          </Button>
        )}
      </footer>
    </div>
  )
}

export default TooltipStep
