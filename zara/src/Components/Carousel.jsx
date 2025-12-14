import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL1 } from '../constants/config';

// Fallback слайды
const fallbackSlides = [
  {
    id: 1,
    to: '/products?itemGender=female',
    src: 'https://static.zara.net/assets/public/6007/e0b0/a3134fc88ae9/047974663766/image-landscape-fit-96a634fb-54a7-435a-9944-4d6721871138-default_0/image-landscape-fit-96a634fb-54a7-435a-9944-4d6721871138-default_0.jpg?ts=1764949555700&w=1920',
    alt: 'Collection highlight 1',
  },
  {
    id: 2,
    to: '/products?itemGender=male',
    src: 'https://static.zara.net/assets/public/38a6/ca41/5d4d49de8264/1ef862f79b1f/image-landscape-fit-fcbfb4cd-40c8-4a9d-947e-a3bf1c8e777d-default_0/image-landscape-fit-fcbfb4cd-40c8-4a9d-947e-a3bf1c8e777d-default_0.jpg?ts=1764951550717&w=1920',
    alt: 'Collection highlight 2',
  },
  {
    id: 3,
    to: '/products?itemGender=girls',
    src: 'https://static.zara.net/assets/public/475a/8a4d/35764da1bd58/5c28abd0dd5a/image-landscape-fill-83f5cdd6-5c1b-44c6-bdb8-f367c37f77c6-default_0/image-landscape-fill-83f5cdd6-5c1b-44c6-bdb8-f367c37f77c6-default_0.jpg?ts=1764259546735&w=1920',
    alt: 'Collection highlight 3',
  },
];

