import React, { useEffect, useState } from 'react';
import { 
  Box, VStack, HStack, Text, Heading, Divider, Button, useToast,
  Input, FormControl, FormLabel, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure,
  SimpleGrid, Badge, Flex
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../Redux/auth.redux/authAction';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLogOut, FiEdit2, FiPackage, FiCalendar, FiShoppingBag, FiCreditCard, FiTruck, FiHeart, FiX } from 'react-icons/fi';
import { BASE_URL1 } from '../constants/config';
import axios from 'axios';

const Profile = () => {
  const { isAuth, token, name, email, phone, address, city, state, pincode } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOrderOpen, onOpen: onOrderOpen, onClose: onOrderClose } = useDisclosure();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: name || '',
    phone: phone || '',
    address: address || '',
    city: city || '',
    state: state || '',
    pincode: pincode || '',
  });

  useEffect(() => {
    // Проверяем авторизацию (приоритет localStorage, fallback на sessionStorage)
    const storedAuth = localStorage.getItem('isAuth') || sessionStorage.getItem('isAuth');
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Если нет авторизации ни в Redux, ни в localStorage/sessionStorage
    if (!isAuth && storedAuth !== 'true' && !storedToken) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в аккаунт",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    
    // Если авторизован (через Redux или localStorage/sessionStorage)
    if (isAuth || storedAuth === 'true' || storedToken) {
      console.log('User authenticated, fetching orders and favorites...');
      fetchOrders();
      fetchFavorites();
      // Если есть hash #orders, прокручиваем к разделу заказов
      if (window.location.hash === '#orders') {
        setTimeout(() => {
          const ordersSection = document.getElementById('orders-section');
          if (ordersSection) {
            ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      } else if (window.location.hash === '#favorites-section') {
        setTimeout(() => {
          const favoritesSection = document.getElementById('favorites-section');
          if (favoritesSection) {
            favoritesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [isAuth, navigate, toast]);

  useEffect(() => {
    setFormData({
      name: name || '',
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
    });
  }, [name, phone, address, city, state, pincode]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      // Получаем токен из Redux или localStorage (с fallback на sessionStorage)
      const authToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!authToken) {
        setOrdersLoading(false);
        toast({
          title: "Требуется авторизация",
          description: "Пожалуйста, войдите в аккаунт",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${BASE_URL1}/order/`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      // Преобразуем данные из API в формат, ожидаемый компонентом
      const transformedOrders = response.data.map((order) => ({
        id: order.id,
        orderNumber: `ORD-${order.id}`,
        date: order.created_at,
        status: order.order_status,
        total: order.total_amount,
        items: order.items?.length || 0,
        orderItems: order.items?.map((item) => ({
          id: item.id,
          name: item.product_data?.product_name || 'Товар',
          size: item.size || '-',
          color: item.product_data?.variant_name || '-',
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price,
          image: item.product_data?.image_url || '/placeholder.jpg'
        })) || [],
        shippingAddress: order.address || address || 'Не указан',
        paymentMethod: order.payment_method === 'cash' ? 'Наличными' : 'Payme',
        paymentStatus: order.payment_status,
        notes: order.notes || ''
      }));
      
      setOrders(transformedOrders);
      setOrdersLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setOrdersLoading(false);
      // Если ошибка 401, перенаправляем на логин
      if (error.response?.status === 401) {
        // Токен истек или невалидный - очищаем и перенаправляем на логин
        sessionStorage.clear();
        dispatch(authLogout());
        toast({
          title: "Сессия истекла",
          description: "Пожалуйста, войдите в аккаунт снова",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      }
    }
  };

  const fetchFavorites = async () => {
    setFavoritesLoading(true);
    try {
      // Получаем токен из Redux или localStorage (с fallback на sessionStorage)
      const authToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!authToken) {
        console.log('No auth token found');
        setFavoritesLoading(false);
        return;
      }
      
      console.log('Requesting favorites with token:', authToken ? authToken.substring(0, 30) + '...' : 'NO TOKEN');
      const response = await axios.get(`${BASE_URL1}/favorites/`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('Favorites API response status:', response.status);
      console.log('Favorites API response data:', response.data);
      console.log('Favorites API response data type:', typeof response.data, 'isArray:', Array.isArray(response.data));
      
      // Проверяем, что данные - массив
      if (Array.isArray(response.data)) {
        // Проверяем структуру данных
        console.log('Raw response data sample:', response.data.slice(0, 2));
        
        // Фильтруем только валидные записи с product_id
        const validFavorites = response.data.filter(fav => {
          if (!fav) return false;
          const hasProductId = fav.product_id !== undefined && fav.product_id !== null;
          if (!hasProductId) {
            console.warn('Favorite without product_id:', fav);
          }
          return hasProductId;
        });
        console.log('Valid favorites after filter:', validFavorites.length, 'items');
        
        if (validFavorites.length > 0) {
          console.log('First favorite example:', validFavorites[0]);
          console.log('All favorites:', validFavorites);
          setFavorites(validFavorites);
        } else {
          console.warn('No valid favorites found, but response was array');
          console.warn('Raw response data:', response.data);
          // Если список пустой, но товары должны быть, устанавливаем пустой массив
          setFavorites([]);
        }
      } else {
        console.warn('Favorites data is not an array:', response.data);
        setFavorites([]);
      }
      setFavoritesLoading(false);
    } catch (error) {
      setFavoritesLoading(false);
      
      // Если ошибка 404 или пустой ответ, просто устанавливаем пустой массив
      if (error.response?.status === 404) {
        console.log('No favorites found (404)');
        setFavorites([]);
        return;
      }
      
      if (error.response?.status === 401) {
        // Токен истек или невалидный - очищаем и перенаправляем на логин
        console.warn('Authentication failed, redirecting to login');
        localStorage.clear();
        sessionStorage.clear();
        dispatch(authLogout());
        toast({
          title: "Сессия истекла",
          description: "Пожалуйста, войдите в аккаунт снова",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        // Другие ошибки
        console.error('Error fetching favorites:', error.response?.status, error.response?.data);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить избранное",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setFavorites([]);
      }
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      // Получаем токен из Redux или localStorage (с fallback на sessionStorage)
      const authToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!authToken) {
        toast({
          title: "Ошибка",
          description: "Требуется авторизация",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      await axios.delete(`${BASE_URL1}/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setFavorites(favorites.filter(fav => fav.product_id !== productId));
      toast({
        title: "Удалено",
        description: "Товар удален из избранного",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    onOpen();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Заменить на реальный API endpoint для обновления профиля
      // const response = await axios.put(`${BASE_URL1}/user/profile`, formData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Имитация успешного обновления
      setTimeout(() => {
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setIsEditing(false);
        onClose();
        setLoading(false);
        // В реальном приложении здесь нужно обновить Redux store
      }, 500);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: name || '',
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
    });
    setIsEditing(false);
    onClose();
  };

  const handleLogout = () => {
    dispatch(authLogout());
    sessionStorage.clear();
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Доставлен';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'pending':
        return 'Ожидает';
      case 'cancelled':
        return 'Отменен';
      default:
        return status || 'Ожидает';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'green';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (!isAuth) {
    return null;
  }

  return (
    <Box
      minHeight="calc(100vh - 100px)"
      paddingX={{ base: "10px", sm: "15px", md: "40px", lg: "60px" }}
      paddingY={{ base: "30px", sm: "40px", md: "80px", lg: "100px" }}
      backgroundColor="white"
    >
      <Box maxW="1000px" marginX="auto">
        {/* Header Section */}
        <VStack spacing="30px" alignItems="center" mb="50px">
          <Heading
            fontSize={{ base: "20px", md: "24px", lg: "28px" }}
            fontWeight="400"
            letterSpacing="1px"
            textTransform="uppercase"
            textAlign="center"
            width="100%"
          >
            Профиль
          </Heading>

          {/* Avatar and Name */}
          <HStack spacing="20px" alignItems="center" width="100%">
            <Box
              width={{ base: "80px", md: "100px", lg: "120px" }}
              height={{ base: "80px", md: "100px", lg: "120px" }}
              borderRadius="50%"
              backgroundColor="black"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: "28px", md: "36px", lg: "44px" }}
              fontWeight="400"
              letterSpacing="2px"
              flexShrink={0}
            >
              {getInitials(name)}
            </Box>
            <VStack alignItems="flex-start" spacing="8px" flex="1">
              <Text
                fontSize={{ base: "18px", md: "22px", lg: "26px" }}
                fontWeight="400"
                letterSpacing="0.5px"
              >
                {name}
              </Text>
              <Text
                fontSize={{ base: "12px", md: "14px" }}
                color="#666"
              >
                {email}
              </Text>
              <Button
                leftIcon={<FiEdit2 />}
                variant="outline"
                borderRadius="0"
                fontSize={{ base: "11px", md: "12px" }}
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                borderColor="black"
                color="black"
                _hover={{ backgroundColor: "black", color: "white" }}
                onClick={handleEdit}
                size={{ base: "sm", md: "md" }}
              >
                Редактировать
              </Button>
            </VStack>
          </HStack>
        </VStack>

        <Divider mb="40px" borderColor="#e5e5e5" />

        {/* User Information Section */}
        <VStack spacing="30px" alignItems="stretch" mb="50px">
          <Heading
            fontSize={{ base: "16px", md: "18px" }}
            fontWeight="400"
            letterSpacing="1px"
            textTransform="uppercase"
            mb="10px"
          >
            Личная информация
          </Heading>

          <VStack spacing="0" alignItems="stretch">
            {/* Email */}
            <Box
              padding="20px 0"
              borderBottom="1px solid #e5e5e5"
            >
              <HStack spacing="15px" alignItems="flex-start">
                <Box
                  width="32px"
                  height="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="#666"
                  flexShrink={0}
                >
                  <FiMail size={18} />
                </Box>
                <VStack alignItems="flex-start" spacing="5px" flex="1">
                  <Text
                    fontSize={{ base: "10px", md: "11px" }}
                    color="#999"
                    textTransform="uppercase"
                    letterSpacing="1px"
                  >
                    E-mail
                  </Text>
                  <Text
                    fontSize={{ base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    {email || "Не указан"}
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Phone */}
            <Box
              padding="20px 0"
              borderBottom="1px solid #e5e5e5"
            >
              <HStack spacing="15px" alignItems="flex-start">
                <Box
                  width="32px"
                  height="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="#666"
                  flexShrink={0}
                >
                  <FiPhone size={18} />
                </Box>
                <VStack alignItems="flex-start" spacing="5px" flex="1">
                  <Text
                    fontSize={{ base: "10px", md: "11px" }}
                    color="#999"
                    textTransform="uppercase"
                    letterSpacing="1px"
                  >
                    Телефон
                  </Text>
                  <Text
                    fontSize={{ base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    {phone || "Не указан"}
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Address */}
            {(address || city || state || pincode) && (
              <Box
                padding="20px 0"
                borderBottom="1px solid #e5e5e5"
              >
                <HStack spacing="15px" alignItems="flex-start">
                  <Box
                    width="32px"
                    height="32px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="#666"
                    flexShrink={0}
                  >
                    <FiMapPin size={18} />
                  </Box>
                  <VStack alignItems="flex-start" spacing="5px" flex="1">
                    <Text
                      fontSize={{ base: "10px", md: "11px" }}
                      color="#999"
                      textTransform="uppercase"
                      letterSpacing="1px"
                    >
                      Адрес
                    </Text>
                    <Text
                      fontSize={{ base: "14px", md: "16px" }}
                      fontWeight="400"
                      lineHeight="1.6"
                    >
                      {[
                        address,
                        city,
                        state,
                        pincode
                      ].filter(Boolean).join(", ") || "Не указан"}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
          </VStack>
        </VStack>

        <Divider mb="40px" borderColor="#e5e5e5" />

        {/* Main Content Layout: Orders on left, Favorites on right (desktop) */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "40px", lg: "60px" }}
          alignItems="flex-start"
          mb="50px"
        >
          {/* Left Column: Orders Section */}
          <Box flex="1" width={{ base: "100%", lg: "auto" }} id="orders-section">
            <VStack spacing="30px" alignItems="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading
                  fontSize={{ base: "16px", md: "18px" }}
                  fontWeight="400"
                  letterSpacing="1px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Мои заказы
                </Heading>
                {orders.length > 3 && !showAllOrders && (
                  <Button
                    variant="link"
                    fontSize="12px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    color="black"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => setShowAllOrders(true)}
                  >
                    Все
                  </Button>
                )}
              </Flex>

              {ordersLoading ? (
                <Box textAlign="center" padding="40px">
                  <Text color="#666">Загрузка заказов...</Text>
                </Box>
              ) : orders.length === 0 ? (
                <Box
                  padding="40px"
                  backgroundColor="white"
                  border="1px solid #e5e5e5"
                  textAlign="center"
                >
                  <FiPackage size={48} color="#999" style={{ margin: "0 auto 20px" }} />
                  <Text fontSize="14px" color="#666" mb="10px">
                    У вас пока нет заказов
                  </Text>
                  <Button
                    borderRadius="0"
                    fontSize="12px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    color="white"
                    bg="black"
                    _hover={{ backgroundColor: "#333" }}
                    onClick={() => navigate('/products')}
                    size="sm"
                  >
                    Перейти к покупкам
                  </Button>
                </Box>
              ) : (
                <VStack spacing="0" alignItems="stretch">
                  {(showAllOrders ? orders : orders.slice(0, 3)).map((order, index) => (
                    <Box
                      key={order.id}
                      padding={{ base: "20px 0", md: "25px 0" }}
                      borderBottom={index < (showAllOrders ? orders.length : Math.min(orders.length, 3)) - 1 ? "1px solid #e5e5e5" : "none"}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        onOrderOpen();
                      }}
                      _hover={{ backgroundColor: "#fafafa" }}
                      transition="background-color 0.2s"
                    >
                      <Flex
                        direction={{ base: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ base: "flex-start", md: "center" }}
                        gap="15px"
                      >
                        <VStack alignItems="flex-start" spacing="8px" flex="1">
                          <HStack spacing="15px" flexWrap="wrap">
                            <Text
                              fontSize={{ base: "14px", md: "16px" }}
                              fontWeight="500"
                              letterSpacing="0.5px"
                            >
                              {order.orderNumber}
                            </Text>
                            <Badge
                              colorScheme={getStatusColor(order.status)}
                              borderRadius="0"
                              fontSize="10px"
                              paddingX="8px"
                              paddingY="2px"
                              textTransform="uppercase"
                              letterSpacing="0.5px"
                            >
                              {getStatusText(order.status)}
                            </Badge>
                          </HStack>
                          <HStack spacing="20px" fontSize="12px" color="#666">
                            <HStack spacing="5px">
                              <FiCalendar size={14} />
                              <Text>{new Date(order.date).toLocaleDateString('ru-RU')}</Text>
                            </HStack>
                            <HStack spacing="5px">
                              <FiPackage size={14} />
                              <Text>{order.items} {order.items === 1 ? 'товар' : 'товара'}</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                        <Text
                          fontSize={{ base: "16px", md: "18px" }}
                          fontWeight="400"
                          letterSpacing="0.5px"
                        >
                          {order.total.toLocaleString('ru-RU')} UZS
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                  {orders.length > 3 && showAllOrders && (
                    <Button
                      variant="link"
                      fontSize="12px"
                      fontWeight="400"
                      letterSpacing="0.5px"
                      textTransform="uppercase"
                      color="black"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => setShowAllOrders(false)}
                      alignSelf="flex-start"
                    >
                      Свернуть
                    </Button>
                  )}
                </VStack>
              )}
            </VStack>
          </Box>

          {/* Right Column: Favorites Section (Desktop) */}
          <Box
            width={{ base: "100%", lg: "400px" }}
            flexShrink={0}
            id="favorites-section"
          >
            <VStack spacing="30px" alignItems="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading
                  fontSize={{ base: "16px", md: "18px" }}
                  fontWeight="400"
                  letterSpacing="1px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Избранное
                </Heading>
                {favorites.length > 3 && !showAllFavorites && (
                  <Button
                    variant="link"
                    fontSize="12px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    color="black"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => setShowAllFavorites(true)}
                  >
                    Все
                  </Button>
                )}
              </Flex>

              {favoritesLoading ? (
                <Box textAlign="center" padding="40px">
                  <Text color="#666">Загрузка избранного...</Text>
                </Box>
              ) : !Array.isArray(favorites) || favorites.length === 0 ? (
                <Box
                  padding="40px"
                  backgroundColor="white"
                  border="1px solid #e5e5e5"
                  textAlign="center"
                >
                  <FiHeart size={48} color="#999" style={{ margin: "0 auto 20px" }} />
                  <Text fontSize="14px" color="#666" mb="10px">
                    У вас пока нет избранных товаров
                  </Text>
                  <Button
                    borderRadius="0"
                    fontSize="12px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    color="white"
                    bg="black"
                    _hover={{ backgroundColor: "#333" }}
                    onClick={() => navigate('/products')}
                    size="sm"
                  >
                    Перейти к покупкам
                  </Button>
                </Box>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, lg: 1 }}
                  spacing={{ base: "20px", lg: "15px" }}
                >
                  {(showAllFavorites ? favorites : favorites.slice(0, 3)).map((favorite, index) => {
                    if (!favorite.product_id) {
                      console.warn(`Favorite ${index} missing product_id:`, favorite);
                    }
                    return (
                      <Box
                        key={favorite.id || favorite.product_id || index}
                        position="relative"
                        padding={{ base: "15px", md: "20px" }}
                        border="1px solid #e5e5e5"
                        borderRadius="0"
                        cursor="pointer"
                        onClick={() => navigate(`/products/${favorite.product_id}`)}
                        _hover={{
                          borderColor: "black",
                          transform: "translateY(-2px)",
                          transition: "all 0.2s"
                        }}
                        transition="all 0.2s"
                      >
                        {/* Remove Button */}
                        <Button
                          position="absolute"
                          top="10px"
                          right="10px"
                          size="sm"
                          variant="ghost"
                          borderRadius="50%"
                          width="28px"
                          height="28px"
                          padding="0"
                          zIndex={2}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(favorite.product_id);
                          }}
                          _hover={{ backgroundColor: "#f5f5f5" }}
                        >
                          <FiX size={14} color="#666" />
                        </Button>

                        {/* Product Image */}
                        <Box
                          width="100%"
                          height={{ base: "200px", md: "250px", lg: "220px" }}
                          mb="15px"
                          overflow="hidden"
                          backgroundColor="#f5f5f5"
                          position="relative"
                        >
                          {favorite.product_image ? (
                            <img
                              src={
                                favorite.product_image.startsWith('http') 
                                  ? favorite.product_image 
                                  : `${BASE_URL1}${favorite.product_image.startsWith('/') ? '' : '/'}${favorite.product_image}`
                              }
                              alt={favorite.product_name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                              }}
                              onError={(e) => {
                                console.error('Image load error:', favorite.product_image);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontSize="12px" color="#999">Нет изображения</Text>
                            </Box>
                          )}
                        </Box>

                        {/* Product Info */}
                        <VStack alignItems="flex-start" spacing="10px">
                          <Text
                            fontSize={{ base: "14px", md: "16px" }}
                            fontWeight="400"
                            letterSpacing="0.5px"
                            noOfLines={2}
                            lineHeight="1.4"
                          >
                            {favorite.product_name}
                          </Text>
                          {favorite.product_price && (
                            <Text
                              fontSize={{ base: "16px", md: "18px" }}
                              fontWeight="500"
                              letterSpacing="0.5px"
                              color="black"
                            >
                              {favorite.product_price.toLocaleString('ru-RU')} UZS
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              )}
              {favorites.length > 3 && showAllFavorites && (
                <Button
                  variant="link"
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  color="black"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => setShowAllFavorites(false)}
                  alignSelf="flex-start"
                >
                  Свернуть
                </Button>
              )}
            </VStack>
          </Box>
        </Flex>

        <Divider mb="40px" borderColor="#e5e5e5" />

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          borderRadius="0"
          fontSize={{ base: "12px", md: "13px" }}
          fontWeight="400"
          letterSpacing="1px"
          textTransform="uppercase"
          color="white"
          bg="black"
          width="100%"
          maxW="300px"
          paddingY="25px"
          _hover={{
            backgroundColor: "#333",
          }}
          leftIcon={<FiLogOut />}
        >
          Выйти
        </Button>
      </Box>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={handleCancel} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent borderRadius="0">
          <ModalHeader
            fontSize={{ base: "16px", sm: "18px" }}
            fontWeight="400"
            letterSpacing="1px"
            textTransform="uppercase"
            borderBottom="1px solid #e5e5e5"
            paddingY={{ base: "15px", sm: "20px" }}
          >
            Редактировать профиль
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody padding={{ base: "20px", sm: "30px" }}>
            <VStack spacing="20px" alignItems="stretch">
              <FormControl>
                <FormLabel
                  fontSize="11px"
                  color="#999"
                  textTransform="uppercase"
                  letterSpacing="1px"
                  mb="8px"
                >
                  Имя
                </FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  paddingY="12px"
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="11px"
                  color="#999"
                  textTransform="uppercase"
                  letterSpacing="1px"
                  mb="8px"
                >
                  Телефон
                </FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  paddingY="12px"
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="11px"
                  color="#999"
                  textTransform="uppercase"
                  letterSpacing="1px"
                  mb="8px"
                >
                  Адрес
                </FormLabel>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  paddingY="12px"
                />
              </FormControl>

              <SimpleGrid columns={2} spacing="15px">
                <FormControl>
                  <FormLabel
                    fontSize="11px"
                    color="#999"
                    textTransform="uppercase"
                    letterSpacing="1px"
                    mb="8px"
                  >
                    Город
                  </FormLabel>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    borderRadius="0"
                    borderColor="black"
                    borderBottom="1px solid"
                    borderTop="none"
                    borderLeft="none"
                    borderRight="none"
                    _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                    paddingY="12px"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="11px"
                    color="#999"
                    textTransform="uppercase"
                    letterSpacing="1px"
                    mb="8px"
                  >
                    Почтовый индекс
                  </FormLabel>
                  <Input
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    borderRadius="0"
                    borderColor="black"
                    borderBottom="1px solid"
                    borderTop="none"
                    borderLeft="none"
                    borderRight="none"
                    _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                    paddingY="12px"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel
                  fontSize="11px"
                  color="#999"
                  textTransform="uppercase"
                  letterSpacing="1px"
                  mb="8px"
                >
                  Регион
                </FormLabel>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  paddingY="12px"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTop="1px solid #e5e5e5" paddingY="20px">
            <Button
              onClick={handleCancel}
              variant="ghost"
              borderRadius="0"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mr={3}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              isLoading={loading}
              borderRadius="0"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              color="white"
              bg="black"
              _hover={{ backgroundColor: "#333" }}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Order Details Modal */}
      <Modal isOpen={isOrderOpen} onClose={onOrderClose} size={{ base: "full", md: "xl" }}>
        <ModalOverlay />
        <ModalContent borderRadius="0" maxH="90vh" overflowY="auto">
          <ModalHeader
            fontSize="18px"
            fontWeight="400"
            letterSpacing="1px"
            textTransform="uppercase"
            borderBottom="1px solid #e5e5e5"
            paddingY="20px"
          >
            Детали заказа
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody padding="30px">
            {selectedOrder && (
              <VStack spacing="30px" alignItems="stretch">
                {/* Order Header */}
                <VStack spacing="15px" alignItems="flex-start">
                  <HStack spacing="15px" flexWrap="wrap">
                    <Text
                      fontSize="16px"
                      fontWeight="500"
                      letterSpacing="0.5px"
                    >
                      {selectedOrder.orderNumber}
                    </Text>
                    <Badge
                      colorScheme={getStatusColor(selectedOrder.status)}
                      borderRadius="0"
                      fontSize="10px"
                      paddingX="8px"
                      paddingY="2px"
                      textTransform="uppercase"
                      letterSpacing="0.5px"
                    >
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </HStack>
                  <Text fontSize="12px" color="#666">
                    Дата заказа: {new Date(selectedOrder.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </VStack>

                <Divider borderColor="#e5e5e5" />

                {/* Order Items */}
                <VStack spacing="20px" alignItems="stretch">
                  <Heading
                    fontSize="14px"
                    fontWeight="400"
                    letterSpacing="1px"
                    textTransform="uppercase"
                  >
                    Товары
                  </Heading>
                  {selectedOrder.orderItems?.map((item) => (
                    <Box
                      key={item.id}
                      padding="20px"
                      backgroundColor="#fafafa"
                      border="1px solid #e5e5e5"
                    >
                      <HStack spacing="15px" alignItems="flex-start">
                        <Box
                          width="80px"
                          height="80px"
                          backgroundColor="#e5e5e5"
                          flexShrink={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <FiShoppingBag size={24} color="#999" />
                        </Box>
                        <VStack alignItems="flex-start" spacing="8px" flex="1">
                          <Text
                            fontSize="14px"
                            fontWeight="500"
                            letterSpacing="0.5px"
                          >
                            {item.name}
                          </Text>
                          <HStack spacing="15px" fontSize="12px" color="#666" flexWrap="wrap">
                            <Text>Размер: {item.size}</Text>
                            <Text>Цвет: {item.color}</Text>
                            <Text>Количество: {item.quantity}</Text>
                          </HStack>
                          <Text
                            fontSize="16px"
                            fontWeight="400"
                            letterSpacing="0.5px"
                          >
                            {(item.price * item.quantity).toLocaleString('ru-RU')} UZS
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>

                <Divider borderColor="#e5e5e5" />

                {/* Order Info */}
                <VStack spacing="20px" alignItems="stretch">
                  <Heading
                    fontSize="14px"
                    fontWeight="400"
                    letterSpacing="1px"
                    textTransform="uppercase"
                  >
                    Информация о заказе
                  </Heading>

                  <HStack spacing="15px" alignItems="flex-start">
                    <Box
                      width="32px"
                      height="32px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="#666"
                      flexShrink={0}
                    >
                      <FiMapPin size={18} />
                    </Box>
                    <VStack alignItems="flex-start" spacing="5px" flex="1">
                      <Text
                        fontSize="11px"
                        color="#999"
                        textTransform="uppercase"
                        letterSpacing="1px"
                      >
                        Адрес доставки
                      </Text>
                      <Text fontSize="14px" fontWeight="400">
                        {selectedOrder.shippingAddress}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack spacing="15px" alignItems="flex-start">
                    <Box
                      width="32px"
                      height="32px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="#666"
                      flexShrink={0}
                    >
                      <FiCreditCard size={18} />
                    </Box>
                    <VStack alignItems="flex-start" spacing="5px" flex="1">
                      <Text
                        fontSize="11px"
                        color="#999"
                        textTransform="uppercase"
                        letterSpacing="1px"
                      >
                        Способ оплаты
                      </Text>
                      <Text fontSize="14px" fontWeight="400">
                        {selectedOrder.paymentMethod}
                      </Text>
                    </VStack>
                  </HStack>

                  {selectedOrder.deliveryDate && (
                    <HStack spacing="15px" alignItems="flex-start">
                      <Box
                        width="32px"
                        height="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="#666"
                        flexShrink={0}
                      >
                        <FiTruck size={18} />
                      </Box>
                      <VStack alignItems="flex-start" spacing="5px" flex="1">
                        <Text
                          fontSize="11px"
                          color="#999"
                          textTransform="uppercase"
                          letterSpacing="1px"
                        >
                          Дата доставки
                        </Text>
                        <Text fontSize="14px" fontWeight="400">
                          {new Date(selectedOrder.deliveryDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </VStack>
                    </HStack>
                  )}
                </VStack>

                <Divider borderColor="#e5e5e5" />

                {/* Order Total */}
                <Flex justifyContent="space-between" alignItems="center" paddingY="15px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                  >
                    Итого
                  </Text>
                  <Text
                    fontSize="20px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                  >
                    {selectedOrder.total.toLocaleString('ru-RU')} UZS
                  </Text>
                </Flex>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter borderTop="1px solid #e5e5e5" paddingY="20px">
            <Button
              onClick={onOrderClose}
              borderRadius="0"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              color="white"
              bg="black"
              _hover={{ backgroundColor: "#333" }}
              width="100%"
            >
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile;
