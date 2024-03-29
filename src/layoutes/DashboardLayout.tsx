import { useState } from "react";
//import { UserContext } from "../auth/UserContext";
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import FlashMessage from "../components/common/FlashMessage";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});
const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));
export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
 // const currentUser = useContext(UserContext);
  // const navigate = useNavigate();
  return(
    
   <RootStyle>
     <div className="sidebar">
     <DashboardNavbar
              onOpenSidebar={() => setOpen(true)}
          //    onLogout={handleLogout}
          
            />
     </div>
     <div className="sidebar">
     <DashboardSidebar
              isOpenSidebar={open}
              onCloseSidebar={() => setOpen(false)}
            />
      </div>
      <MainStyle>
      <FlashMessage/>
          <Outlet />
        </MainStyle>
        <style>{`
        @media print {
          .sidebar {
            display: none;
          }
        }
      `}</style>
   </RootStyle>
  )
}