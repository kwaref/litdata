import {type TooltipRenderProps} from 'react-joyride'
import Button from '../ButtonCVA'
import {ArrowRightIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {useTranslations} from 'next-intl'

function TooltipStep({
  index,
  step,
  backProps,
  skipProps,
  primaryProps,
  tooltipProps,
  closeProps,
  isLastStep,
}: TooltipRenderProps) {
  const t = useTranslations('Common.onboarding')

  return (
    <div className="bg-background max-w-[25.18rem] p-4 rounded-sm" {...tooltipProps}>
      {step.title && (
        <header className="w-full flex justify-between items-baseline gap-2 mb-4">
          <h1 className="font-degular text-xl font-semibold">{step.title}</h1>
          <Button className="p-0" variant="link" color="inherit" {...skipProps}>
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </header>
      )}
      <article className="text-primary-400 mb-5">{step.content}</article>
      <footer className="w-full flex justify-between items-center">
        {index > 0 && (
          <Button className="p-0" variant="link" color="inherit" {...backProps}>
            <span id="back" className="text-sm">
              {t('back')}
            </span>
          </Button>
        )}
        <Button endIcon={<ArrowRightIcon className="w-5 h-5" />} {...primaryProps}>
          <span className="mr-2 text-sm" id="next">
            {t('ready')}
          </span>
        </Button>
      </footer>
    </div>
  )
}

export default TooltipStep
