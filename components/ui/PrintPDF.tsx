'use client'

import {useCallback, useEffect, useRef} from 'react'
import {useReactToPrint} from 'react-to-print'
import {create} from 'zustand'

interface PdfStoreProps {
  componentRef: any
  loading: boolean
  documentTitle: string
  setComponentRef: (componentRef: any) => void
  setLoading: (loading: boolean) => void
  setDocumentTitle: (documentTitle: string) => void
}

export const pdfStore = create<PdfStoreProps>()(set => ({
  componentRef: null,
  loading: false,
  documentTitle: '',
  setComponentRef: (componentRef: any) => set({componentRef}),
  setLoading: (loading: boolean) => set({loading}),
  setDocumentTitle: (documentTitle: string) => set({documentTitle}),
}))

interface UsePrintPDFProps {
  afterPrint?: () => void
  beforePrint?: () => void
  beforeGetContent?: () => void
}

function usePrintPDF({afterPrint, beforePrint, beforeGetContent}: UsePrintPDFProps) {
  const componentRef = pdfStore(state => state.componentRef)
  const documentTitle = pdfStore(state => state.documentTitle)
  const loading = pdfStore(state => state.loading)
  const setLoading = pdfStore(state => state.setLoading)

  const onBeforeGetContentResolve = useRef(null)

  const handleAfterPrint = useCallback(() => {
    console.log('`onAfterPrint` called')
    afterPrint?.()
  }, [])

  const handleBeforePrint = useCallback(() => {
    console.log('`onBeforePrint` called')
    beforePrint?.()
  }, [])

  const handleOnBeforeGetContent = useCallback(async () => {
    console.log('`onBeforeGetContent` called')
    beforeGetContent?.()
    setLoading(true)

    return await new Promise(resolve => {
      // @ts-ignore
      onBeforeGetContentResolve.current = resolve

      setTimeout(() => {
        setLoading(false)
        // @ts-ignore
        resolve()
      }, 2000)
    })
  }, [setLoading])

  const reactToPrintContent = useCallback(() => {
    return componentRef?.current
  }, [componentRef?.current])

  const handlePrint = useReactToPrint({
    documentTitle,
    content: reactToPrintContent,
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    pageStyle: `
      @media all {
        .page-break {
          display: none;
        }
      }
      
      @media print {
        html, body {
          height: initial !important;
          overflow: initial !important;
          -webkit-print-color-adjust: exact;
        }
      }
      
      @media print {
        .page-break {
          margin-top: 1rem;
          display: block;
          page-break-before: always;
        }
        
        .header {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999;
          width: 100%;
        }
        
        .watermark {
          position: fixed;
          top: 50vh;
          z-index: 9;
          width: 50vw;
          page-break-after: always;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: .1;
        }
      }
      
      @page {
        size: auto;
        margin: 60px 30px;
        margin-top: 0;

        @top-right {
          content: "Page " counter(page);
        }
      }
      `,
    // removeAfterPrint: true,
  })

  useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === 'function') {
      // @ts-ignore
      onBeforeGetContentResolve.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBeforeGetContentResolve.current])

  return {
    loading,
    handlePrint,
  }
}

export default usePrintPDF