const Carouselll = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const imageRefs = useRef({});
  const preloadRefs = useRef({});

  // Определяем мобильную версию
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Обновляем изображения при изменении размера экрана
  useEffect(() => {
    if (slides.length > 0 && isReady) {
      // Перезагружаем текущее изображение при изменении размера
      setImagesLoaded({});
      setIsReady(false);
    }
  }, [isMobile]);

  // Загрузка слайдов из API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${BASE_URL1}/slider/?active_only=true`);
        if (res.data && res.data.length > 0) {
          const formattedSlides = res.data.map(slide => ({
            id: slide.id,
            to: slide.link || '#',
            src: slide.image_url_desktop,
            srcMobile: slide.image_url_mobile || slide.image_url_desktop,
            alt: slide.alt_text || slide.title || 'Slide',
          }));
          setSlides(formattedSlides);
        } else {
          // Используем fallback слайды
          setSlides(fallbackSlides);
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
        // Используем fallback слайды при ошибке
        setSlides(fallbackSlides);
      }
    };
    fetchSlides();
  }, []);

  // Агрессивная предзагрузка всех изображений + предзагрузка соседних
  useEffect(() => {
    if (slides.length === 0) return;
    
    let loadedCount = 0;
    const totalImages = slides.length;
    const loadedImages = {};

    // Функция для загрузки изображения
    const loadImage = (slide, index, isPreload = false) => {
      return new Promise((resolve, reject) => {
        // Определяем какое изображение загружать (мобильное или десктопное)
        const imageSrc = isMobile && slide.srcMobile ? slide.srcMobile : slide.src;
        
        const img = new Image();
        
        img.onload = () => {
          if (!isPreload) {
            loadedImages[index] = true;
            imageRefs.current[index] = img;
            loadedCount++;
            
            if (loadedCount === totalImages) {
              setImagesLoaded(loadedImages);
              setIsReady(true);
            }
          } else {
            preloadRefs.current[index] = img;
          }
          resolve(img);
        };
        
        img.onerror = () => {
          if (!isPreload) {
            loadedImages[index] = true;
            loadedCount++;
            if (loadedCount === totalImages) {
              setImagesLoaded(loadedImages);
              setIsReady(true);
            }
          }
          reject();
        };
        
        // Приоритетная загрузка
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.src = imageSrc;
      });
    };

    // Загружаем все изображения параллельно
    const loadPromises = slides.map((slide, index) => loadImage(slide, index));
    
    // Также предзагружаем в фоне
    Promise.all(loadPromises).catch(() => {
      // Даже если некоторые не загрузились, продолжаем
      setImagesLoaded(loadedImages);
      setIsReady(true);
    });
  }, [slides, isMobile]);

  // Предзагрузка следующего и предыдущего изображения
  useEffect(() => {
    if (!isReady || slides.length === 0) return;

    const nextIndex = (currentIndex + 1) % slides.length;
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;

    // Предзагружаем следующее
    if (!preloadRefs.current[nextIndex] && slides[nextIndex]) {
      const imageSrc = isMobile && slides[nextIndex].srcMobile ? slides[nextIndex].srcMobile : slides[nextIndex].src;
      const img = new Image();
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.src = imageSrc;
      preloadRefs.current[nextIndex] = img;
    }

    // Предзагружаем предыдущее
    if (!preloadRefs.current[prevIndex] && slides[prevIndex]) {
      const imageSrc = isMobile && slides[prevIndex].srcMobile ? slides[prevIndex].srcMobile : slides[prevIndex].src;
      const img = new Image();
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.src = imageSrc;
      preloadRefs.current[prevIndex] = img;
    }
  }, [currentIndex, isReady, slides, isMobile]);



  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentIndex(index);
  };

  if (!isReady || slides.length === 0) {
    return (
      <Box
        width="100%"
        height={{ base: '70vh', md: '60vh', lg: '70vh' }}
        backgroundColor="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="40px"
          height="40px"
          border="3px solid #e5e5e5"
          borderTop="3px solid black"
          borderRadius="50%"
          animation="spin 1s linear infinite"
          sx={{
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      position="relative"
      overflow="hidden"
      height={{ base: '70vh', sm: '70vh', md: '60vh', lg: '70vh' }}
      userSelect="none"
      backgroundColor="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="relative"
        width="100%"
        height="100%"
        minHeight="100%"
        overflow="hidden"
      >
        <Box
          display="flex"
          width={`${slides.length * 100}%`}
          height="100%"
          transform={`translateX(-${currentIndex * (100 / slides.length)}%)`}
          transition="transform 0.5s ease-in-out"
        >
          {slides.map((slide, index) => (
            <Box
              key={slide.id}
              width={`${100 / slides.length}%`}
              height="100%"
              flexShrink={0}
              display="flex"
              alignItems={{ base: 'stretch', md: 'flex-end' }}
              justifyContent="center"
            >
              <Link 
                to={slide.to || '#'} 
                style={{ 
                  display: 'flex', 
                  width: '100%', 
                  height: '100%', 
                  alignItems: 'flex-end',
                  justifyContent: 'center' 
                }}
              >
                <Box
                  position="relative"
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="flex-end"
                  justifyContent="center"
                >
                  <Box
                    as="img"
                    src={
                      isMobile && slide.srcMobile
                        ? slide.srcMobile
                        : slide.src || ''
                    }
                    alt={slide.alt || 'Slide'}
                    width="100%"
                    height="100%"
                    objectFit={{ base: 'cover', md: 'contain' }}
                    objectPosition={{ base: 'center center', md: 'center bottom' }}
                    display="block"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    style={{
                      imageRendering: 'auto',
                      willChange: 'transform',
                      filter: imagesLoaded[index] ? 'none' : 'blur(10px)',
                      transition: 'filter 0.3s ease-out',
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.filter = 'none';
                      setImagesLoaded(prev => ({ ...prev, [index]: true }));
                    }}
                    sx={{
                      transition: 'opacity 0.2s ease-in-out',
                      opacity: imagesLoaded[index] ? 1 : 0.8,
                    }}
                  />
                </Box>
              </Link>
            </Box>
          ))}
        </Box>

        {/* Navigation Arrows */}
        <Box
          position="absolute"
          left={{ base: '10px', md: '15px' }}
          top="50%"
          zIndex={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          bg="transparent"
          w="auto"
          h="auto"
          p="0"
          onClick={() => paginate(-1)}
          aria-label="Previous slide"
          sx={{
            transform: 'translateY(-50%)',
            '& svg': {
              strokeWidth: '1.5',
              transition: 'all 0.2s ease',
            },
            '&:hover svg': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
            '&:active svg': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <Box
            as={FiChevronLeft}
            size={28}
            strokeWidth={1.5}
            color="black"
            opacity={0.7}
          />
        </Box>

        <Box
          position="absolute"
          right={{ base: '10px', md: '15px' }}
          top="50%"
          zIndex={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          bg="transparent"
          w="auto"
          h="auto"
          p="0"
          onClick={() => paginate(1)}
          aria-label="Next slide"
          sx={{
            transform: 'translateY(-50%)',
            '& svg': {
              strokeWidth: '1.5',
              transition: 'all 0.2s ease',
            },
            '&:hover svg': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
            '&:active svg': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <Box
            as={FiChevronRight}
            size={28}
            strokeWidth={1.5}
            color="black"
            opacity={0.7}
          />
        </Box>

      </Box>
      
      {/* Indicators - moved to outer container */}
      <Flex
        position="absolute"
        bottom={{ base: '20px', md: '30px', lg: '40px' }}
        left="50%"
        transform="translateX(-50%)"
        zIndex={10}
        gap="8px"
        alignItems="center"
        justifyContent="center"
      >
          {slides.map((slide, index) => (
            <Box
              key={slide.id}
              width={currentIndex === index ? "50px" : "40px"}
              height="2px"
              backgroundColor={currentIndex === index ? "black" : "#e5e5e5"}
              cursor="pointer"
              onClick={() => goToSlide(index)}
              transition="all 0.3s ease"
              _hover={{ transform: 'scale(1.1)' }}
            />
          ))}
      </Flex>
    </Box>
  );
};

export default Carouselll;
