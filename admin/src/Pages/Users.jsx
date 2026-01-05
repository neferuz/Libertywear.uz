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
  Icon,
  Flex,
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
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { BASE_URL } from '../constants/config';

const Users = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleDeleteClick = (e, user) => {
    e.stopPropagation(); // Предотвращаем переход на страницу пользователя
    setUserToDelete(user);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        const res = await fetch(`${BASE_URL}/users/${userToDelete.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error('Не удалось удалить пользователя');
        }
        
        // Обновляем список пользователей
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        
        toast({
          title: "Пользователь удален",
          description: `Пользователь "${userToDelete.name}" успешно удален`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setUserToDelete(null);
        onClose();
      } catch (err) {
        toast({
          title: "Ошибка",
          description: err.message || "Не удалось удалить пользователя",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading users from:', `${BASE_URL}/users/`);
        const res = await fetch(`${BASE_URL}/users/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', res.status, res.statusText);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        
        // Проверяем Content-Type перед парсингом JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Server returned non-JSON response. First 500 chars:', text.substring(0, 500));
          throw new Error(`Сервер вернул неверный формат данных (${contentType || 'unknown'}). Проверьте URL: ${BASE_URL}/users/`);
        }
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ detail: 'Не удалось загрузить пользователей' }));
          throw new Error(errorData.detail || `Ошибка ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading users:', err);
        setError(err.message);
        toast({
          title: "Ошибка",
          description: err.message || "Не удалось загрузить пользователей",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [toast]);

  return (
    <Box>
      <Heading
        fontSize={{ base: "20px", sm: "24px", md: "26px" }}
        fontWeight="400"
        letterSpacing="0.5px"
        mb={{ base: "20px", md: "30px" }}
      >
        Пользователи
      </Heading>

      {loading ? (
        <Flex align="center" justify="center" py="40px">
          <Spinner size="lg" thickness="3px" color="black" />
        </Flex>
      ) : error ? (
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="12px" p="20px">
          <Text color="red.500" fontSize="14px">{error}</Text>
        </Box>
      ) : (
      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" overflowX="auto">
        <Table variant="simple" size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>ID</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Имя</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>Email</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>Телефон</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>Заказов</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr 
                key={user.id}
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                onClick={() => handleUserClick(user.id)}
                transition="background 0.2s"
              >
                <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>{user.id}</Td>
                <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} fontWeight="500" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>{user.name}</Td>
                <Td borderColor="#e5e5e5" fontSize={{ base: "11px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>{user.email}</Td>
                <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>{user.phone}</Td>
                <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>{user.orders}</Td>
                <Td borderColor="#e5e5e5" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>
                  <Flex gap={{ base: "10px", md: "15px" }} align="center">
                    <Icon 
                      as={FiTrash2} 
                      cursor="pointer" 
                      boxSize={{ base: "16px", md: "18px" }}
                      color="gray.600"
                      _hover={{ color: "red.500" }}
                      onClick={(e) => handleDeleteClick(e, user)}
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
              Вы уверены, что хотите удалить пользователя <strong>"{userToDelete?.name}"</strong>?
            </Text>
            <Text fontSize="12px" color="gray.500" mt="10px">
              Это действие нельзя отменить. Все данные пользователя будут удалены.
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

export default Users;

