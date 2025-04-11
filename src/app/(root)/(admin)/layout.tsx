import Sidebar from "@/app/components/ui/admin-sidebar";
import Navbar from "@/app/components/ui/navbar";

interface AdminLayoutProps {
    children: React.ReactNode;
}
const AdminLayout = ({children} : AdminLayoutProps) => {
    return ( <div className="pt-[60px]">{children}</div> );
}
 
export default AdminLayout;