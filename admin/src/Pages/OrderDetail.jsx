import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  VStack, 
  HStack, 
  Text, 
  Divider, 
  Badge, 
  SimpleGrid,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiShoppingBag, FiCreditCard, FiTruck, FiPackage } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // Используем endpoint для админа
      const response = await axios.get(`${BASE_URL}/order/admin/${id}`);
      const orderData = response.data;
      
      // Преобразуем данные из API в формат компонента
      const transformedOrder = {
        id: orderData.id,
        orderId: `ORD-${orderData.id}`,
        date: orderData.created_at,
        customer: {
          id: orderData.user_id,
          name: orderData.user?.name || 'Неизвестный клиент',
          email: orderData.user?.email || 'Не указан',
          phone: orderData.user?.phone || 'Не указан'
        },
        total: `${orderData.total_amount.toLocaleString('ru-RU')} UZS`,
        totalAmount: orderData.total_amount,
        status: getStatusText(orderData.order_status),
        statusKey: orderData.order_status,
        paymentMethod: orderData.payment_method === 'cash' ? 'Наличные' : 'Payme',
        paymentStatus: getPaymentStatusText(orderData.payment_status),
        paymentStatusKey: orderData.payment_status,
        deliveryAddress: orderData.address,
        items: (orderData.items || []).map(item => ({
          name: item.product_data?.product_name || 'Товар',
          size: item.size || '-',
          color: item.product_data?.variant_name || '-',
          quantity: item.quantity,
          price: `${item.price.toLocaleString('ru-RU')} UZS`,
          totalPrice: item.total_price
        })),
        subtotal: `${orderData.total_amount.toLocaleString('ru-RU')} UZS`,
      shipping: 'Бесплатно',
        discount: orderData.discount_amount > 0 ? `${orderData.discount_amount.toLocaleString('ru-RU')} UZS` : '0 UZS',
        notes: orderData.notes || ''
      };
      
      setOrder(transformedOrder);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные заказа",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'В обработке',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      'pending': 'Ожидает оплаты',
      'paid': 'Оплачено',
      'cancelled': 'Отменено',
      'refunded': 'Возврат'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <Box textAlign="center" padding="40px">
        <Spinner size="xl" color="black" />
        <Text mt="20px" color="gray.600">Загрузка данных заказа...</Text>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/orders')}
          mb="20px"
          _hover={{ bg: "gray.100" }}
        >
          Назад
        </Button>
        <Text>Заказ не найден</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex align="center" mb="30px">
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/orders')}
          mr="20px"
          _hover={{ bg: "gray.100" }}
        >
          Назад
        </Button>
        <Heading
          fontSize={{ base: "20px", md: "26px" }}
          fontWeight="400"
          letterSpacing="0.5px"
        >
          Детали заказа {order.orderId}
        </Heading>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="30px" mb="40px">
        {/* Информация о заказе */}
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
          <Text
            fontSize="13px"
            fontWeight="500"
            letterSpacing="0.3px"
            mb="20px"
            color="gray.700"
          >
            Информация о заказе
          </Text>
          <VStack spacing="20px" align="stretch">
            <HStack spacing="15px">
              <Icon as={FiCalendar} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Дата заказа
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {formatDate(order.date)}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiPackage} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Статус
                </Text>
                <Badge
                  colorScheme={getStatusColor(order.status)}
                  fontSize="12px"
                  px="12px"
                  py="5px"
                  borderRadius="8px"
                >
                  {order.status}
                </Badge>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiCreditCard} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Способ оплаты
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {order.paymentMethod}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiCreditCard} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Статус оплаты
                </Text>
                <Badge
                  colorScheme={order.paymentStatus === 'Оплачено' ? 'green' : 'orange'}
                  fontSize="12px"
                  px="12px"
                  py="5px"
                  borderRadius="8px"
                >
                  {order.paymentStatus}
                </Badge>
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Информация о клиенте */}
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
          <Text
            fontSize="13px"
            fontWeight="500"
            letterSpacing="0.3px"
            mb="20px"
            color="gray.700"
          >
            Информация о клиенте
          </Text>
          <VStack spacing="20px" align="stretch">
            <HStack spacing="15px">
              <Icon as={FiUser} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px" flex="1">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Имя
                </Text>
                <Link to={`/users/${order.customer.id}`}>
                  <Text
                    fontSize="15px"
                    fontWeight="500"
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ color: "blue.600", textDecoration: "underline" }}
                  >
                    {order.customer.name}
                  </Text>
                </Link>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiUser} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Email
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {order.customer.email}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiUser} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Телефон
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {order.customer.phone}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px" align="start">
              <Icon as={FiTruck} boxSize="20px" color="gray.500" mt="2px" />
              <VStack align="start" spacing="4px" flex="1">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Адрес доставки
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {order.deliveryAddress}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Товары в заказе */}
      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
        <Flex align="center" justify="space-between" mb="25px">
          <Text
            fontSize="13px"
            fontWeight="500"
            letterSpacing="0.3px"
            color="gray.700"
          >
            Товары в заказе
          </Text>
          <Icon as={FiShoppingBag} boxSize="20px" color="gray.500" />
        </Flex>

        <Box border="1px solid" borderColor="#e5e5e5" borderRadius="12px" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5">Товар</Th>
                <Th fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5">Размер</Th>
                <Th fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5">Цвет</Th>
                <Th fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5">Кол-во</Th>
                <Th fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" isNumeric>Цена</Th>
              </Tr>
            </Thead>
            <Tbody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                <Tr key={idx}>
                  <Td borderColor="#e5e5e5" fontSize="12px">{item.name}</Td>
                  <Td borderColor="#e5e5e5" fontSize="12px">{item.size}</Td>
                  <Td borderColor="#e5e5e5" fontSize="12px">{item.color}</Td>
                  <Td borderColor="#e5e5e5" fontSize="12px">{item.quantity}</Td>
                  <Td borderColor="#e5e5e5" fontSize="12px" isNumeric>{item.price}</Td>
                </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} textAlign="center" borderColor="#e5e5e5" fontSize="12px" color="gray.500">
                    Товары не найдены
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Итого */}
        <VStack spacing="10px" align="stretch" mt="25px" pt="25px" borderTop="1px solid" borderColor="#e5e5e5">
          <Flex justify="space-between">
            <Text fontSize="12px" color="gray.600">
              Подытог:
            </Text>
            <Text fontSize="12px" fontWeight="500">
              {order.subtotal}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontSize="12px" color="gray.600">
              Доставка:
            </Text>
            <Text fontSize="12px" fontWeight="500">
              {order.shipping}
            </Text>
          </Flex>
          {order.discount !== '0 UZS' && (
            <Flex justify="space-between">
              <Text fontSize="12px" color="gray.600">
                Скидка:
              </Text>
              <Text fontSize="12px" fontWeight="500" color="green.500">
                -{order.discount}
              </Text>
            </Flex>
          )}
          <Divider />
          <Flex justify="space-between" pt="5px">
            <Text fontSize="16px" fontWeight="600">
              Всего:
            </Text>
            <Text fontSize="16px" fontWeight="600">
              {order.total}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default OrderDetail;

