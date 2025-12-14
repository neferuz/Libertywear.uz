import React, { useEffect, useState } from 'react';
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
  Text,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Button,
  VStack,
  HStack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiMail, FiTrash2, FiEye, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const ContactMessages = () => {
  const navigate = null; // не используется, но оставлено для совместимости
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/contact-messages/`);
      if (!res.ok) throw new Error('Не удалось загрузить сообщения');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/contact-messages/stats/count`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    onOpen();
    
    // Отмечаем как прочитанное, если еще не прочитано
    if (!message.is_read) {
      try {
        await axios.patch(`${BASE_URL}/contact-messages/${message.id}/read`);
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, is_read: true } : m
        ));
        fetchStats();
      } catch (err) {
        console.error('Ошибка при отметке сообщения:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/contact-messages/${id}`);
      toast({
        title: "Сообщение удалено",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchMessages();
      fetchStats();
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

  return (
    <Box>
      <Heading
        fontSize={{ base: "20px", sm: "24px", md: "32px" }}
        fontWeight="300"
        letterSpacing="1px"
        mb={{ base: "20px", md: "30px" }}
        textTransform="uppercase"
      >
        Сообщения обратной связи
      </Heading>

      {/* Статистика */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={{ base: "15px", md: "20px" }} mb={{ base: "20px", md: "30px" }}>
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p={{ base: "15px", md: "20px" }}>
          <Stat>
            <StatLabel fontSize={{ base: "10px", md: "11px" }} color="gray.600" letterSpacing="0.5px" textTransform="uppercase">
              Всего сообщений
            </StatLabel>
            <StatNumber fontSize={{ base: "20px", md: "24px" }} fontWeight="500">
              {stats.total}
            </StatNumber>
          </Stat>
        </Box>
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="20px">
          <Stat>
            <StatLabel fontSize="11px" color="gray.600" letterSpacing="0.5px" textTransform="uppercase">
              Непрочитанных
            </StatLabel>
            <StatNumber fontSize="24px" fontWeight="500" color="red.500">
              {stats.unread}
            </StatNumber>
          </Stat>
        </Box>
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="20px">
          <Stat>
            <StatLabel fontSize="11px" color="gray.600" letterSpacing="0.5px" textTransform="uppercase">
              Прочитанных
            </StatLabel>
            <StatNumber fontSize="24px" fontWeight="500" color="green.500">
              {stats.read}
            </StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>

      {loading ? (
        <Flex align="center" justify="center" py="40px">
          <Spinner size="lg" thickness="3px" color="black" />
        </Flex>
      ) : (
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" overflowX="auto">
          <Table variant="simple" size={{ base: "sm", md: "md" }}>
            <Thead>
              <Tr>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>ID</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Имя</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>Email</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>Тема</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Статус</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>Дата</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {messages.map((message) => (
                <Tr 
                  key={message.id}
                  bg={!message.is_read ? "blue.50" : "transparent"}
                  _hover={{ bg: "gray.50" }}
                  transition="background 0.2s"
                >
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>{message.id}</Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} fontWeight="500" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>{message.name}</Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "11px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>{message.email}</Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>{message.subject || '-'}</Td>
                  <Td borderColor="#e5e5e5" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>
                    <Badge
                      colorScheme={message.is_read ? "green" : "red"}
                      fontSize={{ base: "9px", md: "10px" }}
                      px={{ base: "8px", md: "10px" }}
                      py={{ base: "3px", md: "4px" }}
                      borderRadius="20px"
                    >
                      {message.is_read ? "Прочитано" : "Новое"}
                    </Badge>
                  </Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "11px", md: "12px" }} color="gray.600" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>
                    {formatDate(message.created_at)}
                  </Td>
                  <Td borderColor="#e5e5e5" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>
                    <Flex gap={{ base: "8px", md: "10px" }} align="center">
                      <Icon 
                        as={FiEye} 
                        cursor="pointer" 
                        boxSize={{ base: "16px", md: "18px" }}
                        color="blue.500"
                        _hover={{ color: "blue.700" }}
                        onClick={() => handleViewMessage(message)}
                        transition="color 0.2s"
                      />
                      <Icon 
                        as={FiTrash2} 
                        cursor="pointer" 
                        boxSize={{ base: "16px", md: "18px" }}
                        color="red.500"
                        _hover={{ color: "red.700" }}
                        onClick={() => handleDelete(message.id)}
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

      {/* Modal просмотра сообщения */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius={{ base: "0", sm: "20px" }} maxW={{ base: "100%", sm: "700px" }} mx={{ base: "0", sm: "auto" }}>
          <ModalHeader
            fontSize="18px"
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            pb="15px"
          >
            Сообщение от {selectedMessage?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="20px">
            {selectedMessage && (
              <VStack spacing="20px" align="stretch">
                <HStack spacing="15px">
                  <Icon as={FiMail} boxSize="20px" color="gray.500" />
                  <VStack align="start" spacing="4px" flex="1">
                    <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                      Email
                    </Text>
                    <Text fontSize="15px" fontWeight="500">
                      {selectedMessage.email}
                    </Text>
                  </VStack>
                </HStack>

                {selectedMessage.phone && (
                  <>
                    <Divider />
                    <HStack spacing="15px">
                      <Icon as={FiMail} boxSize="20px" color="gray.500" />
                      <VStack align="start" spacing="4px" flex="1">
                        <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                          Телефон
                        </Text>
                        <Text fontSize="15px" fontWeight="500">
                          {selectedMessage.phone}
                        </Text>
                      </VStack>
                    </HStack>
                  </>
                )}

                {selectedMessage.subject && (
                  <>
                    <Divider />
                    <VStack align="start" spacing="4px">
                      <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                        Тема
                      </Text>
                      <Text fontSize="15px" fontWeight="500">
                        {selectedMessage.subject}
                      </Text>
                    </VStack>
                  </>
                )}

                <Divider />

                <VStack align="start" spacing="4px">
                  <Text fontSize="11px" color="gray.500" letterSpacing="0.5px">
                    Сообщение
                  </Text>
                  <Text fontSize="14px" color="gray.700" lineHeight="1.8" whiteSpace="pre-wrap">
                    {selectedMessage.message}
                  </Text>
                </VStack>

                <Divider />

                <Text fontSize="11px" color="gray.500">
                  Дата: {formatDate(selectedMessage.created_at)}
                </Text>
              </VStack>
            )}
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
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContactMessages;

