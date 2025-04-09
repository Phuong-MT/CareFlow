import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import  {AppSidebar}  from "@/components/app-sidebar"
import AuthCheck from "@/components/auth/authCheck"
import { UserRole } from "@/types/authTypes"
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
              <SidebarTrigger />
                {children}
          </SidebarProvider>
      </AuthCheck>
    )
  }