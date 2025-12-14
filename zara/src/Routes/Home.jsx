import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Carouselll from "../Components/Carousel";
import { BASE_URL1 } from "../constants/config";
import axios from "axios";
import { FiPlus, FiArrowRight, FiChevronRight, FiChevronLeft, FiArrowUpRight } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

const Home = () => {
  const { isAuth, token } = useSelector((state) => state.authReducer);
  const toast = useToast();
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState({});
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const categoriesScrollRef = useRef(null);
  const fallbackCategories = [
    { id: 1, title: "WOMEN", gender: "female", image: "https://i.pinimg.com/736x/20/d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg" },
    { id: 2, title: "MEN", gender: "male", image: "https://i.pinimg.com/736x/20/d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg" },
    { id: 3, title: "KIDS", gender: "kids", image: "https://i.pinimg.com/736x/20/d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg" },
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL1}/cloths?page=0&limit=6`);
        if (res.data.data) {
          // Преобразуем данные из новой структуры бэкенда в формат, ожидаемый фронтендом
          const transformedData = res.data.data.slice(0, 6).map(product => {
            // Берем первый вариант для отображения (или создаем дефолтный)
            const firstVariant = product.variants && product.variants.length > 0 
              ? product.variants[0] 
              : null;
            
            // Собираем все изображения из всех вариантов
            const allImages = [];
            if (product.variants) {
              product.variants.forEach(variant => {
                if (variant.images && variant.images.length > 0) {
                  variant.images.forEach(img => {
                    if (img.image_url) allImages.push(img.image_url);
                  });
                }
                if (variant.color_image) {
                  allImages.push(variant.color_image);
                }
              });
            }
            
            return {
              _id: product.id,
              id: product.id,
              productName: product.name,
              name: product.name,
              price: firstVariant ? firstVariant.price : 0,
              imageURL: allImages.length > 0 ? allImages.join(',') : '',
              description: product.description,
              variants: product.variants || []
            };
          });
          setFeaturedProducts(transformedData);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL1}/categories/`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories(fallbackCategories);
      }
    };
    fetchCategories();
  }, []);

  // Загрузка избранного при монтировании и при изменении авторизации
  useEffect(() => {
    // Получаем токен из Redux или localStorage (с fallback на sessionStorage для обратной совместимости)
    const authToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
    const authStatus = isAuth || localStorage.getItem('isAuth') === 'true' || sessionStorage.getItem('isAuth') === 'true';
    
    if (authStatus && authToken) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`${BASE_URL1}/favorites/`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (response.data && Array.isArray(response.data)) {
            // Преобразуем все ID в числа для правильного сравнения
            const favoriteIds = response.data.map(fav => {
              const id = fav.product_id || fav.id;
              return Number(id);
            }).filter(id => !isNaN(id));
            setFavorites(favoriteIds);
          } else {
            setFavorites([]);
          }
        } catch (error) {
          // Игнорируем ошибки 401/404 при загрузке избранного
          if (error.response?.status === 401 || error.response?.status === 404) {
            setFavorites([]);
          } else {
            console.error('Error fetching favorites:', error);
            // При других ошибках не очищаем избранное
          }
        }
      };
      fetchFavorites();
    } else {
      // Если пользователь не авторизован, очищаем избранное
      setFavorites([]);
    }
  }, [isAuth, token]);

  // Проверка, в избранном ли товар
  const isFavorite = (productId) => {
    if (!productId) return false;
    // Преобразуем productId в число для сравнения
    const numericId = Number(productId);
    if (isNaN(numericId)) {
      return false;
    }
    // Проверяем, есть ли этот ID в массиве избранного
    // Преобразуем все элементы массива favorites в числа для сравнения
    const numericFavorites = favorites.map(f => {
      // Если это число, возвращаем как есть, иначе преобразуем
      return typeof f === 'number' ? f : Number(f);
    }).filter(f => !isNaN(f));
    const result = numericFavorites.includes(numericId);
    return result;
  };

  // Добавление/удаление из избранного
  const handleToggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('handleToggleFavorite called with productId:', productId);
    console.log('Current favorites:', favorites);
    
    // Валидация productId
    if (!productId || productId === undefined || productId === null) {
      console.error('Invalid productId:', productId);
      toast({
        title: "Ошибка",
        description: "Не удалось определить товар",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Преобразуем productId в число
    const numericProductId = Number(productId);
    if (isNaN(numericProductId)) {
      console.error('productId is not a number:', productId);
      toast({
        title: "Ошибка",
        description: "Неверный идентификатор товара",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Получаем токен из Redux или localStorage (с fallback на sessionStorage для обратной совместимости)
    const authToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
    const authStatus = isAuth || localStorage.getItem('isAuth') === 'true' || sessionStorage.getItem('isAuth') === 'true';
    
    console.log('Auth check - isAuth:', isAuth, 'authStatus:', authStatus, 'hasToken:', !!authToken);
    
    if (!authStatus || !authToken) {
      console.warn('User not authenticated');
      toast({
        title: "Войдите в аккаунт",
        description: "Для добавления в избранное необходимо войти",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log('Setting loading state for product:', numericProductId);
    setFavoritesLoading(prev => ({ ...prev, [numericProductId]: true }));
    
    const isCurrentlyFavorite = isFavorite(numericProductId);
    console.log('Is currently favorite:', isCurrentlyFavorite);

    try {
      console.log('Entering try block, checking isFavorite again...');
      const checkAgain = isFavorite(numericProductId);
      console.log('Second check result:', checkAgain);
      
      if (checkAgain) {
        console.log('Product is favorite, removing...');
        // Удаляем из избранного
        await axios.delete(`${BASE_URL1}/favorites/${numericProductId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        // После успешного удаления перезагружаем список избранного с сервера для синхронизации
        try {
          const response = await axios.get(`${BASE_URL1}/favorites/`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (response.data && Array.isArray(response.data)) {
            const favoriteIds = response.data.map(fav => Number(fav.product_id)).filter(id => !isNaN(id));
            setFavorites(favoriteIds);
          } else {
            setFavorites([]);
          }
        } catch (fetchError) {
          // Если не удалось загрузить, удаляем из состояния
          const numericFavorites = favorites.map(f => Number(f)).filter(f => !isNaN(f));
          setFavorites(numericFavorites.filter(id => id !== numericProductId));
        }
        
        toast({
          title: "Удалено",
          description: "Товар удален из избранного",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // Добавляем в избранное
        console.log('Entering else block - adding to favorites');
        console.log('Adding product to favorites, productId:', numericProductId);
        
        try {
          console.log('Sending POST request to add favorite...');
          const addResponse = await axios.post(`${BASE_URL1}/favorites/`, 
            { product_id: numericProductId },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
          console.log('Add favorite response:', addResponse.data);
          
          // После успешного добавления перезагружаем список избранного с сервера для синхронизации
          console.log('Reloading favorites list...');
          const response = await axios.get(`${BASE_URL1}/favorites/`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          console.log('Reloaded favorites:', response.data);
          
          if (response.data && Array.isArray(response.data)) {
            const favoriteIds = response.data.map(fav => Number(fav.product_id)).filter(id => !isNaN(id));
            console.log('Setting favorites to:', favoriteIds);
            setFavorites(favoriteIds);
          }
          
        toast({
          title: "Добавлено",
          description: "Товар добавлен в избранное",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        } catch (addError) {
          console.error('Error adding favorite:', addError);
          console.error('Error response:', addError.response?.data);
          console.error('Error status:', addError.response?.status);
          
          // Если ошибка 400, товар уже был добавлен, просто синхронизируем
          if (addError.response?.status === 400) {
            console.log('400 error - product already in favorites, syncing...');
            console.log('Using token for sync:', authToken ? authToken.substring(0, 20) + '...' : 'NO TOKEN');
            try {
              const response = await axios.get(`${BASE_URL1}/favorites/`, {
                headers: { Authorization: `Bearer ${authToken}` }
              });
              console.log('Sync response status:', response.status);
              console.log('Sync response data:', response.data);
              console.log('Sync response data type:', typeof response.data, 'isArray:', Array.isArray(response.data));
              
              if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const favoriteIds = response.data.map(fav => {
                  const id = fav.product_id || fav.id;
                  console.log('Favorite item:', fav, 'extracted id:', id);
                  return Number(id);
                }).filter(id => !isNaN(id));
                console.log('Synced favorites after 400:', favoriteIds);
                setFavorites(favoriteIds);
              } else {
                console.warn('Sync response is empty or not an array:', response.data);
                // Если товар уже в избранном (400 ошибка), но список пустой, проверяем через check endpoint
                try {
                  const checkResponse = await axios.get(`${BASE_URL1}/favorites/check/${numericProductId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                  });
                  console.log('Check favorite response:', checkResponse.data);
                  if (checkResponse.data?.is_favorite) {
                    console.log('Product confirmed in favorites via check endpoint, adding to state');
                    const numericFavorites = favorites.map(f => Number(f)).filter(f => !isNaN(f));
                    if (!numericFavorites.includes(numericProductId)) {
                      const updatedFavorites = [...numericFavorites, numericProductId];
                      console.log('Updated favorites:', updatedFavorites);
                      setFavorites(updatedFavorites);
                    }
                  } else {
                    console.log('Product not in favorites according to check endpoint');
                  }
                } catch (checkError) {
                  console.error('Error checking favorite:', checkError);
                  // Если проверка не удалась, все равно добавляем товар в состояние вручную
                  const numericFavorites = favorites.map(f => Number(f)).filter(f => !isNaN(f));
                  if (!numericFavorites.includes(numericProductId)) {
                    console.log('Manually adding product to favorites state (got 400 but empty list)');
                    const updatedFavorites = [...numericFavorites, numericProductId];
                    console.log('Updated favorites:', updatedFavorites);
                    setFavorites(updatedFavorites);
                  }
                }
              }
            } catch (syncError) {
              console.error('Error syncing favorites:', syncError);
              console.error('Sync error response:', syncError.response?.data);
              console.error('Sync error status:', syncError.response?.status);
              
              // Пробуем проверить через check endpoint
              try {
                const checkResponse = await axios.get(`${BASE_URL1}/favorites/check/${numericProductId}`, {
                  headers: { Authorization: `Bearer ${authToken}` }
                });
                console.log('Check favorite response:', checkResponse.data);
                if (checkResponse.data?.is_favorite) {
                  console.log('Product confirmed in favorites via check endpoint');
                  const numericFavorites = favorites.map(f => Number(f)).filter(f => !isNaN(f));
                  if (!numericFavorites.includes(numericProductId)) {
                    console.log('Adding product to state based on check endpoint');
                    setFavorites([...numericFavorites, numericProductId]);
                  }
                }
              } catch (checkError) {
                console.error('Error checking favorite:', checkError);
                // Если проверка не удалась, все равно добавляем товар в состояние вручную
                const numericFavorites = favorites.map(f => Number(f)).filter(f => !isNaN(f));
                if (!numericFavorites.includes(numericProductId)) {
                  console.log('Manually adding product to favorites state after sync error');
                  setFavorites([...numericFavorites, numericProductId]);
                }
              }
            }
            // Не показываем ошибку - товар уже был в избранном
          } else {
            // Другие ошибки
            console.error('Unexpected error adding favorite');
            toast({
              title: "Ошибка",
              description: addError.response?.data?.detail || "Не удалось добавить в избранное",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }
    } catch (error) {
      // Если ошибка 401, токен истек
      if (error.response?.status === 401) {
        console.error('Authentication error:', error);
        toast({
          title: "Сессия истекла",
          description: "Пожалуйста, войдите в аккаунт снова",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else if (error.response?.status === 400) {
        // Если товар уже в избранном (400 ошибка), обновляем состояние
        const errorMessage = error.response?.data?.detail || "";
        
        // Проверяем, что это ошибка "уже в избранном"
        const isAlreadyFavorite = errorMessage.includes("already in favorites") || 
                                  errorMessage.includes("уже в избранном") || 
                                  errorMessage.toLowerCase().includes("already");
        
        if (isAlreadyFavorite) {
          // Товар уже в избранном - это нормальная ситуация
          // Перезагружаем список избранного для синхронизации
          try {
            const response = await axios.get(`${BASE_URL1}/favorites/`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            if (response.data && Array.isArray(response.data)) {
              // Преобразуем все ID в числа
              const favoriteIds = response.data.map(fav => Number(fav.product_id)).filter(id => !isNaN(id));
              setFavorites(favoriteIds);
              // Товар уже был в избранном, состояние синхронизировано
            }
          } catch (fetchError) {
            // Если не удалось загрузить, добавляем в состояние (если еще нет)
            const numericFavorites = favorites.map(f => Number(f)).filter(f => !isNaN(f));
            if (!numericFavorites.includes(numericProductId)) {
              setFavorites([...numericFavorites, numericProductId]);
            }
          }
          // Не показываем ошибку - это нормальная ситуация
      } else {
          // Другая ошибка 400 - возможно, товар не найден или другая проблема
          console.error('400 error (other):', error.response?.data);
          toast({
            title: "Ошибка",
            description: errorMessage || "Не удалось добавить в избранное",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // Другие ошибки
        console.error('Error toggling favorite:', error);
        toast({
          title: "Ошибка",
          description: error.response?.data?.detail || "Не удалось изменить избранное",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setFavoritesLoading(prev => ({ ...prev, [numericProductId]: false }));
    }
  };

  return (
    <Box
      paddingTop={{ base: "0px", md: "10px" }}
      marginTop={{ base: "-60px", sm: "-70px", md: "0" }}
      sx={{
        "@keyframes fadeInDown": {
          from: {
            opacity: 0,
            transform: "translateY(-20px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "@keyframes slideInLeft": {
          from: {
            opacity: 0,
            transform: "translateX(-30px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        "@keyframes slideInRight": {
          from: {
            opacity: 0,
            transform: "translateX(30px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        "@keyframes fadeIn": {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        "@keyframes scaleIn": {
          from: {
            opacity: 0,
            transform: "scale(0.9)",
          },
          to: {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    >
      {/* Hero Carousel Section */}
      <Box
        width="100%"
        marginTop={{ base: "0", md: "0" }}
        marginBottom={{ base: "30px", sm: "40px", md: "50px", lg: "60px" }}
        position={{ base: "relative", md: "static" }}
        sx={{
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        <Carouselll />
      </Box>

      {/* Categories Section */}
      <Box
        width="100%"
        paddingX={{ base: "0", sm: "15px", md: "30px", lg: "40px", xl: "60px" }}
        marginBottom={{ base: "40px", sm: "50px", md: "60px", lg: "80px" }}
      >
        {/* Заголовок с навигацией для мобильной версии */}
        <Flex
          display={{ base: "flex", md: "none" }}
          justifyContent="space-between"
          alignItems="center"
          marginBottom="20px"
          paddingX="15px"
      >
        <Heading
            fontSize="14px"
            fontWeight="400"
            letterSpacing="1px"
            textTransform="uppercase"
            fontFamily="'Manrope', sans-serif"
            color="black"
            margin="0"
          >
            Покупайте по категориям
          </Heading>
          <Flex gap="10px" alignItems="center">
            <Box
              as="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const container = categoriesScrollRef.current;
                if (container) {
                  const firstChild = container.firstElementChild;
                  if (firstChild) {
                    const cardWidth = firstChild.offsetWidth;
                    const gap = 15;
                    const scrollAmount = cardWidth + gap;
                    const newScrollLeft = container.scrollLeft - scrollAmount;
                    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                  }
                }
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="32px"
              height="32px"
              borderRadius="50%"
              border="1px solid black"
              backgroundColor="transparent"
              cursor="pointer"
              _hover={{ 
                backgroundColor: "black",
              }}
              transition="all 0.3s ease"
              sx={{
                '& svg': {
                  transition: 'color 0.3s ease',
                  color: 'black',
                },
                '&:hover svg': {
                  color: 'white !important',
                }
              }}
            >
              <FiChevronLeft size={18} />
            </Box>
            <Box
              as="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const container = categoriesScrollRef.current;
                if (container) {
                  const firstChild = container.firstElementChild;
                  if (firstChild) {
                    const cardWidth = firstChild.offsetWidth;
                    const gap = 15;
                    const scrollAmount = cardWidth + gap;
                    const newScrollLeft = container.scrollLeft + scrollAmount;
                    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                  }
                }
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="32px"
              height="32px"
              borderRadius="50%"
              border="1px solid black"
              backgroundColor="transparent"
              cursor="pointer"
              _hover={{ 
                backgroundColor: "black",
              }}
              transition="all 0.3s ease"
              sx={{
                '& svg': {
                  transition: 'color 0.3s ease',
                  color: 'black',
                },
                '&:hover svg': {
                  color: 'white !important',
                }
              }}
            >
              <FiChevronRight size={18} />
            </Box>
          </Flex>
        </Flex>

        {/* Заголовок для десктопной версии */}
        <Heading
          display={{ base: "none", md: "block" }}
          fontSize={{ md: "18px", lg: "20px", xl: "22px" }}
          fontWeight="400"
          textAlign="center"
          marginBottom={{ md: "40px", lg: "50px" }}
          letterSpacing={{ md: "2px" }}
          textTransform="uppercase"
          fontFamily="'Manrope', sans-serif"
          color="black"
          sx={{
            animation: "fadeInDown 0.5s ease-out",
          }}
        >
          Покупайте по категориям
        </Heading>
        
        {/* Мобильная версия - горизонтальная карусель */}
        <Box
          display={{ base: "block", md: "none" }}
          width="100%"
          position="relative"
        >
          <Box
            ref={categoriesScrollRef}
            overflowX="auto"
            overflowY="hidden"
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <Flex
              gap="15px"
              paddingX="15px"
              width="max-content"
              minWidth="100%"
        >
          {(categories.length ? categories : fallbackCategories).map((category, index) => {
            const categoryTitle = category.title || category.name || 'Category';
            const gender = category.gender || (categoryTitle.toLowerCase().includes("kid") ? "kids" : categoryTitle.toLowerCase().includes("men") ? "male" : "female");
            const link = `/products?itemGender=${gender}`;
            const categoryImage = category.image || "https://i.pinimg.com/736x/20/d6/3c/20d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg";
            const uniqueKey = category.id || category._id || `category-${index}`;
            return (
                <Link key={uniqueKey} to={link} style={{ display: 'block', flexShrink: 0 }}>
              <Box
                position="relative"
                overflow="hidden"
                cursor="pointer"
                    height="350px"
                    width="280px"
                borderRadius="0"
                _hover={{
                  transform: "scale(1.02)",
                  transition: "transform 0.3s ease",
                  '& .category-overlay': {
                    opacity: 1,
                  },
                      '& .category-arrow': {
                    opacity: 1,
                        transform: 'scale(1)',
                  },
                  '& .category-image': {
                    transform: 'scale(1.1)',
                  },
                }}
                transition="transform 0.3s ease"
                sx={{
                  animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <Image
                  className="category-image"
                  src={categoryImage}
                  alt={categoryTitle}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  display="block"
                  transition="transform 0.5s ease"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  background="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                      padding="20px"
                >
                  <Text
                    color="white"
                        fontSize="18px"
                    fontWeight="600"
                        letterSpacing="2px"
                    textTransform="uppercase"
                    fontFamily="'Manrope', sans-serif"
                  >
                    {categoryTitle}
                  </Text>
                </Box>
                    {/* Стрелка в круге в правом нижнем углу */}
                    <Box
                      className="category-arrow"
                      position="absolute"
                      bottom="20px"
                      right="20px"
                      width="32px"
                      height="32px"
                      borderRadius="50%"
                      border="1px solid white"
                      backgroundColor="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      opacity={0}
                      transition="opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease"
                      transform="scale(0.8)"
                      zIndex={10}
                      sx={{
                        '& svg': {
                          transition: 'color 0.3s ease',
                          color: 'black',
                        },
                        '.category-overlay:hover &': {
                          opacity: 1,
                          transform: 'scale(1)',
                          backgroundColor: 'black',
                          borderColor: 'black',
                          '& svg': {
                            color: 'white !important',
                          }
                        }
                      }}
                    >
                      <FiArrowUpRight size={18} />
                </Box>
                <Box
                  className="category-overlay"
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                      backgroundColor="rgba(0, 0, 0, 0.3)"
                  opacity={0}
                  transition="opacity 0.3s ease"
                    />
                  </Box>
                </Link>
              );
            })}
            </Flex>
          </Box>
        </Box>

        {/* Десктопная версия - сетка */}
        <SimpleGrid
          display={{ base: "none", md: "grid" }}
          columns={{ md: 2, lg: 3 }}
          spacing={{ md: "30px", lg: "40px" }}
          width="100%"
        >
          {(categories.length ? categories : fallbackCategories).map((category, index) => {
            const categoryTitle = category.title || category.name || 'Category';
            const gender = category.gender || (categoryTitle.toLowerCase().includes("kid") ? "kids" : categoryTitle.toLowerCase().includes("men") ? "male" : "female");
            const link = `/products?itemGender=${gender}`;
            const categoryImage = category.image || "https://i.pinimg.com/736x/20/d6/3c/20d6/3c/20d63cc19a9ff1426777d54e49c94147.jpg";
            const uniqueKey = category.id || category._id || `category-${index}`;
            return (
            <Link key={uniqueKey} to={link} style={{ width: '100%', display: 'block' }}>
              <Box
                position="relative"
                overflow="hidden"
                cursor="pointer"
                height={{ md: "350px", lg: "400px", xl: "500px" }}
                borderRadius="0"
                width="100%"
                marginX="0"
                _hover={{
                  transform: "scale(1.02)",
                  transition: "transform 0.3s ease",
                  '& .category-overlay': {
                    opacity: 1,
                  },
                  '& .category-arrow': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  '& .category-image': {
                    transform: 'scale(1.1)',
                  },
                }}
                transition="transform 0.3s ease"
                sx={{
                  animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <Image
                  className="category-image"
                  src={categoryImage}
                  alt={categoryTitle}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  display="block"
                  transition="transform 0.5s ease"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  background="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                  padding={{ md: "30px" }}
                >
                  <Text
                    color="white"
                    fontSize={{ md: "22px", lg: "24px", xl: "28px" }}
                    fontWeight="600"
                    letterSpacing={{ md: "3px" }}
                    textTransform="uppercase"
                    fontFamily="'Manrope', sans-serif"
                  >
                    {categoryTitle}
                  </Text>
                </Box>
                {/* Стрелка в круге в правом нижнем углу */}
                <Box
                  className="category-arrow"
                  position="absolute"
                  bottom={{ md: "30px" }}
                  right={{ md: "30px" }}
                  width="32px"
                  height="32px"
                  borderRadius="50%"
                  border="1px solid white"
                  backgroundColor="white"
                  display="flex"
                      alignItems="center"
                  justifyContent="center"
                  opacity={0}
                  transition="opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease"
                  transform="scale(0.8)"
                  zIndex={10}
                      sx={{
                        '& svg': {
                      transition: 'color 0.3s ease',
                      color: 'black',
                        },
                    '.category-overlay:hover &': {
                      opacity: 1,
                      transform: 'scale(1)',
                      backgroundColor: 'black',
                      borderColor: 'black',
                      '& svg': {
                        color: 'white !important',
                      }
                        }
                      }}
                    >
                  <FiArrowUpRight size={18} />
                    </Box>
                <Box
                  className="category-overlay"
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  backgroundColor="rgba(0, 0, 0, 0.3)"
                  opacity={0}
                  transition="opacity 0.3s ease"
                />
              </Box>
            </Link>
            );
          })}
        </SimpleGrid>
      </Box>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <Box
          width="100%"
          paddingX={{ base: "15px", sm: "20px", md: "30px", lg: "40px", xl: "60px" }}
          marginBottom={{ base: "40px", sm: "50px", md: "60px", lg: "80px" }}
          sx={{
            animation: "fadeIn 0.6s ease-out 0.3s both",
          }}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginBottom={{ base: "25px", sm: "30px", md: "40px", lg: "50px" }}
            flexDirection="row"
            gap={{ base: "10px", sm: "20px", md: "0" }}
            flexWrap="nowrap"
          >
            <Heading
              fontSize={{ base: "14px", sm: "18px", md: "20px", lg: "22px", xl: "24px" }}
              fontWeight="400"
              letterSpacing="1px"
              textTransform="uppercase"
              fontFamily="'Manrope', sans-serif"
              color="black"
              flex="1"
              minWidth="0"
              sx={{
                animation: "fadeInDown 0.5s ease-out 0.4s both",
              }}
            >
              Рекомендуемые товары
            </Heading>
            <Link to="/products?itemGender=female" style={{ flexShrink: 0 }}>
              <Box
                as="button"
                width="32px"
                height="32px"
                borderRadius="50%"
                border="1px solid black"
                backgroundColor="transparent"
                display={{ base: "flex", md: "none" }}
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ 
                  backgroundColor: "black",
                }}
                transition="all 0.3s ease"
                sx={{
                  animation: "slideInRight 0.5s ease-out 0.5s both",
                  '& svg': {
                    transition: 'color 0.3s ease',
                    color: 'black',
                  },
                  '&:hover svg': {
                    color: 'white !important',
                  }
                }}
              >
                <FiChevronRight size={18} />
              </Box>
            </Link>
          </Flex>
          <SimpleGrid
            columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: "15px", sm: "20px", md: "25px", lg: "30px" }}
            width="100%"
          >
            {featuredProducts.map((product, index) => {
              const productKey = product._id || product.id || `product-${index}`;
              const productId = product._id || product.id;
              const images = product.imageURL?.split(",").filter(img => img && img.trim()) || [];
              const firstImage = images[0] || '';
              const secondImage = images[1] || images[0] || '';
              const hasMultipleImages = images.length > 1;

              return (
              <Link 
                key={productKey} 
                to={`/products/${productId}`}
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Box
                  cursor="pointer"
                  backgroundColor="white"
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                  }}
                  transition="transform 0.3s ease"
                  sx={{
                    animation: `scaleIn 0.5s ease-out ${0.6 + index * 0.1}s both`,
                  }}
                >
                  <Box
                    overflow="hidden"
                    marginBottom="15px"
                    backgroundColor="#f5f5f5"
                    position="relative"
                    height={{ base: "250px", sm: "300px", md: "350px", lg: "400px" }}
                  >
                    <Box
                      position="relative"
                      width="100%"
                      height="100%"
                      sx={{
                        '& .image-main': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 1,
                          transition: 'opacity 0.5s ease-in-out',
                        },
                        '& .image-hover': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          transition: 'opacity 0.5s ease-in-out',
                        },
                        '&:hover .image-main': {
                          opacity: hasMultipleImages ? 0 : 1,
                        },
                        '&:hover .image-hover': {
                          opacity: hasMultipleImages ? 1 : 0,
                        },
                      }}
                    >
                      {firstImage ? (
                        <Image 
                          className="image-main"
                          src={firstImage} 
                          alt={product.productName || product.name || 'Product'}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          _hover={{
                            transform: "scale(1.05)",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      ) : (
                        <Box 
                          width="100%" 
                          height="100%" 
                          backgroundColor="#f5f5f5"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="14px" color="gray.400">Нет изображения</Text>
                        </Box>
                      )}
                      {hasMultipleImages && secondImage && (
                        <Image 
                          className="image-hover"
                          src={secondImage} 
                          alt={product.productName || product.name || 'Product'}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          _hover={{
                            transform: "scale(1.05)",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Stack spacing="8px">
                    <Text
                      fontSize={{ base: "13px", sm: "14px", md: "15px", lg: "16px" }}
                      fontWeight="500"
                      textTransform="capitalize"
                      letterSpacing="0.5px"
                      noOfLines={2}
                      fontFamily="'Manrope', sans-serif"
                    >
                      {product.productName?.charAt(0).toUpperCase() + product.productName?.slice(1) || "Product"}
                    </Text>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text 
                        fontSize={{ base: "14px", sm: "16px", md: "17px", lg: "18px" }} 
                        fontWeight="600"
                        fontFamily="'Manrope', sans-serif"
                      >
                        {parseInt(product.price || 0).toLocaleString('ru-RU')} UZS
                      </Text>
                      <Flex alignItems="center" gap="12px">
                        <Box 
                          cursor="pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle add to cart
                          }}
                          _hover={{ opacity: 0.7 }}
                          transition="opacity 0.2s"
                        >
                          <FiPlus size={18} strokeWidth={1} color="#000000" />
                        </Box>
                        <Box 
                          cursor="pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Heart icon clicked for product:', product._id || product.id);
                            handleToggleFavorite(e, product._id || product.id);
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          _hover={{ opacity: 0.7 }}
                          transition="opacity 0.2s"
                          opacity={favoritesLoading[product._id || product.id] ? 0.5 : 1}
                          title={isFavorite(product._id || product.id) ? "Удалить из избранного" : "Добавить в избранное"}
                          position="relative"
                          zIndex={10}
                        >
                          {isFavorite(product._id || product.id) ? (
                            <AiFillHeart size={20} color="#000000" fill="#000000" />
                          ) : (
                            <AiOutlineHeart size={20} color="#000000" />
                          )}
                        </Box>
                      </Flex>
                    </Flex>
                  </Stack>
                </Box>
              </Link>
              );
            })}
          </SimpleGrid>
        </Box>
      )}

    </Box>
  );
};

export default Home;
