import { alpha, styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import LanguageSelector from './LanguageSelector';
import NotificationComponent from './Notification';

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(1, 5),
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
  [theme.breakpoints.up('lg')]: {
    marginLeft: theme.spacing(2),
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.5rem',
  },
}));
const ActionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

interface DashboardNavbarProps {
  onOpenSidebar?: () => void;
}

export default function DashboardNavbar({
  onOpenSidebar
}: DashboardNavbarProps) {

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <LogoWrapper>
          <LogoText variant="h6">ET Pro-forma</LogoText>
        </LogoWrapper>


        <ActionWrapper>
          <LanguageSelector />
          <NotificationComponent />

        </ActionWrapper>
      </ToolbarStyle>
    </RootStyle>
  )
        }