import Sidebar from "@/app/components/ui/student-sidebar";
import Navbar from "@/app/components/ui/navbar";

interface StudentLayoutProps {
    children: React.ReactNode;
}
const StudentLayout = ({children} : StudentLayoutProps) => {
    return ( <div className="pt-[60px]">{children}</div> );
}
 
export default StudentLayout;