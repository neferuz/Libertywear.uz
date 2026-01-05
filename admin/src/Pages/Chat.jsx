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
  Textarea,
  Input,
} from '@chakra-ui/react';
import { FiMessageCircle, FiTrash2, FiEye, FiCheck, FiSend } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const Chat = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/chat/`);
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
      const res = await fetch(`${BASE_URL}/chat/stats/count`);
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
    setReplyText(message.admin_reply || '');
    onOpen();
    
    // Отмечаем как прочитанное, если еще не прочитано
    if (!message.is_read) {
      try {
        await axios.patch(`${BASE_URL}/chat/${message.id}`, { is_read: true });
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, is_read: true } : m
        ));
        fetchStats();
      } catch (err) {
        console.error('Ошибка при отметке сообщения:', err);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ответ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSendingReply(true);
    try {
      await axios.patch(`${BASE_URL}/chat/${selectedMessage.id}`, {
        admin_reply: replyText.trim(),
        is_read: true,
      });
      
      toast({
        title: "Ответ отправлен",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setSelectedMessage({ ...selectedMessage, admin_reply: replyText.trim() });
      setMessages(prev => prev.map(m => 
        m.id === selectedMessage.id 
          ? { ...m, admin_reply: replyText.trim(), is_read: true } 
          : m
      ));
      setReplyText('');
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/chat/${id}`);
      toast({
        title: "Сообщение удалено",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchMessages();
      fetchStats();
      if (selectedMessage && selectedMessage.id === id) {
        onClose();
      }
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
        Чат с клиентами
      </Heading>

      {/* Статистика */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat bg="white" p={4} borderRadius="md" boxShadow="sm">
          <StatLabel fontSize="sm" fontWeight="300">Всего сообщений</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="400">{stats.total}</StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="md" boxShadow="sm">
          <StatLabel fontSize="sm" fontWeight="300">Непрочитанных</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="400" color="red.500">
            {stats.unread}
          </StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="md" boxShadow="sm">
          <StatLabel fontSize="sm" fontWeight="300">Прочитанных</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="400" color="green.500">
            {stats.read}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      {/* Таблица сообщений */}
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" thickness="3px" color="black" />
        </Flex>
      ) : messages.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Icon as={FiMessageCircle} boxSize={12} color="gray.400" mb={4} />
          <Text color="gray.500">Нет сообщений</Text>
        </Box>
      ) : (
        <Box bg="white" borderRadius="md" boxShadow="sm" overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th fontWeight="400" fontSize="sm" textTransform="uppercase" letterSpacing="1px">
                  Имя
                </Th>
                <Th fontWeight="400" fontSize="sm" textTransform="uppercase" letterSpacing="1px">
                  Email
                </Th>
                <Th fontWeight="400" fontSize="sm" textTransform="uppercase" letterSpacing="1px">
                  Сообщение
                </Th>
                <Th fontWeight="400" fontSize="sm" textTransform="uppercase" letterSpacing="1px">
                  Дата
                </Th>
                <Th fontWeight="400" fontSize="sm" textTransform="uppercase" letterSpacing="1px">
                  Статус
                </Th>
                <Th fontWeight="400" fontSize="sm" textTransform="uppercase" letterSpacing="1px">
                  Действия
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {messages.map((message) => (
                <Tr key={message.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="300">{message.name}</Td>
                  <Td fontWeight="300" fontSize="sm">{message.email}</Td>
                  <Td fontWeight="300" fontSize="sm" maxW="300px" isTruncated>
                    {message.message}
                  </Td>
                  <Td fontWeight="300" fontSize="sm">
                    {formatDate(message.created_at)}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={message.is_read ? 'green' : 'red'}
                      fontWeight="300"
                      fontSize="xs"
                    >
                      {message.is_read ? 'Прочитано' : 'Новое'}
                    </Badge>
                    {message.admin_reply && (
                      <Badge ml={2} colorScheme="blue" fontWeight="300" fontSize="xs">
                        Ответ дан
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<FiEye />}
                        onClick={() => handleViewMessage(message)}
                        variant="ghost"
                        fontWeight="300"
                      >
                        Открыть
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<FiTrash2 />}
                        onClick={() => handleDelete(message.id)}
                        variant="ghost"
                        colorScheme="red"
                        fontWeight="300"
                      >
                        Удалить
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Модальное окно для просмотра и ответа */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="300" letterSpacing="1px">
            Сообщение от клиента
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMessage && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="300" color="gray.600" mb={1}>
                    Имя
                  </Text>
                  <Text fontWeight="400">{selectedMessage.name}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="300" color="gray.600" mb={1}>
                    Email
                  </Text>
                  <Text fontWeight="400">{selectedMessage.email}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="300" color="gray.600" mb={1}>
                    Дата
                  </Text>
                  <Text fontWeight="400">{formatDate(selectedMessage.created_at)}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="300" color="gray.600" mb={2}>
                    Сообщение клиента
                  </Text>
                  <Box
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderColor="black"
                  >
                    <Text fontWeight="300">{selectedMessage.message}</Text>
                  </Box>
                </Box>
                {selectedMessage.admin_reply && (
                  <Box>
                    <Text fontSize="sm" fontWeight="300" color="gray.600" mb={2}>
                      Ваш ответ
                    </Text>
                    <Box
                      p={3}
                      bg="blue.50"
                      borderRadius="md"
                      borderLeft="3px solid"
                      borderColor="blue.500"
                    >
                      <Text fontWeight="300">{selectedMessage.admin_reply}</Text>
                    </Box>
                  </Box>
                )}
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="300" color="gray.600" mb={2}>
                    {selectedMessage.admin_reply ? 'Изменить ответ' : 'Ответить клиенту'}
                  </Text>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Введите ваш ответ..."
                    rows={4}
                    borderRadius="none"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'black', boxShadow: 'none' }}
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={onClose}
                fontWeight="300"
              >
                Закрыть
              </Button>
              <Button
                bg="black"
                color="white"
                _hover={{ bg: 'gray.700' }}
                leftIcon={<FiSend />}
                onClick={handleSendReply}
                isLoading={isSendingReply}
                fontWeight="300"
                borderRadius="none"
              >
                {selectedMessage?.admin_reply ? 'Обновить ответ' : 'Отправить ответ'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Chat;

