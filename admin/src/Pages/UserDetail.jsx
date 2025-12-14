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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner
} from '@chakra-ui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShoppingBag, FiCheckCircle, FiXCircle, FiCreditCard, FiTruck, FiPackage } from 'react-icons/fi';
import { BASE_URL } from '../constants/config';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/users/${id}`);
        if (!res.ok) throw new Error('Не удалось загрузить пользователя');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

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

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const orderHistory = user?.orderHistory || [];

  if (loading) {
    return (
      <Flex align="center" justify="center" py="60px">
        <Spinner size="lg" thickness="3px" color="black" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="12px" p="20px">
        <Text color="red.500" fontSize="14px">{error}</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="12px" p="20px">
        <Text fontSize="14px">Пользователь не найден</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex align="center" mb="30px">
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/users')}
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
          Информация о пользователе
        </Heading>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="30px" mb="40px">
        {/* Личная информация */}
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
          <Text
            fontSize="13px"
            fontWeight="500"
            letterSpacing="0.3px"
            mb="20px"
            color="gray.700"
          >
            Личная информация
          </Text>
          <VStack spacing="20px" align="stretch">
            <HStack spacing="15px">
              <Icon as={FiUser} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Имя
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {user.name}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiMail} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px" flex="1">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Email
                </Text>
                <HStack spacing="10px" flexWrap="wrap">
                  <Text fontSize="15px" fontWeight="500">
                    {user.email}
                  </Text>
                  {user.is_email_verified ? (
                    <Badge colorScheme="green" fontSize="10px" px="10px" py="4px" borderRadius="6px">
                      <HStack spacing="5px">
                        <Icon as={FiCheckCircle} boxSize="11px" />
                        <Text>Подтвержден</Text>
                      </HStack>
                    </Badge>
                  ) : (
                    <Badge colorScheme="red" fontSize="10px" px="10px" py="4px" borderRadius="6px">
                      <HStack spacing="5px">
                        <Icon as={FiXCircle} boxSize="11px" />
                        <Text>Не подтвержден</Text>
                      </HStack>
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiPhone} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Телефон
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {user.phone}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiCalendar} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Дата регистрации
                </Text>
                <Text fontSize="15px" fontWeight="500">
                  {formatDate(user.created_at)}
                </Text>
              </VStack>
            </HStack>

            {user.address && (
              <>
                <Divider />
                <HStack spacing="15px" align="start">
                  <Icon as={FiMapPin} boxSize="20px" color="gray.500" mt="2px" />
                  <VStack align="start" spacing="4px" flex="1">
                    <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                      Адрес
                    </Text>
                    <Text fontSize="15px" fontWeight="500">
                      {user.address}
                    </Text>
                    {user.city && (
                      <Text fontSize="13px" color="gray.600">
                        {user.city}{user.state ? `, ${user.state}` : ''}{user.pincode ? `, ${user.pincode}` : ''}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </>
            )}
          </VStack>
        </Box>

        {/* Статистика */}
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
          <Text
            fontSize="13px"
            fontWeight="500"
            letterSpacing="0.3px"
            mb="20px"
            color="gray.700"
          >
            Статистика
          </Text>
          <VStack spacing="20px" align="stretch">
            <HStack spacing="15px">
              <Icon as={FiShoppingBag} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px" flex="1">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Всего заказов
                </Text>
                <Text fontSize="24px" fontWeight="600" color="black">
                  {orderHistory.length}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack spacing="15px">
              <Icon as={FiPackage} boxSize="20px" color="gray.500" />
              <VStack align="start" spacing="4px" flex="1">
                <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                  Доставлено заказов
                </Text>
                <Text fontSize="24px" fontWeight="600" color="green.500">
                  {orderHistory.filter(o => o.status === 'Доставлен').length}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* История заказов */}
      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
        <Flex align="center" justify="space-between" mb="25px">
          <Text
            fontSize="13px"
            fontWeight="500"
            letterSpacing="0.3px"
            color="gray.700"
          >
            История заказов ({orderHistory.length})
          </Text>
          <Icon as={FiShoppingBag} boxSize="20px" color="gray.500" />
        </Flex>

        {orderHistory.length > 0 ? (
          <VStack spacing="15px" align="stretch">
            {orderHistory.map((order) => (
              <Box
                key={order.id}
                p="20px"
                border="1px solid"
                borderColor="#e5e5e5"
                borderRadius="15px"
                bg="gray.50"
                cursor="pointer"
                _hover={{ borderColor: "black", bg: "white" }}
                transition="all 0.2s"
                onClick={() => handleOrderClick(order)}
              >
                <Flex justify="space-between" align="start" mb="15px">
                  <VStack align="start" spacing="5px">
                    <Text fontSize="14px" fontWeight="600" letterSpacing="0.5px">
                      {order.id}
                    </Text>
                    <Text fontSize="12px" color="gray.600">
                      {formatDate(order.date)}
                    </Text>
                  </VStack>
                  <Badge
                    colorScheme={
                      order.status === 'Доставлен' ? 'green' : 
                      order.status === 'В обработке' ? 'blue' : 'gray'
                    }
                    fontSize="11px"
                    px="12px"
                    py="5px"
                    borderRadius="8px"
                  >
                    {order.status}
                  </Badge>
                </Flex>
                
                <VStack align="start" spacing="8px" mt="15px">
                  <Text fontSize="12px" color="gray.600" fontWeight="500">
                    Товары ({order.items.length}):
                  </Text>
                  {order.items.slice(0, 2).map((item, idx) => (
                    <Text key={idx} fontSize="13px" color="gray.700" pl="10px">
                      • {item.name} ({item.size}, {item.color}) × {item.quantity}
                    </Text>
                  ))}
                  {order.items.length > 2 && (
                    <Text fontSize="12px" color="gray.500" pl="10px" fontStyle="italic">
                      и еще {order.items.length - 2} товар(ов)...
                    </Text>
                  )}
                </VStack>

                <Flex justify="space-between" align="center" mt="15px" pt="15px" borderTop="1px solid" borderColor="#e5e5e5">
                  <Text fontSize="12px" color="gray.600">
                    Способ оплаты: {order.paymentMethod}
                  </Text>
                  <Text fontSize="15px" fontWeight="600">
                    {order.total}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box
            p="40px"
            textAlign="center"
            border="1px dashed"
            borderColor="#e5e5e5"
            borderRadius="15px"
            bg="gray.50"
          >
            <Icon as={FiShoppingBag} boxSize="40px" color="gray.400" mb="15px" />
            <Text fontSize="14px" color="gray.500">
              Заказов пока нет
            </Text>
          </Box>
        )}
      </Box>

      {/* Modal с детальной информацией о заказе */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="20px" maxW="800px" maxH="90vh" overflowY="auto">
          <ModalHeader
            fontSize="16px"
            fontWeight="500"
            letterSpacing="0.3px"
            pb="15px"
          >
            Детали заказа {selectedOrder?.id}
          </ModalHeader>
          <ModalCloseButton />
          
          {selectedOrder && (
            <ModalBody py="25px">
              <VStack spacing="25px" align="stretch">
                {/* Информация о заказе */}
                <Box>
                  <Text fontSize="12px" fontWeight="500" letterSpacing="0.3px" mb="15px" color="gray.700">
                    Информация о заказе
                  </Text>
                  <SimpleGrid columns={2} spacing="15px">
                    <VStack align="start" spacing="5px">
                      <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                        Дата заказа
                      </Text>
                      <Text fontSize="13px" fontWeight="500">
                        {formatDate(selectedOrder.date)}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing="5px">
                      <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                        Статус
                      </Text>
                      <Badge
                        colorScheme={
                          selectedOrder.status === 'Доставлен' ? 'green' : 
                          selectedOrder.status === 'В обработке' ? 'blue' : 'gray'
                        }
                        fontSize="11px"
                        px="10px"
                        py="4px"
                        borderRadius="6px"
                      >
                        {selectedOrder.status}
                      </Badge>
                    </VStack>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Товары */}
                <Box>
                  <Text fontSize="12px" fontWeight="500" letterSpacing="0.3px" mb="15px" color="gray.700">
                    Товары в заказе
                  </Text>
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
                        {selectedOrder.items.map((item, idx) => (
                          <Tr key={idx}>
                            <Td borderColor="#e5e5e5" fontSize="12px">{item.name}</Td>
                            <Td borderColor="#e5e5e5" fontSize="12px">{item.size}</Td>
                            <Td borderColor="#e5e5e5" fontSize="12px">{item.color}</Td>
                            <Td borderColor="#e5e5e5" fontSize="12px">{item.quantity}</Td>
                            <Td borderColor="#e5e5e5" fontSize="12px" isNumeric>{item.price}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>

                <Divider />

                {/* Оплата */}
                <Box>
                  <Text fontSize="12px" fontWeight="500" letterSpacing="0.3px" mb="15px" color="gray.700">
                    <Icon as={FiCreditCard} boxSize="16px" mr="8px" />
                    Информация об оплате
                  </Text>
                  <SimpleGrid columns={2} spacing="15px">
                    <VStack align="start" spacing="5px">
                      <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                        Способ оплаты
                      </Text>
                      <Text fontSize="13px" fontWeight="500">
                        {selectedOrder.paymentMethod}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing="5px">
                      <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                        Статус оплаты
                      </Text>
                      <Badge
                        colorScheme={selectedOrder.paymentStatus === 'Оплачено' ? 'green' : 'orange'}
                        fontSize="11px"
                        px="10px"
                        py="4px"
                        borderRadius="6px"
                      >
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </VStack>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Доставка */}
                <Box>
                  <Text fontSize="12px" fontWeight="500" letterSpacing="0.3px" mb="15px" color="gray.700">
                    <Icon as={FiTruck} boxSize="16px" mr="8px" />
                    Информация о доставке
                  </Text>
                  <VStack align="start" spacing="5px">
                    <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                      Адрес доставки
                    </Text>
                    <Text fontSize="13px" fontWeight="500">
                      {selectedOrder.deliveryAddress}
                    </Text>
                  </VStack>
                </Box>

                <Divider />

                {/* Итого */}
                <Box>
                  <Text fontSize="12px" fontWeight="500" letterSpacing="0.3px" mb="15px" color="gray.700">
                    Итого
                  </Text>
                  <VStack spacing="10px" align="stretch">
                    <Flex justify="space-between">
                      <Text fontSize="12px" color="gray.600">
                        Подытог:
                      </Text>
                      <Text fontSize="12px" fontWeight="500">
                        {selectedOrder.subtotal}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontSize="12px" color="gray.600">
                        Доставка:
                      </Text>
                      <Text fontSize="12px" fontWeight="500">
                        {selectedOrder.shipping}
                      </Text>
                    </Flex>
                    {selectedOrder.discount !== '0 UZS' && (
                      <Flex justify="space-between">
                        <Text fontSize="12px" color="gray.600">
                          Скидка:
                        </Text>
                        <Text fontSize="12px" fontWeight="500" color="green.500">
                          -{selectedOrder.discount}
                        </Text>
                      </Flex>
                    )}
                    <Divider />
                    <Flex justify="space-between" pt="5px">
                      <Text fontSize="15px" fontWeight="600">
                        Всего:
                      </Text>
                      <Text fontSize="15px" fontWeight="600">
                        {selectedOrder.total}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>
          )}

          <ModalFooter pt="15px">
            <Button
              borderRadius="20px"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.3px"
              borderColor="black"
              color="black"
              variant="outline"
              _hover={{ bg: "gray.100" }}
              px="25px"
              py="15px"
              onClick={onClose}
            >
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserDetail;

