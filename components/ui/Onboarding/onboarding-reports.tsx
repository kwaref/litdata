'use client'

import {useEffect, useState} from 'react'
import Joyride, {ACTIONS, EVENTS, type Placement, STATUS, type Step} from 'react-joyride'
import TooltipStep from './step-tooltip'
import {createClient} from '@supabase/supabase-js'
import {useUser} from '@/components/utils/use-user'
import toastAlert from '@/utils/toastAlert'
import {useRouter} from 'next/navigation'
import {userHelp} from '../Header'
import {useSupabase} from '@/app/supabase-provider'
import axios from 'axios'

interface OnboardingReportsProps {
  steps: Step[]
  start: boolean
  id?: string
  showHelp?: boolean
}

export const stepOptions = {
  disableBeacon: true,
  floaterProps: {
    hideArrow: true,
    offset: 10,
  },
}

function OnboardingReports({steps, start, id, showHelp = false}: OnboardingReportsProps) {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const {userDetails, saveUserDetails} = useUser()
  const {refresh} = useRouter()
  // @ts-ignore
  const {supabase} = useSupabase()
  const setHelp = userHelp(state => state.setHelp)

  useEffect(() => {
    setRun(start)
  }, [start])

  useEffect(() => {
    setHelp(id ?? '')
  }, [id])

  const updateUser = async (field: Record<string, boolean>) => {
    // const {error} = await supabase.auth.updateUser(field)
    const {error} = await supabase
      .from('users')
      .update(field)
      .eq('id', userDetails?.id)

    if (error) toastAlert({message: error.message, type: 'error'})
    else {
      // supabase.auth.refreshSession()
      // if (id === 'onboarding') {
      //   // window.location.reload()
      // } else {
      saveUserDetails({...userDetails, ...field})
      // refresh()
      // }
    }
  }

  const handleJoyrideCallback = (data: any) => {
    const {action, index, status, type} = data

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      if (id) {
        updateUser({[id]: true})
      }
      // setRun(false)
    }
    // console.groupCollapsed(type)
    // console.log(data)
    // console.groupEnd()
  }

  return (
    <Joyride
      tooltipComponent={props => <TooltipStep showHelp={showHelp} {...props} />}
      callback={handleJoyrideCallback}
      continuous
      run={run}
      stepIndex={stepIndex}
      steps={steps}
      showProgress
      showSkipButton
      disableOverlayClose
      styles={{
        options: {
          zIndex: 10000,
        },
        overlay: {
          // mixBlendMode: 'darken' as const,
          backgroundColor: 'rgba(0, 0, 15, 0.5)',
        },
      }}
    />
  )
}

OnboardingReports.displayName = 'OnboardingReports'

export default OnboardingReports
