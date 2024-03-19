/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {create} from 'zustand'

// export type FiltersPath = 'list' | 'create' | 'add' | 'edit' | null
export type FiltersPath = string | null

interface FiltersStore {
  path: FiltersPath
  questionID: any
  hasUnsavedChanges: boolean
  isOpen: boolean
  setPath: (path: FiltersPath) => void
  setQuestion: (data: any) => void
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void
  toogleOpen: () => void
}

// todo add state for edit view
export const filtersStore = create<FiltersStore>()(set => ({
  path: null,
  questionID: null,
  hasUnsavedChanges: false,
  isOpen: false,
  setPath: (path: FiltersPath) => set({path}),
  setQuestion: (questionID: any) => set({questionID}),
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => set({hasUnsavedChanges}),
  toogleOpen: () => set(state => ({isOpen: !state.isOpen})),
}))

export const useReportFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentParams = new URLSearchParams(Array.from(searchParams.entries())) // -> has to use this form

  const path = filtersStore(state => state.path)
  const updatePath = filtersStore(state => state.setPath)

  const questionID = filtersStore(state => state.questionID)
  const updateQuestion = filtersStore(state => state.setQuestion)

  const hasUnsavedChanges = filtersStore(state => state.hasUnsavedChanges)
  const setHasUnsavedChanges = filtersStore(state => state.setHasUnsavedChanges)

  const updateParams = (currentParams: any) => {
    const search = currentParams.toString()
    const query = search ? `?${search}` : ''

    router.push(`${pathname}${query}`)
  }

  useEffect(() => {
    const filtersPath = searchParams.get('filtersPath') || 'list'
    const question_id = searchParams.get('question_id')

    !path && setPath(filtersPath)

    if (question_id && !filtersPath?.includes('edit')) {
      currentParams.delete('question_id')
      updateParams(currentParams)
      updateQuestion(null)
    }

    if (question_id && filtersPath?.includes('edit')) updateQuestion(question_id)
  }, [searchParams, path, currentParams])

  const setPath = (path: FiltersPath) => {
    updatePath(path)
    currentParams.set('filtersPath', path!)
    updateParams(currentParams)
  }

  const setQuestion = (id: string) => {
    updateQuestion(id)
    currentParams.set('question_id', id)
    updateParams(currentParams)
  }

  return {
    path,
    setPath,
    resetPath: () => updatePath('list'),
    questionID,
    setQuestion,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  }
}
