import React, { useState } from 'react';
import { Grid, Typography, IconButton, Box } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));
const TestimonialsContainer = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: theme.spacing(2),
    overflowX: 'auto',
    maxWidth: '100%',
  
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  }));
const TestimonialWrapper = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  width: '180px',

  [theme.breakpoints.down('sm')]: {
    width: '140px',
  },
}));

const TestimonialImage = styled('img')({
  width: '100%',
  borderRadius: '50%',
  cursor: 'pointer',
});

const TestimonialName = styled(Typography)({
  fontWeight: 'bold',
});

interface Testimonial {
  id: number;
  name: string;
  image: string;
  message: string;
}

const Testimonials: React.FC = () => {
  const testimonies: Testimonial[] = [
    {
      id: 1,
      name: 'John Doe',
      image: 'teda.jpeg',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: 'sad.jpeg',
      message: 'Nullam in nunc quis felis aliquet dignissim non vitae lorem.',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      image: 'ode.jpg',
      message: 'Etiam maximus facilisis cursus. Sed posuere venenatis luctus.',
    },
    { 
    id: 4,
    name: 'Mike Johnson',
    image: 'ronald.jpeg',
    message: 'Etiam maximus facilisis cursus. Sed posuere venenatis luctus.',
  },
  { 
  id: 5,
  name: 'Mike Johnson',
  image: 'caregi.jpeg',
  message: 'Etiam maximus facilisis cursus. Sed posuere venenatis luctus.',
},
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [displayedTestimonies, setDisplayedTestimonies] = useState<Testimonial[]>(testimonies.slice(0, 2));

  const handlePrev = () => {
    const newStartIndex = Math.max(startIndex - 1, 0);
    setStartIndex(newStartIndex);
    const newDisplayedTestimonies = testimonies.slice(newStartIndex, newStartIndex + 2);
    setDisplayedTestimonies(newDisplayedTestimonies);
  };

  const handleNext = () => {
    const newStartIndex = Math.min(startIndex + 1, testimonies.length - 2);
    setStartIndex(newStartIndex);
    const newDisplayedTestimonies = testimonies.slice(newStartIndex, newStartIndex + 2);
    setDisplayedTestimonies(newDisplayedTestimonies);
  };

  const handleImageClick = (testimonial: Testimonial) => {
    console.log(`Clicked on ${testimonial.name}'s image`);
  };

  return (
    <Grid item xs={12} md={6}>
      <SectionTitle variant="h5">Testimonials</SectionTitle>
      <TestimonialsContainer>
        {startIndex > 0 && (
          <IconButton onClick={handlePrev} sx={{ color: 'primary.main' }}>
            <ArrowBack />
          </IconButton>
        )}

        <Box style={{ display: 'flex', overflowX: 'scroll', maxWidth: '100%' }}>
          {displayedTestimonies.map((testimonial, index) => (
            <React.Fragment key={testimonial.id}>
              <TestimonialWrapper>
                <TestimonialImage
                  src={require(`../../../assets/${testimonial.image}`)} 
                  alt={testimonial.name}
                  onClick={() => handleImageClick(testimonial)}
                />
                <Typography>
                  {testimonial.message.length > 15
                    ? `${testimonial.message.substring(0, 15)}...`
                    : testimonial.message}
                </Typography>
                <TestimonialName>{testimonial.name}</TestimonialName>
              </TestimonialWrapper>         
              
                   {index < displayedTestimonies.length - 1 && <div style={{ width: '16px' }} />}
            </React.Fragment>
          ))}
        </Box>

        {startIndex < testimonies.length - 2 && (
          <IconButton onClick={handleNext} sx={{ color: 'primary.main' }}>
            <ArrowForward />
          </IconButton>
        )}
      </TestimonialsContainer>
    </Grid>
  );
};

export default Testimonials;