import React, {type ReactNode, useEffect, useRef, useState} from 'react'
import {cn} from '../utils/tailwindMerge'

export default function RevealOnScroll({children}: {children: ReactNode}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<any>(null)

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        scrollObserver.unobserve(entry.target)
      }
    })

    scrollObserver.observe(ref.current)

    return () => {
      if (ref.current) {
        scrollObserver.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn('transition-opacity ease-in duration-700 opacity-0 [visibility:hidden]', {
        'opacity-100 [visibility:visible]': isVisible,
      })}
    >
      {children}
    </div>
  )
}
