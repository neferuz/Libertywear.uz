import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Text, 
  Flex, 
  Icon,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Link,
} from '@chakra-ui/react';
import { FiShoppingCart, FiUsers, FiPackage, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Параллельно загружаем все данные
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get(`${BASE_URL}/order/all`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/users/`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/products?page=0&limit=1000`).catch(() => ({ data: { data: [] } })),
      ]);

      const orders = ordersRes.data || [];
      const users = usersRes.data || [];
      const products = productsRes.data?.data || productsRes.data || [];

      // Вычисляем статистику
      const totalOrders = orders.length;
      const totalUsers = users.length;
      const totalProducts = products.length;
      
      // Считаем доход (сумма всех заказов)
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.total_amount) || 0);
      }, 0);

      setStats({
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue,
      });

      // Последние 5 заказов
      const recent = orders
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
        .slice(0, 5);
      
      setRecentOrders(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Ожидает': 'yellow',
      'В обработке': 'blue',
      'Доставлен': 'green',
      'Отменен': 'red',
      'pending': 'yellow',
      'processing': 'blue',
      'delivered': 'green',
      'cancelled': 'red',
    };
    return statusMap[status] || 'gray';
  };

  const statsCards = [
    {
      label: 'Всего заказов',
      value: stats.totalOrders.toLocaleString('ru-RU'),
      icon: FiShoppingCart,
      color: 'blue',
      link: '/orders',
    },
    {
      label: 'Пользователи',
      value: stats.totalUsers.toLocaleString('ru-RU'),
      icon: FiUsers,
      color: 'green',
      link: '/users',
    },
    {
      label: 'Товары',
      value: stats.totalProducts.toLocaleString('ru-RU'),
      icon: FiPackage,
      color: 'purple',
      link: '/products',
    },
    {
      label: 'Доход',
      value: formatCurrency(stats.totalRevenue),
      icon: FiDollarSign,
      color: 'orange',
      link: '/orders',
    },
  ];

  if (loading) {
    return (
      <Box>
        <Heading
          fontSize={{ base: "24px", md: "32px" }}
          fontWeight="400"
          letterSpacing="1px"
          mb="30px"
          textTransform="uppercase"
        >
          Главная
        </Heading>
        <Flex align="center" justify="center" py="60px">
          <Spinner size="lg" thickness="3px" color="black" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Heading
        fontSize={{ base: "20px", sm: "24px", md: "32px" }}
        fontWeight="400"
        letterSpacing="1px"
        mb={{ base: "20px", md: "30px" }}
        textTransform="uppercase"
      >
        Главная
      </Heading>

      {/* Статистика */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: "15px", md: "20px" }} mb={{ base: "30px", md: "40px" }}>
        {statsCards.map((stat, index) => (
          <Box
            key={index}
            bg="white"
            p={{ base: "20px", md: "25px" }}
            border="1px solid"
            borderColor="#e5e5e5"
            borderRadius="20px"
            transition="all 0.3s"
            cursor="pointer"
            _hover={{
              borderColor: "black",
              transform: "translateY(-2px)",
            }}
            onClick={() => navigate(stat.link)}
          >
            <Flex align="center" justify="space-between" mb={{ base: "12px", md: "15px" }}>
              <Icon as={stat.icon} boxSize={{ base: "24px", md: "30px" }} color="black" />
            </Flex>
            <Text
              fontSize={{ base: "11px", md: "12px" }}
              fontWeight="400"
              letterSpacing="0.5px"
              color="gray.600"
              mb={{ base: "6px", md: "8px" }}
              textTransform="uppercase"
            >
              {stat.label}
            </Text>
            <Text
              fontSize={{ base: "22px", md: "28px" }}
              fontWeight="500"
              mb="5px"
              color="black"
            >
              {stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Последние заказы */}
      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p={{ base: "20px", md: "30px" }}>
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} mb={{ base: "15px", md: "20px" }} flexDirection={{ base: "column", md: "row" }} gap={{ base: "10px", md: "0" }}>
          <Heading
            fontSize={{ base: "16px", md: "18px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
          >
            Последние заказы
          </Heading>
          <Link
            onClick={() => navigate('/orders')}
            fontSize={{ base: "11px", md: "12px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            color="black"
            _hover={{ textDecoration: 'underline' }}
            display="flex"
            alignItems="center"
            gap="5px"
            cursor="pointer"
          >
            Все заказы
            <Icon as={FiArrowRight} boxSize={{ base: "12px", md: "14px" }} />
          </Link>
        </Flex>

        {recentOrders.length === 0 ? (
          <Text fontSize={{ base: "13px", md: "14px" }} color="gray.600" textAlign="center" py={{ base: "30px", md: "40px" }}>
            Заказов пока нет
          </Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" size={{ base: "sm", md: "md" }}>
              <Thead>
                <Tr>
                  <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black" borderColor="#e5e5e5" px={{ base: "10px", md: "20px" }}>
                    ID
                  </Th>
                  <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black" borderColor="#e5e5e5" px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>
                    Клиент
                  </Th>
                  <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black" borderColor="#e5e5e5" px={{ base: "10px", md: "20px" }}>
                    Сумма
                  </Th>
                  <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black" borderColor="#e5e5e5" px={{ base: "10px", md: "20px" }}>
                    Статус
                  </Th>
                  <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black" borderColor="#e5e5e5" px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>
                    Дата
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {recentOrders.map((order) => (
                  <Tr
                    key={order.id}
                    _hover={{ bg: '#fafafa', cursor: 'pointer' }}
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <Td fontSize={{ base: "12px", md: "13px" }} borderColor="#f5f5f5" px={{ base: "10px", md: "20px" }}>
                      #{order.id}
                    </Td>
                    <Td fontSize={{ base: "12px", md: "13px" }} borderColor="#f5f5f5" px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>
                      {order.customer_name || order.user?.name || '-'}
                    </Td>
                    <Td fontSize={{ base: "12px", md: "13px" }} fontWeight="500" borderColor="#f5f5f5" px={{ base: "10px", md: "20px" }}>
                      {formatCurrency(order.total_amount || 0)}
                    </Td>
                    <Td borderColor="#f5f5f5" px={{ base: "10px", md: "20px" }}>
                      <Badge
                        colorScheme={getStatusColor(order.status)}
                        fontSize={{ base: "10px", md: "11px" }}
                        px={{ base: "8px", md: "12px" }}
                        py={{ base: "3px", md: "4px" }}
                        borderRadius="20px"
                        textTransform="uppercase"
                        letterSpacing="0.5px"
                        fontWeight="400"
                      >
                        {order.status || 'Ожидает'}
                      </Badge>
                    </Td>
                    <Td fontSize={{ base: "12px", md: "13px" }} color="gray.600" borderColor="#f5f5f5" px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>
                      {formatDate(order.created_at || order.date)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
