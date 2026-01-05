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
  Spinner,
  Select
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiCopy } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const Products = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productToDelete, setProductToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Все товары без фильтрации
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Загрузка товаров и категорий из бэкенда
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/all`);
      const categoriesData = res.data || [];
      console.log("🔍 [Products] Загружены категории:", categoriesData.length);
      
      // Создаем плоский список всех категорий для поиска
      const flattenCategories = (cats, flatList = []) => {
        for (const cat of cats) {
          if (cat && cat.id) {
            flatList.push(cat);
            if (cat.subcategories && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
              flattenCategories(cat.subcategories, flatList);
            }
          }
        }
        return flatList;
      };
      
      const allCategoriesFlat = flattenCategories(categoriesData);
      console.log("🔍 [Products] Всего категорий (включая подкатегории):", allCategoriesFlat.length);
      console.log("🔍 [Products] ID всех категорий:", allCategoriesFlat.map(c => c.id));
      
      // Сохраняем и иерархическую структуру, и плоский список
      setCategories(categoriesData);
      // Сохраняем плоский список в отдельной переменной для быстрого поиска
      window.__allCategoriesFlat = allCategoriesFlat;
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    console.log("🔍 [Products] fetchProducts called");
    console.log("🔍 [Products] BASE_URL:", BASE_URL);
    const apiUrl = `${BASE_URL}/products?page=0&limit=100`;
    console.log("🔍 [Products] Full API URL:", apiUrl);
    try {
      setLoading(true);
      const res = await axios.get(apiUrl);
      if (res.data && res.data.data) {
        setAllProducts(res.data.data);
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      console.error("🔴 [Products] Error details:", {
        message: err.message,
        code: err.code,
        config: err.config,
        response: err.response,
        request: err.request
      });
      console.error("🔴 [Products] Request URL was:", err.config?.url || apiUrl);
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

  const handleCopy = async (productId) => {
    try {
      setLoading(true);
      
      // Загружаем данные товара
      const response = await axios.get(`${BASE_URL}/products/${productId}`);
      const product = response.data;
      
      // Подготавливаем данные для копирования
      const copiedProduct = {
        name: `${product.name} Копия`,
        description: product.description || null,
        category_id: product.category_id,
        stock: product.stock || 0,
        description_title: product.description_title || null,
        material: product.material || null,
        branding: product.branding || null,
        packaging: product.packaging || null,
        size_guide: product.size_guide || null,
        delivery_info: product.delivery_info || null,
        return_info: product.return_info || null,
        exchange_info: product.exchange_info || null,
        variants: product.variants?.map(variant => ({
          color_name: variant.color_name || '',
          color_image: variant.color_image || null,
          price: variant.price || 0,
          stock: variant.stock || 0,
          sizes: variant.sizes || [],
          size_stock: variant.size_stock || {},
          images: variant.images?.map(img => img.image_url || img.url || '').filter(url => url) || []
        })) || []
      };
      
      // Создаем новый товар
      const createResponse = await axios.post(`${BASE_URL}/products`, copiedProduct);
      const newProductId = createResponse.data.id;
      
      toast({
        title: "Товар скопирован",
        description: `Товар "${product.name}" успешно скопирован`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Перенаправляем на страницу редактирования нового товара
      navigate(`/products/edit/${newProductId}`);
    } catch (error) {
      console.error("Error copying product:", error);
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось скопировать товар",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`${BASE_URL}/products/${productToDelete.id}`);
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

  // Получить название главной категории
  const getCategoryName = (product) => {
    // Если категория уже загружена в объекте товара
    if (product.category) {
      const category = product.category;
      // Если это подкатегория, находим главную категорию
      if (category.parent_id) {
        const mainCategory = findMainCategory(category.parent_id);
        return mainCategory ? (mainCategory.title || mainCategory.name) : (category.title || category.name);
      }
      return category.title || category.name || 'Без категории';
    }
    
    // Если есть category_id, ищем категорию в загруженном списке
    if (product.category_id) {
      const category = findCategoryById(product.category_id);
      if (category) {
        // Если это подкатегория, находим главную категорию
        if (category.parent_id) {
          const mainCategory = findMainCategory(category.parent_id);
          return mainCategory ? (mainCategory.title || mainCategory.name) : (category.title || category.name);
        }
        return category.title || category.name || 'Без категории';
      }
    }
    
    return 'Без категории';
  };

  // Найти категорию по ID (используем плоский список для быстрого поиска)
  const findCategoryById = (categoryId) => {
    // Сначала пробуем найти в плоском списке (быстрее)
    if (window.__allCategoriesFlat) {
      const found = window.__allCategoriesFlat.find(cat => cat.id === categoryId);
      if (found) {
        console.log(`✅ [Products] Категория ${categoryId} найдена в плоском списке:`, found.title || found.name);
        return found;
      }
    }
    
    // Если не найдено, ищем рекурсивно в иерархической структуре
    const findInCategories = (cats, id) => {
      for (const cat of cats) {
        if (cat && cat.id === id) {
          return cat;
        }
        if (cat.subcategories && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
          const found = findInCategories(cat.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const found = findInCategories(categories, categoryId);
    if (!found) {
      console.warn(`⚠️ [Products] Категория с ID ${categoryId} не найдена`);
    }
    return found;
  };

  // Найти главную категорию (без parent_id)
  const findMainCategory = (categoryId) => {
    // Сначала находим категорию по ID
    const category = findCategoryById(categoryId);
    if (!category) return null;
    
    // Если у категории нет родителя, это главная категория
    if (!category.parent_id) {
      return category;
    }
    
    // Рекурсивно ищем главную категорию через родителя
    return findMainCategory(category.parent_id);
  };

  // Получить все ID подкатегорий (включая вложенные) - рекурсивно через API структуру
  const getAllSubcategoryIds = (categoryId) => {
    const ids = [categoryId];
    const category = findCategoryById(categoryId);
    
    if (!category) {
      console.warn(`Категория с ID ${categoryId} не найдена`);
      return ids;
    }
    
    // Рекурсивная функция для поиска всех подкатегорий
    const findSubIds = (cat) => {
      if (cat.subcategories && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
        for (const subcat of cat.subcategories) {
          if (subcat.id) {
            ids.push(subcat.id);
            // Рекурсивно ищем подкатегории подкатегорий
            findSubIds(subcat);
          }
        }
      }
    };
    
    findSubIds(category);
    console.log(`🔍 [Products] Найдены ID категорий для фильтрации:`, ids);
    return ids;
  };

  // Фильтрация товаров по категории
  useEffect(() => {
    if (!selectedCategory) {
      setProducts(allProducts);
      return;
    }

    const selectedCategoryId = parseInt(selectedCategory);
    console.log(`🔍 [Products] Выбрана категория ID:`, selectedCategoryId);
    
    // Проверяем, найдена ли категория
    const category = findCategoryById(selectedCategoryId);
    if (!category) {
      console.error(`❌ [Products] Категория ${selectedCategoryId} не найдена!`);
      console.log(`🔍 [Products] Доступные категории:`, window.__allCategoriesFlat?.map(c => ({ id: c.id, title: c.title || c.name })));
      setProducts([]);
      return;
    }
    
    const categoryIds = getAllSubcategoryIds(selectedCategoryId);
    console.log(`🔍 [Products] Фильтрация товаров по категориям:`, categoryIds);
    console.log(`🔍 [Products] Всего товаров:`, allProducts.length);
    console.log(`🔍 [Products] category_id всех товаров:`, allProducts.map(p => p.category_id));
    
    const filtered = allProducts.filter(product => {
      if (!product.category_id) {
        console.log(`⚠️ [Products] Товар ${product.id} не имеет category_id`);
        return false;
      }
      const matches = categoryIds.includes(product.category_id);
      if (matches) {
        console.log(`✅ [Products] Товар ${product.id} (${product.name}) соответствует категории ${product.category_id}`);
      } else {
        console.log(`❌ [Products] Товар ${product.id} (${product.name}) с category_id=${product.category_id} не соответствует фильтру [${categoryIds.join(', ')}]`);
      }
      return matches;
    });
    
    console.log(`🔍 [Products] Отфильтровано товаров:`, filtered.length);
    setProducts(filtered);
  }, [selectedCategory, allProducts, categories]);

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
        <Flex gap="15px" align="center" w={{ base: "100%", sm: "auto" }}>
          <Select
            placeholder="Все категории"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="#e5e5e5"
            borderRadius="20px"
            fontSize={{ base: "11px", md: "12px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            w={{ base: "100%", sm: "200px" }}
            _hover={{ borderColor: "gray.400" }}
            _focus={{ borderColor: "black", boxShadow: "0 0 0 1px black" }}
          >
            {(() => {
              // Функция для рекурсивного рендеринга всех категорий
              const renderCategories = (cats, depth = 0) => {
                const options = [];
                for (const cat of cats) {
                  if (cat && cat.id) {
                    const prefix = depth > 0 ? '  '.repeat(depth) + '└ ' : '';
                    const title = cat.title || cat.title_ru || cat.name || `Категория ${cat.id}`;
                    options.push(
                      <option key={cat.id} value={cat.id}>
                        {prefix}{title}
                      </option>
                    );
                    // Рекурсивно добавляем подкатегории
                    if (cat.subcategories && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
                      options.push(...renderCategories(cat.subcategories, depth + 1));
                    }
                  }
                }
                return options;
              };
              return renderCategories(categories);
            })()}
          </Select>
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
                            title="Редактировать"
                          />
                          <Icon 
                            as={FiCopy} 
                            cursor="pointer" 
                            boxSize={{ base: "16px", md: "18px" }}
                            color="gray.600"
                            _hover={{ color: "green.500" }}
                            onClick={() => handleCopy(product.id)}
                            transition="color 0.2s"
                            title="Копировать"
                          />
                          <Icon 
                            as={FiTrash2} 
                            cursor="pointer" 
                            boxSize={{ base: "16px", md: "18px" }}
                            color="gray.600"
                            _hover={{ color: "red.500" }}
                            onClick={() => handleDeleteClick(product)}
                            transition="color 0.2s"
                            title="Удалить"
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

