import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Spacer, Text, useToast, VStack, HStack } from '@chakra-ui/react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DrawerExample from './Drawer';
import CartDrawer from './CartDrawer';
import { useCart } from '../Context/CartContext';
import {
  POINTER,
} from '../constants/typography';
import axios from 'axios';
import { BASE_URL1 } from '../constants/config';
import { FiShoppingBag } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { FiLogIn } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const [count, setCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hideTimeout, setHideTimeout] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuth, token, name } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartStatus } = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();
  const toast = useToast();
  const { isCartOpen, openCart, closeCart } = useCart();
  
  // Проверяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === '/';
  
  // Определяем цвет элементов: на главной странице в десктопе всегда черный, на мобильных - белый когда не скроллишь
  // На остальных страницах всегда черный
  const getElementColor = () => {
    if (!isHomePage) return "black";
    if (isScrolled) return "black";
    // На главной странице без скролла: на мобильных белый, на десктопе черный
    return { base: "white", md: "black" };
  };
  
  const elementColor = getElementColor();

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    // Проверяем начальную позицию скролла
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let getCount = async () => {
      try {
      let res = await axios({
        method: 'get',
        url: BASE_URL1 + '/cart',
        headers: {
          Authorization: token,
        },
      });
      if (res.data.status == 1) {
        setCount(res.data.count);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (isAuth) {
      getCount();
    } else {
      setCount(0);
    }
  }, [cartStatus, isAuth, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL1}/categories/`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const getSubcategoryLink = (subcategory, parentCategory) => {
    const gender = subcategory.gender || parentCategory.gender || "female";
    const slug = subcategory.slug || subcategory.title?.toLowerCase().replace(/\s+/g, '-') || '';
    return `/products?itemGender=${gender}&category=${slug}`;
  };

  const getCategoryLink = (category) => {
    const gender = category.gender || (category.title?.toLowerCase().includes("kid") ? "kids" : category.title?.toLowerCase().includes("men") ? "male" : "female");
    return `/products?itemGender=${gender}`;
  };

  const handleCategoryEnter = (category) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setHoveredCategory(category);
  };

  const handleCategoryLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 200); // Задержка 200ms перед скрытием
    setHideTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
    setHideTimeout(timeout);
  };

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        backgroundColor={
          isHomePage 
            ? { base: isScrolled ? "white" : "transparent", md: "white" }
            : "white"
        }
        zIndex="999"
        p={{ base: "0.6em 0.8em", sm: "0.8em 1em", md: "0.9em 1.5em", lg: "1em 2em" }}
        paddingTop={{ base: "0.8em", sm: "1em", md: "1.1em", lg: "1.2em" }}
        transition="background-color 0.3s ease"
        boxShadow={isHomePage && !isScrolled ? "none" : "sm"}
      >
        <Flex 
          alignItems="center" 
          justifyContent="space-between"
          width="100%"
          position="relative"
        >
          {/* Mobile: Menu Button and Search */}
          <Flex display={{ base: "flex", md: "none" }} alignItems="center" gap="15px">
            <Box>
              <DrawerExample isScrolled={isScrolled} isHomePage={isHomePage} />
            </Box>
            <Box
              as="button"
              onClick={() => navigate('/search')}
              background="none"
              border="none"
              padding="0"
              cursor="pointer"
              _hover={{ opacity: 0.7 }}
              transition="opacity 0.2s"
            >
              <Box
                as="span"
                sx={{
                  '& svg': {
                    color: typeof elementColor === 'object' ? elementColor.base : elementColor,
                    '@media (min-width: 768px)': {
                      color: typeof elementColor === 'object' ? elementColor.md : elementColor,
                    }
                  }
                }}
              >
                <FiSearch size={20} />
              </Box>
            </Box>
          </Flex>

          {/* Desktop: Left Menu - Categories */}
          <Flex
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            gap={{ base: "20px", md: "20px", lg: "30px" }}
            position="relative"
          >
            {categories.map((category) => {
              const categoryTitle = category.title || category.name || 'Category';
              const categoryId = category.id;
              const isHovered = hoveredCategory === categoryId;
              const subcategories = category.subcategories || [];
              
              return (
                <Box
                  key={categoryId}
                  position="relative"
                  onMouseEnter={() => handleCategoryEnter(categoryId)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link
                    to={getCategoryLink(category)}
                    style={{ textDecoration: 'none' }}
                >
                  <Text
                    fontSize={{ base: "11px", md: "11px", lg: "12px" }}
                    fontWeight="400"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    cursor={POINTER}
                      color={typeof elementColor === 'object' ? elementColor.base : elementColor}
                      sx={{
                        '@media (min-width: 768px)': {
                          color: typeof elementColor === 'object' ? elementColor.md : elementColor,
                        }
                      }}
                    _hover={{ opacity: 0.7 }}
                    transition="all 0.2s"
                  >
                    {categoryTitle}
                  </Text>
                  </Link>
                  {isHovered && subcategories.length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left="0"
                      mt="10px"
                      backgroundColor="white"
                      border="1px solid #e5e5e5"
                      padding="20px"
                      minWidth="200px"
                      zIndex="1000"
                      boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                      sx={{
                        animation: 'fadeInDown 0.3s ease-out',
                        '@keyframes fadeInDown': {
                          '0%': {
                            opacity: 0,
                            transform: 'translateY(-10px)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                      <VStack alignItems="flex-start" spacing="12px">
                        {/* Ссылка на все товары категории - всегда первая */}
                        <Link
                          to={getCategoryLink(category)}
                          style={{ textDecoration: 'none' }}
                        >
                          <Text
                            fontSize="12px"
                            fontWeight="400"
                            letterSpacing="0.5px"
                            color="black"
                            _hover={{ opacity: 0.7 }}
                            transition="opacity 0.2s"
                          >
                            Все товары
                          </Text>
                        </Link>
                        {subcategories.map((subcategory) => {
                          const subcategoryTitle = subcategory.title || subcategory.name || 'Subcategory';
                          const subcategoryLink = getSubcategoryLink(subcategory, category);
                          return (
                            <Link
                              key={subcategory.id}
                              to={subcategoryLink}
                              style={{ textDecoration: 'none' }}
                            >
                              <Text
                                fontSize="12px"
                                fontWeight="400"
                                letterSpacing="0.5px"
                                color="black"
                                _hover={{ opacity: 0.7 }}
                                transition="opacity 0.2s"
                              >
                                {subcategoryTitle}
                              </Text>
                            </Link>
                          );
                        })}
                      </VStack>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Flex>

          {/* Logo in Center */}
          <Box
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            display={{ base: "block", md: "block" }}
            paddingTop={{ base: "5px", md: "8px" }}
          >
            <NavLink to="/">
                <Image
                maxHeight={{ base: "35px", md: "40px", lg: "45px" }}
                src="/logo.svg"
                alt="Liberty Logo"
                filter={isHomePage && !isScrolled ? { base: "brightness(0) invert(1)", md: "none" } : "none"}
                sx={{
                  '@media (min-width: 768px)': {
                    filter: isHomePage && !isScrolled ? "none" : "none",
                  }
                }}
                transition="filter 0.3s ease"
              />
            </NavLink>
          </Box>

          {/* Spacer for centering */}
          <Spacer />

          {/* Desktop: Right Menu - About, Contacts, FAQ, Avatar, Cart */}
          <Flex
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            gap={{ base: "15px", md: "15px", lg: "25px" }}
            justifyContent="flex-end"
          >
            <NavLink to="/about">
              <Text
                fontSize={{ base: "11px", md: "11px", lg: "12px" }}
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                color="black"
                _hover={{ opacity: 0.7 }}
                transition="opacity 0.2s"
              >
                О компании
              </Text>
            </NavLink>

            <NavLink to="/contacts">
              <Text
                fontSize={{ base: "11px", md: "11px", lg: "12px" }}
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                color="black"
                _hover={{ opacity: 0.7 }}
                transition="opacity 0.2s"
              >
                Контакты
              </Text>
            </NavLink>

            <NavLink to="/faq">
              <Text
                fontSize={{ base: "11px", md: "11px", lg: "12px" }}
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                color="black"
                _hover={{ opacity: 0.7 }}
                transition="opacity 0.2s"
              >
                FAQ
              </Text>
            </NavLink>

            <Flex alignItems="center" gap={{ base: "10px", md: "12px", lg: "15px" }}>
              {isAuth ? (
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  background="none"
                  border="none"
                  padding="0"
                  cursor={POINTER}
                  onClick={() => navigate('/profile')}
                  _hover={{ opacity: 0.7 }}
                  transition="opacity 0.2s"
                >
                  <Box
                    as="span"
                    display="inline-flex"
                    sx={{
                      '& svg': {
                        strokeWidth: 1.5,
                      }
                    }}
                  >
                    <Box
                      as="span"
                      sx={{
                        '& svg': {
                          color: typeof elementColor === 'object' ? elementColor.base : elementColor,
                          '@media (min-width: 768px)': {
                            color: typeof elementColor === 'object' ? elementColor.md : elementColor,
                          }
                        }
                      }}
                    >
                      <FiUser size={22} strokeWidth={1.5} />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  background="none"
                  border="none"
                  padding="0"
                  cursor={POINTER}
                  onClick={() => navigate('/login')}
                  _hover={{ opacity: 0.7 }}
                  transition="opacity 0.2s"
                >
                  <Box
                    as="span"
                    display="inline-flex"
                    sx={{
                      '& svg': {
                        strokeWidth: 1.5,
                      }
                    }}
                  >
                    <Box
                      as="span"
                      sx={{
                        '& svg': {
                          color: typeof elementColor === 'object' ? elementColor.base : elementColor,
                          '@media (min-width: 768px)': {
                            color: typeof elementColor === 'object' ? elementColor.md : elementColor,
                          }
                        }
                      }}
                    >
                      <FiLogIn size={22} strokeWidth={1.5} />
                    </Box>
                  </Box>
                </Box>
              )}
              <Box 
                display="flex" 
                alignItems="center"
                cursor={POINTER}
                position="relative"
                onClick={() => {
                  if (isAuth) {
                    openCart();
                  } else {
                    toast({
                      title: "Требуется регистрация",
                      description: "Пожалуйста, войдите в систему, чтобы просмотреть корзину.",
                      status: "warning",
                      duration: 3000,
                      position: "top",
                      isClosable: true,
                      borderRadius: "0",
                      containerStyle: {
                        fontFamily: "'Manrope', sans-serif",
                      },
                    });
                    navigate('/login')
                  }
                }}
                _hover={{ opacity: 0.7 }}
                transition="all 0.2s"
              >
                <Box
                  as="span"
                  display="inline-flex"
                  sx={{
                    '& svg': {
                      strokeWidth: 1.2,
                      color: 'black',
                    }
                  }}
                >
                  <FiShoppingBag size={22} />
                </Box>
                {count > 0 && (
                  <Box
                    position="absolute"
                    right="-8px"
                    top="-6px"
                    fontSize="10px"
                    fontWeight="600"
                    backgroundColor="black"
                    color="white"
                    borderRadius="50%"
                    minWidth="18px"
                    height="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    paddingX="4px"
                    animation={count > 0 ? "pulse 0.5s ease-in-out" : "none"}
                    key={count}
                    sx={{
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.2)" },
                        "100%": { transform: "scale(1)" }
                      }
                    }}
                  >
                    {count > 99 ? "99+" : count}
                  </Box>
                )}
              </Box>
            </Flex>
          </Flex>

          {/* Mobile: Avatar and Cart */}
          <Flex
            display={{ base: 'flex', md: 'none' }}
            alignItems="center"
            gap={{ base: "12px", sm: "15px" }}
          >
            {isAuth ? (
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                background="none"
                border="none"
                padding="0"
                cursor={POINTER}
                onClick={() => navigate('/profile')}
                _hover={{ opacity: 0.7 }}
                transition="opacity 0.2s"
              >
                <Box
                  as="span"
                  sx={{
                    '& svg': {
                      color: typeof elementColor === 'object' ? elementColor.base : elementColor,
                      '@media (min-width: 768px)': {
                        color: typeof elementColor === 'object' ? elementColor.md : elementColor,
                      }
                    }
                  }}
                >
                  <FiUser size={22} strokeWidth={1.5} />
                </Box>
              </Box>
            ) : (
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                background="none"
                border="none"
                padding="0"
                cursor={POINTER}
                onClick={() => navigate('/login')}
                _hover={{ opacity: 0.7 }}
                transition="opacity 0.2s"
              >
                <Box
                  as="span"
                  display="inline-flex"
                  sx={{
                    '& svg': {
                      strokeWidth: 1.5,
                    }
                  }}
                >
                  <Box
                    as="span"
                    sx={{
                      '& svg': {
                        color: typeof elementColor === 'object' ? elementColor.base : elementColor,
                        '@media (min-width: 768px)': {
                          color: typeof elementColor === 'object' ? elementColor.md : elementColor,
                        }
                      }
                    }}
                  >
                    <FiLogIn size={22} strokeWidth={1.5} />
                  </Box>
                </Box>
              </Box>
            )}
            <Box 
              cursor={POINTER}
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={{ base: "32px", sm: "36px" }}
              height={{ base: "32px", sm: "36px" }}
              onClick={() => {
                if (isAuth) {
                  openCart();
                } else {
                  toast({
                    title: "Требуется регистрация",
                    description: "Пожалуйста, войдите в систему, чтобы просмотреть корзину.",
                    status: "warning",
                    duration: 3000,
                    position: "top",
                    isClosable: true,
                    borderRadius: "0",
                    containerStyle: {
                      fontFamily: "'Manrope', sans-serif",
                    },
                  });
                  navigate('/login')
                }
              }}
              _hover={{ opacity: 0.7 }}
              transition="all 0.2s"
            >
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  '& svg': {
                    strokeWidth: 1.2,
                    color: typeof elementColor === 'object' ? elementColor.base : elementColor,
                    '@media (min-width: 768px)': {
                      color: typeof elementColor === 'object' ? elementColor.md : elementColor,
                    },
                    transition: 'color 0.2s',
                  }
                }}
              >
                <FiShoppingBag size={20} />
              </Box>
              {count > 0 && (
                <Box
                  position="absolute"
                  right={{ base: "-4px", sm: "-6px" }}
                  top={{ base: "-4px", sm: "-4px" }}
                  fontSize={{ base: "9px", sm: "10px" }}
                  fontWeight="600"
                  backgroundColor="black"
                  color="white"
                  borderRadius="50%"
                  minWidth={{ base: "16px", sm: "18px" }}
                  height={{ base: "16px", sm: "18px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  paddingX={{ base: "3px", sm: "4px" }}
                  animation={count > 0 ? "pulse 0.5s ease-in-out" : "none"}
                  key={count}
                  sx={{
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.2)" },
                      "100%": { transform: "scale(1)" }
                    }
                  }}
                >
                  {count > 99 ? "99+" : count}
                </Box>
              )}
            </Box>
          </Flex>
        </Flex>
      </Box>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
