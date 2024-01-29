import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const SectionTitle = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

export { SectionTitle };