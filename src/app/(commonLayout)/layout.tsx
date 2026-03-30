import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/Navbar";

const CommonLayout = ({ children } : { children: React.ReactNode }) => {
    return (
        <>  
            <PublicNavbar/>
            
            {children}
            <Footer/>
        </>
    );
};

export default CommonLayout;