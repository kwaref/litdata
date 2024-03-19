import Header from '@/components/ui/Header'
import Sidebar from '@/components/ui/sidebar'
import LayoutChildrenWrapper from './layout-children-wrapepr'
import 'react-toastify/dist/ReactToastify.min.css'

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {id: string}
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Content area */}
      <div className="relative flex flex-1 flex-col">
        {/*  Site header */}
        <Header />

        <LayoutChildrenWrapper params={params}>{children}</LayoutChildrenWrapper>
      </div>
    </div>
  )
}
