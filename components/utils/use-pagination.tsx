/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

export type FiltersPath = string

type InitialStateProps = {
  limit: number
  offset: number
}

const initialState: InitialStateProps = {
  limit: 10,
  offset: 0,
}

export const usePagination = (enabled: boolean = true) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentParams = new URLSearchParams(Array.from(searchParams.entries())) // -> has to use this form

  const [limit, setLimit] = useState<number>(initialState.limit)
  const [offset, setOffset] = useState<number>(initialState.offset)

  const updateParams = (currentParams: any) => {
    const search = currentParams.toString()
    const query = search ? `?${search}` : ''

    router.push(`${pathname}${query}`)
  }

  useEffect(() => {
    enabled && updateQuery(initialState)
  }, [enabled])

  useEffect(() => {
    const _limit = Number(searchParams.get('limit'))
    const _offset = Number(searchParams.get('offset'))

    setLimit(_limit)
    setOffset(_offset)
  }, [searchParams])

  const updateQuery = (query: InitialStateProps) => {
    const _limit = query.limit
    const _offset = query.offset

    currentParams.set('limit', _limit.toString())
    currentParams.set('offset', _offset.toString())
    updateParams(currentParams)
  }

  const onNext = () => {
    const next = offset + 1
    updateQuery({limit, offset: next})
    // setOffset(next)
  }

  const onPrev = () => {
    const next = offset - 1
    updateQuery({limit, offset: next})
    // setOffset(next)
  }

  return {
    limit,
    offset,
    onNext,
    onPrev,
    enabled,
  }
}
