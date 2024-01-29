import React, { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
} from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import LanguageSelector from './LanguageSelector';
import AccountPopover from './AccountPopover';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
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

const SearchWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: 400,
  border: '1px solid #ccc',
  borderRadius: 4,
  padding: '4px',
});

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5, 1),
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    transition: theme.transitions.create('width'),
    width: '100%',
    '&:focus': {
      width: '100%',
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/result?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

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

        <SearchWrapper>
          <SearchInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search..."
            startAdornment={<SearchIcon />}
          />
          <SearchButton onClick={handleSearch} text="Search" size="small" />
        </SearchWrapper>

        <ActionWrapper>
          <LanguageSelector />
          <NotificationComponent />
          <AccountPopover />
        </ActionWrapper>
      </ToolbarStyle>
    </RootStyle>
  );
}