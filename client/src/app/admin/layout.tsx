import { SidebarProvider, SidebarTrigger,SidebarInset } from "@/components/ui/sidebar"
import  {AppSidebar}  from "@/components/admin/app-sidebar"
import AuthCheck from "@/components/auth/authCheck"
import { UserRole } from "@/types/authTypes"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      < AuthCheck
        allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} 
        redirectTo="/login"
        fallback={
          <div className="flex items-center justify-center min-h-screen flex-col">
            <div className="text-2xl font-bold mb-4">Access Denied</div>
            <div className="text-gray-600">You don&apos;t have permission to access this page.</div>
          </div>
        }>
         <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthCheck>
    )
  }