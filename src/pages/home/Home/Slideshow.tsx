import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material';

interface Slide {
  id: number;
  image: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'tra.jpg',
    alt: 'Slide 1',
  },
  {
    id: 2,
    image: 'car.jpg',
    alt: 'car 2',
  },
  {
    id: 3,
    image: 'electronics.jpeg',
    alt: 'Slide 3',
  },
];

const SlideshowContainer = styled('div')`
  position: relative;
  width: 100%;
  height: 500px; /* Adjust the height to your desired value */
  overflow: hidden;

  @media (max-width: 768px) {
    height: 300px; /* Adjust the height for small screens */
  }
`;

const SlideImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlideNavigationContainer = styled('div')`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

const SlideNavigationButton = styled('button')`
  background-color: transparent;
  border: none;
  color: green; /* Change the color to green */
  font-size: 20px;
  margin: 0 10px;
  cursor: pointer;
`;

const Slideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <SlideshowContainer>
      <SlideImage
        src={require(`../../../assets/${slides[currentIndex].image}`)}
        alt={slides[currentIndex].alt}
      />
      <SlideNavigationContainer>
        <SlideNavigationButton onClick={goToPreviousSlide}>Previous</SlideNavigationButton>
        <SlideNavigationButton onClick={goToNextSlide}>Next</SlideNavigationButton>
      </SlideNavigationContainer>
    </SlideshowContainer>
  );
};

export default Slideshow;