interface DashboardLayoutProps {
    children: React.ReactNode;
}
const DashboardLayout = ({children} : DashboardLayoutProps) => {
    return ( <div className="pt-[60px]">{children}</div> );
}
 
export default DashboardLayout;