import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge,
  Icon,
  Flex,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const Orders = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Неизвестно';
    
    try {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} секунд назад`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'минуту' : diffInMinutes < 5 ? 'минуты' : 'минут'} назад`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'час' : diffInHours < 5 ? 'часа' : 'часов'} назад`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? 'день' : diffInDays < 5 ? 'дня' : 'дней'} назад`;
    } catch (error) {
      return 'Неизвестно';
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/order/all`);
      
      console.log('📥 [Orders] API Response:', response.data);
      console.log('📥 [Orders] Response status:', response.status);
      console.log('📥 [Orders] Response headers:', response.headers);
      
      // API возвращает массив заказов напрямую
      let ordersData = [];
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Если данные обернуты в объект с полем data
        ordersData = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        // Если это один объект, оборачиваем в массив
        ordersData = [response.data];
      }
      
      console.log('📥 [Orders] Processed ordersData:', ordersData);
      
      // Преобразуем данные из API в формат компонента
      const transformedOrders = ordersData.map((order) => {
        // Форматируем дату
        const orderDate = order.created_at || order.order_date || new Date().toISOString();
        
        // Обрабатываем user объект
        let customerId = 0;
        let customerName = 'Неизвестный клиент';
        
        if (order.user) {
          customerId = order.user.id || 0;
          customerName = order.user.name || order.user.email || 'Неизвестный клиент';
        } else if (order.user_id) {
          customerId = order.user_id;
          customerName = 'Пользователь #' + order.user_id;
        }
        
        return {
          id: order.id,
          orderId: order.id,
          customer: {
            id: customerId,
            name: customerName
          },
          total: `${(order.total_amount || 0).toLocaleString('ru-RU')} UZS`,
          totalAmount: order.total_amount || 0,
          status: getStatusText(order.order_status, order.payment_method, order.payment_status),
          statusKey: order.order_status || 'pending',
          date: orderDate,
          paymentMethod: order.payment_method || 'cash',
          paymentStatus: order.payment_status || 'pending',
          address: order.address || '',
          items: order.items || []
        };
      });
      
      console.log('✅ [Orders] Transformed orders:', transformedOrders);
      setOrders(transformedOrders);
    } catch (error) {
      console.error('❌ [Orders] Error fetching orders:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || error.message || "Не удалось загрузить заказы",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status, paymentMethod, paymentStatus) => {
    // Если Payme и не оплачено - показываем "Ожидает оплаты"
    if (paymentMethod === 'payme' && paymentStatus === 'pending') {
      return 'Ожидает оплаты';
    }
    
    // Если наличные и статус pending - показываем "В обработке"
    if (paymentMethod === 'cash' && status === 'pending') {
      return 'В обработке';
    }
    
    const statusMap = {
      'pending': 'В обработке',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  const getStatusKey = (statusText) => {
    const statusMap = {
      'В обработке': 'processing',
      'Отправлен': 'shipped',
      'Доставлен': 'delivered',
      'Отменен': 'cancelled'
    };
    return statusMap[statusText] || 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Доставлен':
      case 'delivered':
        return 'green';
      case 'В обработке':
      case 'processing':
      case 'pending':
        return 'blue';
      case 'Отменен':
      case 'cancelled':
        return 'red';
      case 'Отправлен':
      case 'shipped':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleCustomerClick = (e, customerId) => {
    e.stopPropagation();
    navigate(`/users/${customerId}`);
  };

  const handleStatusChange = async (e, orderId) => {
    e.stopPropagation();
    const newStatusText = e.target.value;
    const newStatusKey = getStatusKey(newStatusText);
    
    try {
      // Обновляем статус через API
      await axios.patch(`${BASE_URL}/order/${orderId}/status`, {
        order_status: newStatusKey
      });
      
      // Обновляем локальное состояние
    setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatusText, statusKey: newStatusKey } : order
    ));
      
    toast({
      title: "Статус изменен",
        description: `Статус заказа изменен на "${newStatusText}"`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус заказа",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (e, order) => {
    e.stopPropagation();
    setOrderToDelete(order);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      try {
        await axios.delete(`${BASE_URL}/order/${orderToDelete.id}`);
      setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
      toast({
        title: "Заказ удален",
        description: `Заказ "${orderToDelete.id}" успешно удален`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setOrderToDelete(null);
      onClose();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить заказ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box>
      <Heading
        fontSize={{ base: "20px", sm: "24px", md: "26px" }}
        fontWeight="400"
        letterSpacing="0.5px"
        mb={{ base: "20px", md: "30px" }}
      >
        Заказы
      </Heading>

      {loading ? (
        <Box textAlign="center" padding="40px">
          <Spinner size="xl" color="black" />
          <Text mt="20px" color="gray.600">Загрузка заказов...</Text>
        </Box>
      ) : orders.length === 0 ? (
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" padding="40px" textAlign="center">
          <Text color="gray.600">Заказов пока нет</Text>
        </Box>
      ) : (
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" overflowX="auto">
          <Table variant="simple" size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>ID заказа</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>Клиент</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Сумма</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Статус</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>Время</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr 
                key={order.id}
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                onClick={() => handleOrderClick(order.id)}
                transition="background 0.2s"
              >
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} fontWeight="500" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>Заказ №{order.id}</Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>
                  <Text
                    cursor="pointer"
                    _hover={{ color: "blue.500", textDecoration: "underline" }}
                    onClick={(e) => handleCustomerClick(e, order.customer.id)}
                  >
                    {order.customer.name}
                  </Text>
                </Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>{order.total}</Td>
                  <Td borderColor="#e5e5e5" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e, order.id)}
                      size={{ base: "xs", md: "sm" }}
                      fontSize={{ base: "10px", md: "11px" }}
                    borderColor="transparent"
                    bg="transparent"
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="В обработке">В обработке</option>
                      <option value="Отправлен">Отправлен</option>
                    <option value="Доставлен">Доставлен</option>
                    <option value="Отменен">Отменен</option>
                  </Select>
                </Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "11px", md: "12px" }} color="gray.600" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>{getTimeAgo(order.date)}</Td>
                  <Td borderColor="#e5e5e5" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>
                    <Flex gap={{ base: "10px", md: "15px" }} align="center">
                    <Icon 
                      as={FiTrash2} 
                      cursor="pointer" 
                        boxSize={{ base: "16px", md: "18px" }}
                      color="gray.600"
                      _hover={{ color: "red.500" }}
                      onClick={(e) => handleDeleteClick(e, order)}
                      transition="color 0.2s"
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      )}

      {/* Modal подтверждения удаления */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: "xs", sm: "md" }}>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="20px" maxW={{ base: "90%", sm: "500px" }} mx={{ base: "4", sm: "auto" }}>
          <ModalHeader
            fontSize="18px"
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            pb="15px"
          >
            Подтверждение удаления
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="20px">
            <Text fontSize="14px" color="gray.700" lineHeight="1.6">
              Вы уверены, что хотите удалить заказ <strong>"{orderToDelete?.id}"</strong>?
            </Text>
            <Text fontSize="12px" color="gray.500" mt="10px">
              Это действие нельзя отменить.
            </Text>
          </ModalBody>
          <ModalFooter gap="10px" pt="10px">
            <Button
              variant="outline"
              borderRadius="20px"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              borderColor="black"
              color="black"
              _hover={{ bg: "gray.100" }}
              px="25px"
              py="15px"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button
              bg="red.500"
              color="white"
              borderRadius="20px"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              _hover={{ bg: "red.600" }}
              px="25px"
              py="15px"
              onClick={handleDeleteConfirm}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Orders;

