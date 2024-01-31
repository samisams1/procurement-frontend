import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Navbar from "./navBar";

const APP_BAR_MOBILE = 40;
const APP_BAR_DESKTOP = 10;

const RootStyle = styled('div')({
  display: 'flex',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  paddingTop: APP_BAR_MOBILE,
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
}));

export default function Layout() {

  return (
    <RootStyle>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="sidebar"></div>
      <MainStyle>
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
  );
}