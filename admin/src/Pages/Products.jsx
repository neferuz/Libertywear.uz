import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  useDisclosure,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const Products = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productToDelete, setProductToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка товаров из бэкенда
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/cloths?page=0&limit=100`);
      if (res.data && res.data.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`${BASE_URL}/cloths/${productToDelete.id}`);
        toast({
          title: "Товар удален",
          description: `Товар "${productToDelete.name}" успешно удален`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setProductToDelete(null);
        onClose();
        fetchProducts(); // Обновляем список
      } catch (err) {
        toast({
          title: "Ошибка",
          description: err.response?.data?.detail || "Не удалось удалить товар",
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  // Получить минимальную цену из вариантов
  const getMinPrice = (product) => {
    if (!product.variants || product.variants.length === 0) return '0';
    const prices = product.variants.map(v => v.price).filter(p => p > 0);
    if (prices.length === 0) return '0';
    return Math.min(...prices).toLocaleString('ru-RU');
  };

  // Получить общий остаток
  const getTotalStock = (product) => {
    if (product.stock) return product.stock;
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  // Получить название категории
  const getCategoryName = (product) => {
    if (product.category) {
      return product.category.title || product.category.name || 'Без категории';
    }
    return 'Без категории';
  };

  return (
    <Box>
      <Flex 
        justify="space-between" 
        align="center" 
        mb={{ base: "20px", md: "30px" }}
        flexDirection={{ base: "column", sm: "row" }}
        gap={{ base: "15px", sm: "0" }}
      >
        <Heading
          fontSize={{ base: "20px", sm: "24px", md: "32px" }}
          fontWeight="300"
          letterSpacing="1px"
          textTransform="uppercase"
        >
          Товары
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          bg="black"
          color="white"
          borderRadius="20px"
          fontSize={{ base: "11px", md: "12px" }}
          fontWeight="400"
          letterSpacing="0.5px"
          textTransform="uppercase"
          _hover={{ bg: "gray.800" }}
          px={{ base: "20px", md: "30px" }}
          py={{ base: "15px", md: "20px" }}
          onClick={() => navigate('/products/add')}
          w={{ base: "100%", sm: "auto" }}
        >
          Добавить товар
        </Button>
      </Flex>

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
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Название</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>Категория</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Цена</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>Остаток</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>Статус</Th>
                <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py="40px" borderColor="#e5e5e5">
                    <Text fontSize="14px" color="gray.500">
                      Товаров пока нет. Добавьте первый товар.
                    </Text>
                  </Td>
                </Tr>
              ) : (
                products.map((product) => {
                  const minPrice = getMinPrice(product);
                  const totalStock = getTotalStock(product);
                  const categoryName = getCategoryName(product);
                  const status = totalStock > 0 ? 'В наличии' : 'Нет в наличии';
                  
                  return (
                    <Tr key={product.id} _hover={{ bg: "gray.50" }} cursor="pointer">
                      <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>{product.id}</Td>
                      <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} fontWeight="500">{product.name}</Td>
                      <Td borderColor="#e5e5e5" fontSize={{ base: "11px", md: "12px" }} color="gray.600" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>{categoryName}</Td>
                      <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>{minPrice} UZS</Td>
                      <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", lg: "table-cell" }}>{totalStock}</Td>
                      <Td borderColor="#e5e5e5" fontSize={{ base: "11px", md: "13px" }} py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", sm: "table-cell" }}>{status}</Td>
                      <Td borderColor="#e5e5e5" py={{ base: "10px", md: "20px" }} px={{ base: "10px", md: "20px" }}>
                        <Flex gap={{ base: "10px", md: "15px" }} align="center">
                          <Icon 
                            as={FiEdit} 
                            cursor="pointer" 
                            boxSize={{ base: "16px", md: "18px" }}
                            color="gray.600"
                            _hover={{ color: "blue.500" }}
                            onClick={() => handleEdit(product.id)}
                            transition="color 0.2s"
                          />
                          <Icon 
                            as={FiTrash2} 
                            cursor="pointer" 
                            boxSize={{ base: "16px", md: "18px" }}
                            color="gray.600"
                            _hover={{ color: "red.500" }}
                            onClick={() => handleDeleteClick(product)}
                            transition="color 0.2s"
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })
              )}
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
              Вы уверены, что хотите удалить товар <strong>"{productToDelete?.name}"</strong>?
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

export default Products;

