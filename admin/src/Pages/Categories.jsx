import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  SimpleGrid, 
  Text, 
  Icon,
  Image,
  Input,
  Collapse,
  VStack,
  HStack,
  useDisclosure,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  FormLabel,
  Badge,
  Checkbox,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiChevronDown, FiChevronUp, FiPackage, FiSave, FiUpload, FiLink, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const Categories = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});

  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubcategory, setIsSubcategory] = useState(false);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { isOpen: isImagePreviewOpen, onOpen: onImagePreviewOpen, onClose: onImagePreviewClose } = useDisclosure();
  const toast = useToast();

  const handleCategoryImageUpload = async (categoryId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setUploadingId(categoryId);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${BASE_URL}${response.data.url}`;
      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId ? { ...cat, image: imageUrl } : cat
        )
      );
      
      toast({
        title: "Успешно",
        description: "Изображение загружено",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось загрузить изображение",
        status: "error",
        duration: 3000,
      });
    } finally {
      setUploadingId(null);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubcategory = (categoryId, subcategoryId) => {
    const key = `${categoryId}-${subcategoryId}`;
    setExpandedSubcategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryImageUrl = (categoryId, url) => {
    if (url.trim()) {
      setCategories(prev => prev.map(cat =>
        cat.id === categoryId ? { ...cat, image: url.trim() } : cat
      ));
    }
  };

  const handleSaveCategory = async (category) => {
    try {
      setSavingId(category.id);
      // Slug не отправляем - он будет сгенерирован автоматически на бэкенде из title
      const saveData = {
        title: category.name || category.title,
        gender: category.gender,
        image: category.image,
        parent_id: category.parent_id,
        order: category.order || 0,
        show_on_homepage: category.show_on_homepage || false,
        title_translations: category.title_translations || { 
          ru: category.title || category.name || '', 
          uz: '', 
          en: '', 
          es: '' 
        },
      };
      
      // Логирование для отладки
      console.log("Сохранение категории:", {
        id: category.id,
        title: saveData.title,
        show_on_homepage: saveData.show_on_homepage
      });
      
      await axios.put(`${BASE_URL}/categories/${category.id}`, saveData);
      
      // Проверяем ответ сервера
      const response = await axios.get(`${BASE_URL}/categories/${category.id}`);
      console.log("Ответ сервера после сохранения:", {
        id: response.data.id,
        title: response.data.title || response.data.name,
        show_on_homepage: response.data.show_on_homepage,
        type: typeof response.data.show_on_homepage
      });
      
      toast({
        title: "Успешно",
        description: category.show_on_homepage 
          ? "Категория показывается на главной странице" 
          : "Категория сохранена",
        status: "success",
        duration: 2000,
      });
      // Сохраняем состояние галочки перед загрузкой данных
      const savedShowOnHomepage = category.show_on_homepage || false;
      
      // Обновляем состояние категории сразу, чтобы галочка не исчезла
      setCategories(prev =>
        prev.map(cat =>
          cat.id === category.id
            ? { ...cat, show_on_homepage: savedShowOnHomepage }
            : cat
        )
      );
      
      // Загружаем обновленные данные с сервера
      fetchCategories().then(() => {
        // После загрузки проверяем и восстанавливаем состояние галочки, если нужно
        setCategories(prev =>
          prev.map(cat => {
            if (cat.id === category.id) {
              // Если сервер вернул show_on_homepage, используем его, иначе используем сохраненное значение
              return { 
                ...cat, 
                show_on_homepage: cat.show_on_homepage !== undefined ? cat.show_on_homepage : savedShowOnHomepage
              };
            }
            return cat;
          })
        );
        
        // Обновляем originalCategories с данными из обновленных categories
        setCategories(currentCategories => {
          setOriginalCategories(prev => {
            return currentCategories.map(cat => {
              const original = prev.find(p => p.id === cat.id);
              return original ? { ...original, ...cat } : cat;
            });
          });
          return currentCategories;
        });
      });
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err.response?.data?.detail || "Не удалось сохранить категорию",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleEditCategory = (category) => {
    // Определяем, является ли это подкатегорией (имеет parent_id)
    const isSub = !!category.parent_id;
    
    setEditingCategory({ 
      ...category,
      // Убеждаемся, что title_translations всегда есть и правильно инициализированы
      title_translations: category.title_translations || { 
        ru: category.title || category.name || '', 
        uz: category.title_translations?.uz || '', 
        en: category.title_translations?.en || '', 
        es: category.title_translations?.es || '' 
      },
      // Для обратной совместимости
      title: category.title || category.name || '',
      name: category.title || category.name || '',
    });
    setIsSubcategory(isSub);
    onEditOpen();
  };

  const handleAddSubcategory = (parentCategory) => {
    setEditingCategory({
      title: '',
      slug: '',
      gender: parentCategory.gender || '',
      image: '',
      parent_id: parentCategory.id,
      order: (parentCategory.subcategories?.length || 0) + 1,
      title_translations: { ru: '', uz: '', en: '', es: '' }
    });
    setIsSubcategory(true);
    onEditOpen();
  };

  const handleSaveEdit = async () => {
    try {
      // Убираем slug из данных - он будет сгенерирован автоматически на бэкенде
      const { slug, ...categoryData } = editingCategory;
      
      // Убеждаемся, что title_translations отправляется
      if (!categoryData.title_translations) {
        categoryData.title_translations = { ru: categoryData.title || '', uz: '', en: '', es: '' };
      }
      
      if (editingCategory.id) {
        // Обновление существующей категории
        await axios.put(`${BASE_URL}/categories/${editingCategory.id}`, categoryData);
        toast({
          title: "Успешно",
          description: "Категория обновлена",
          status: "success",
          duration: 2000,
        });
      } else {
        // Создание новой подкатегории
        await axios.post(`${BASE_URL}/categories/`, categoryData);
        toast({
          title: "Успешно",
          description: "Подкатегория создана",
          status: "success",
          duration: 2000,
        });
      }
      fetchCategories();
      onEditClose();
      setEditingCategory(null);
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err.response?.data?.detail || "Не удалось сохранить",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/categories/${categoryId}`);
      toast({
        title: "Успешно",
        description: "Категория удалена",
        status: "success",
        duration: 2000,
      });
      fetchCategories();
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err.response?.data?.detail || "Не удалось удалить категорию",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Загружаем только главные категории (без parent_id)
      const res = await axios.get(`${BASE_URL}/categories/`);
      
      // Логирование для отладки
      console.log("Загружены категории с сервера:", res.data.map(cat => ({
        id: cat.id,
        title: cat.title || cat.name,
        show_on_homepage: cat.show_on_homepage,
        type: typeof cat.show_on_homepage
      })));
      
      // Обновляем categories данными с сервера
      // Убеждаемся, что show_on_homepage правильно обрабатывается
      // Функция для рекурсивной обработки категорий и их подкатегорий
      const processCategory = (cat) => {
        const processed = {
          ...cat,
          show_on_homepage: cat.show_on_homepage === true || 
                           cat.show_on_homepage === 1 || 
                           cat.show_on_homepage === "true" || 
                           cat.show_on_homepage === "1" 
                           ? true 
                           : false,
          // Убеждаемся, что title_translations всегда есть
          title_translations: cat.title_translations || { 
            ru: cat.title || cat.name || '', 
            uz: '', 
            en: '', 
            es: '' 
          },
          // Для обратной совместимости
          title: cat.title || cat.name || '',
          name: cat.title || cat.name || '',
        };
        
        // Обрабатываем подкатегории рекурсивно
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
          processed.subcategories = cat.subcategories.map(processCategory);
        }
        
        return processed;
      };
      
      const categoriesWithDefaults = (res.data || []).map(processCategory);
      
      setCategories(categoriesWithDefaults);
      // Обновляем originalCategories данными с сервера
      setOriginalCategories(JSON.parse(JSON.stringify(categoriesWithDefaults)));
    } catch (err) {
      console.error('Не удалось загрузить категории', err);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить категории",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция для проверки, есть ли изменения в категории
  const hasCategoryChanges = (category) => {
    const original = originalCategories.find(cat => cat.id === category.id);
    if (!original) return false;
    
    // Сравниваем основные поля, учитывая undefined/null
    const currentShowOnHomepage = category.show_on_homepage || false;
    const originalShowOnHomepage = original.show_on_homepage || false;
    
    return (
      (currentShowOnHomepage !== originalShowOnHomepage) ||
      (category.image !== original.image) ||
      (category.order !== original.order) ||
      (category.gender !== original.gender)
    );
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
          Категории
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
          onClick={() => navigate('/categories/add')}
          w={{ base: "100%", sm: "auto" }}
        >
          Добавить категорию
        </Button>
      </Flex>

      {loading ? (
        <Flex align="center" justify="center" py="40px">
          <Spinner size="lg" thickness="3px" color="black" />
        </Flex>
      ) : (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="20px" alignItems="start">
        {categories
          .filter(cat => !cat.parent_id) // Показываем только главные категории (без родителя)
          .map((category) => {
          const displayName = category.name || category.title || category.slug || 'Без названия';
          const isExpanded = expandedCategories[category.id];
          
          return (
            <Box
              key={category.id}
              bg="white"
              border="1px solid"
              borderColor="#e5e5e5"
              borderRadius="20px"
              p="25px"
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* Фото категории */}
              <VStack spacing="12px" align="stretch" mb="16px" onClick={(e) => e.stopPropagation()}>
                <Box
                  w="100%"
                  h="120px"
                  borderRadius="12px"
                  overflow="hidden"
                  border="1px solid #e5e5e5"
                  bg="gray.50"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={displayName}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                      cursor="pointer"
                      onClick={() => {
                        setImagePreviewUrl(category.image);
                        onImagePreviewOpen();
                      }}
                      _hover={{ opacity: 0.9 }}
                      transition="opacity 0.2s"
                    />
                  ) : (
                    <Text fontSize="11px" color="gray.500" textAlign="center" px="6px">
                      Фото нет
                    </Text>
                  )}
                </Box>

                <VStack spacing="8px" align="stretch">
                  <Text fontSize="11px" color="gray.600" fontWeight="500">
                    Фото категории
                  </Text>
                  
                  <Tabs size="sm">
                    <TabList>
                      <Tab fontSize="10px"><Icon as={FiLink} mr="3px" boxSize="12px" />URL</Tab>
                      <Tab fontSize="10px"><Icon as={FiUpload} mr="3px" boxSize="12px" />Файл</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel px="0" pt="10px">
                        <Input
                          placeholder="Введите URL изображения"
                          size="sm"
                          borderRadius="12px"
                          fontSize="11px"
                          borderColor="#e5e5e5"
                          _focus={{ borderColor: "black", boxShadow: "none" }}
                          value={category.image || ''}
                          onChange={(e) => {
                            const url = e.target.value.trim();
                            if (url) {
                              setCategories(prev =>
                                prev.map(cat =>
                                  cat.id === category.id ? { ...cat, image: url } : cat
                                )
                              );
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              handleCategoryImageUrl(category.id, e.target.value);
                            }
                          }}
                        />
                      </TabPanel>
                      <TabPanel px="0" pt="10px">
                        <Input
                          type="file"
                          accept="image/*"
                          display="none"
                          id={`category-upload-${category.id}`}
                          onChange={(e) => handleCategoryImageUpload(category.id, e)}
                        />
                        <Button
                          as="label"
                          size="sm"
                          variant="outline"
                          borderRadius="12px"
                          fontSize="11px"
                          borderColor="black"
                          color="black"
                          _hover={{ bg: "black", color: "white" }}
                          cursor="pointer"
                          w="100%"
                          htmlFor={`category-upload-${category.id}`}
                          isLoading={uploadingId === category.id}
                          loadingText="Загрузка..."
                          leftIcon={<FiUpload />}
                        >
                          Выбрать файл
                        </Button>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </VStack>

              {/* Main Category Header */}
              <Flex
                align="center"
                justify="space-between"
                mb="20px"
                cursor="pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <HStack spacing="15px">
                  <Icon as={FiPackage} boxSize="24px" color="black" />
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                  >
                    {displayName}
                  </Text>
                </HStack>
                <Icon
                  as={isExpanded ? FiChevronUp : FiChevronDown}
                  boxSize="20px"
                  transition="transform 0.2s"
                />
              </Flex>

              {/* Action Buttons */}
              <HStack 
                spacing="10px" 
                mb="15px" 
                align="center"
                flexWrap="wrap"
                gap="10px"
                onClick={(e) => e.stopPropagation()}
              >
                
                <Checkbox
                  isChecked={category.show_on_homepage === true || category.show_on_homepage === 1 || category.show_on_homepage === "true"}
                  onChange={(e) => {
                    setCategories(prev =>
                      prev.map(cat =>
                        cat.id === category.id 
                          ? { ...cat, show_on_homepage: e.target.checked }
                          : cat
                      )
                    );
                  }}
                  colorScheme="black"
                  size="md"
                  fontSize="12px"
                  onClick={(e) => e.stopPropagation()}
                  borderColor="black"
                  _hover={{ borderColor: "black" }}
                  bg="white"
                  px="8px"
                  py="4px"
                  borderRadius="6px"
                  border="1px solid"
                  borderColor="gray.300"
                  _checked={{
                    bg: "black",
                    borderColor: "black",
                    color: "white"
                  }}
                >
                  <Text fontSize="12px" ml="8px" fontWeight="500">
                    На главной
                  </Text>
                </Checkbox>
                <Button
                  leftIcon={<FiSave />}
                  size="sm"
                  variant="solid"
                  borderRadius="20px"
                  fontSize="11px"
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800", opacity: 1 }}
                  _disabled={{ bg: "gray.300", color: "gray.500", opacity: 0.6, cursor: "not-allowed" }}
                  isLoading={savingId === category.id}
                  isDisabled={!hasCategoryChanges(category) || savingId === category.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveCategory(category);
                  }}
                  h="32px"
                  minW="auto"
                  px="15px"
                >
                  Сохранить
                </Button>
                
                <Button
                  leftIcon={<FiEdit />}
                  size="sm"
                  variant="outline"
                  borderRadius="20px"
                  fontSize="11px"
                  borderColor="black"
                  color="black"
                  _hover={{ bg: "black", color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(category);
                  }}
                  h="32px"
                  minW="auto"
                  px="15px"
                >
                  Редактировать
                </Button>
                <Button
                  leftIcon={<FiPlus />}
                  size="sm"
                  variant="outline"
                  borderRadius="20px"
                  fontSize="11px"
                  borderColor="blue.500"
                  color="blue.500"
                  _hover={{ bg: "blue.500", color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSubcategory(category);
                  }}
                  h="32px"
                  minW="auto"
                  px="15px"
                >
                  Подкатегория
                </Button>
                <Button
                  leftIcon={<FiTrash2 />}
                  size="sm"
                  variant="outline"
                  borderRadius="20px"
                  fontSize="11px"
                  borderColor="red.500"
                  color="red.500"
                  _hover={{ bg: "red.500", color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                  h="32px"
                  minW="auto"
                  px="15px"
                >
                  Удалить
                </Button>
              </HStack>

              {/* Subcategories Level 1 */}
              {category.subcategories && category.subcategories.length > 0 && (
                <Collapse in={isExpanded} animateOpacity>
                  <Box mt="20px" pt="20px" borderTop="2px solid" borderColor="gray.200">
                    <Text
                      fontSize="11px"
                      fontWeight="500"
                      letterSpacing="0.5px"
                      textTransform="uppercase"
                      color="gray.500"
                      mb="15px"
                    >
                      Подкатегории ({category.subcategories.length})
                    </Text>
                    <VStack spacing="12px" align="stretch">
                      {category.subcategories.map((subcategory) => {
                        const subKey = `${category.id}-${subcategory.id}`;
                        const isSubExpanded = expandedSubcategories[subKey];
                        const hasSubSubcategories = subcategory.subcategories && subcategory.subcategories.length > 0;
                        
                        return (
                          <Box 
                            key={subcategory.id}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="12px"
                            bg="gray.50"
                            p="15px"
                            position="relative"
                            _before={{
                              content: '""',
                              position: "absolute",
                              left: "-10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "0",
                              height: "0",
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderRight: "8px solid #e5e5e5",
                            }}
                          >
                            {/* Subcategory Level 1 */}
                            <Flex
                              align="center"
                              justify="space-between"
                              mb="10px"
                              cursor={hasSubSubcategories ? "pointer" : "default"}
                              onClick={() => hasSubSubcategories && toggleSubcategory(category.id, subcategory.id)}
                            >
                              <HStack spacing="8px">
                                <Icon as={FiArrowRight} boxSize="14px" color="gray.500" />
                                <Text
                                  fontSize="13px"
                                  fontWeight="500"
                                  letterSpacing="0.3px"
                                  color="gray.800"
                                >
                                  {subcategory.name || subcategory.title}
                                </Text>
                                <Badge
                                  fontSize="9px"
                                  px="6px"
                                  py="2px"
                                  borderRadius="4px"
                                  colorScheme="blue"
                                  variant="subtle"
                                >
                                  Подкатегория
                                </Badge>
                              </HStack>
                              {hasSubSubcategories && (
                                <Icon
                                  as={isSubExpanded ? FiChevronUp : FiChevronDown}
                                  boxSize="16px"
                                  color="gray.500"
                                  transition="transform 0.2s"
                                />
                              )}
                            </Flex>
                            <HStack 
                              spacing="8px" 
                              flexWrap="wrap"
                              gap="8px"
                              align="center"
                            >
                              <Button
                                size="xs"
                                leftIcon={<FiEdit />}
                                onClick={() => {
                                  const fullSubcategory = categories
                                    .find(c => c.id === category.id)
                                    ?.subcategories?.find(s => s.id === subcategory.id);
                                  if (fullSubcategory) {
                                    handleEditCategory(fullSubcategory);
                                  }
                                }}
                                h="28px"
                                fontSize="10px"
                                px="12px"
                              >
                                Редактировать
                              </Button>
                              <Button
                                size="xs"
                                leftIcon={<FiPlus />}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => {
                                  const fullSubcategory = categories
                                    .find(c => c.id === category.id)
                                    ?.subcategories?.find(s => s.id === subcategory.id);
                                  if (fullSubcategory) {
                                    handleAddSubcategory(fullSubcategory);
                                  }
                                }}
                                h="28px"
                                fontSize="10px"
                                px="12px"
                              >
                                Подкатегория
                              </Button>
                              <Button
                                size="xs"
                                leftIcon={<FiTrash2 />}
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleDeleteCategory(subcategory.id)}
                                h="28px"
                                fontSize="10px"
                                px="12px"
                              >
                                Удалить
                              </Button>
                            </HStack>

                            {/* Subcategories Level 2 */}
                            {hasSubSubcategories && (
                              <Collapse in={isSubExpanded} animateOpacity>
                                <Box mt="12px" pt="12px" borderTop="1px solid" borderColor="gray.300" pl="10px">
                                  <Text
                                    fontSize="10px"
                                    fontWeight="500"
                                    letterSpacing="0.5px"
                                    textTransform="uppercase"
                                    color="gray.500"
                                    mb="10px"
                                  >
                                    Под-подкатегории
                                  </Text>
                                  <VStack spacing="8px" align="stretch">
                                    {subcategory.subcategories.map((subSubcategory) => (
                                      <Flex
                                        key={subSubcategory.id}
                                        align="center"
                                        justify="space-between"
                                        p="10px 12px"
                                        bg="white"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        borderRadius="8px"
                                        _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                                        transition="all 0.2s"
                                      >
                                        <HStack spacing="6px">
                                          <Icon as={FiArrowRight} boxSize="12px" color="gray.400" />
                                          <Text
                                            fontSize="12px"
                                            fontWeight="400"
                                            letterSpacing="0.3px"
                                            color="gray.700"
                                          >
                                            {subSubcategory.name || subSubcategory.title}
                                          </Text>
                                          <Badge
                                            fontSize="8px"
                                            px="5px"
                                            py="1px"
                                            borderRadius="3px"
                                            colorScheme="purple"
                                            variant="subtle"
                                          >
                                            Под-подкатегория
                                          </Badge>
                                        </HStack>
                                        <HStack spacing="5px">
                                          <Icon
                                            as={FiEdit}
                                            boxSize="14px"
                                            cursor="pointer"
                                            color="blue.500"
                                            _hover={{ color: "blue.700" }}
                                            onClick={() => {
                                              const fullSubcategory = categories
                                                .find(c => c.id === category.id)
                                                ?.subcategories?.find(s => s.id === subcategory.id)
                                                ?.subcategories?.find(ss => ss.id === subSubcategory.id);
                                              if (fullSubcategory) {
                                                handleEditCategory(fullSubcategory);
                                              }
                                            }}
                                          />
                                          <Icon
                                            as={FiTrash2}
                                            boxSize="14px"
                                            cursor="pointer"
                                            color="red.500"
                                            _hover={{ color: "red.700" }}
                                            onClick={() => handleDeleteCategory(subSubcategory.id)}
                                          />
                                        </HStack>
                                      </Flex>
                                    ))}
                                  </VStack>
                                </Box>
                              </Collapse>
                            )}
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                </Collapse>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
      )}

      {/* Modal редактирования категории */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isSubcategory ? 'Создать подкатегорию' : 'Редактировать категорию'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingCategory && (
              <EditCategoryForm 
                category={editingCategory} 
                setCategory={setEditingCategory}
                categories={categories}
                isSubcategory={isSubcategory}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Отмена
            </Button>
            <Button bg="black" color="white" onClick={handleSaveEdit}>
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальное окно для просмотра изображения в полном размере */}
      <Modal isOpen={isImagePreviewOpen} onClose={onImagePreviewClose} size="full">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" fontSize="24px" zIndex={1000} />
          <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
            {imagePreviewUrl && (
              <Image
                src={imagePreviewUrl}
                maxW="100%"
                maxH="100vh"
                objectFit="contain"
                borderRadius="8px"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Функция для генерации slug из названия
const generateSlug = (text) => {
  if (!text) return '';
  
  const translitMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  };
  
  let result = '';
  for (let char of text) {
    const lowerChar = char.toLowerCase();
    if (translitMap[lowerChar]) {
      result += translitMap[lowerChar];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char.toLowerCase();
    } else if (char === ' ' || char === '_') {
      result += '-';
    }
  }
  
  // Убираем множественные дефисы и дефисы в начале/конце
  result = result.replace(/-+/g, '-').replace(/^-|-$/g, '');
  
  return result;
};

const EditCategoryForm = ({ category, setCategory, categories, isSubcategory }) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(category.image || '');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { isOpen: isImagePreviewOpen, onOpen: onImagePreviewOpen, onClose: onImagePreviewClose } = useDisclosure();
  const toast = useToast();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${BASE_URL}${response.data.url}`;
      setCategory({ ...category, image: imageUrl });
      setImagePreview(imageUrl);
      
      toast({
        title: "Успешно",
        description: "Изображение загружено",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось загрузить изображение",
        status: "error",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    setCategory({ ...category, image: url });
    setImagePreview(url);
  };

  // Инициализируем переводы, если их нет
  if (!category.title_translations) {
    category.title_translations = { ru: category.title || '', uz: '', en: '', es: '' };
  }

  return (
    <VStack spacing="20px" align="stretch">
      <Box>
        <Text fontSize="12px" mb="5px">Название (русский) <Text as="span" color="red.500">*</Text></Text>
        <Input
          value={category.title || ''}
          onChange={(e) => {
            const newTitle = e.target.value;
            setCategory({ 
              ...category, 
              title: newTitle,
              // Автоматически генерируем slug из названия
              slug: newTitle ? generateSlug(newTitle) : '',
              title_translations: { ...category.title_translations, ru: newTitle }
            });
          }}
          placeholder="Название категории"
        />
        {category.slug && (
          <Text fontSize="10px" color="gray.500" mt="5px">
            Slug: {category.slug}
          </Text>
        )}
      </Box>

      <TranslationFields
        label="Название категории"
        fieldName="title"
        value={category.title_translations || { ru: category.title || '', uz: '', en: '', es: '' }}
        onChange={(translations) => setCategory({ ...category, title_translations: translations })}
        type="input"
      />

      <Box>
        <Text fontSize="12px" mb="5px">Пол</Text>
        <Select
          value={category.gender || ''}
          onChange={(e) => setCategory({ ...category, gender: e.target.value })}
        >
          <option value="">Не выбрано</option>
          <option value="female">Женский</option>
          <option value="male">Мужской</option>
          <option value="kids">Детский</option>
        </Select>
      </Box>

      {!isSubcategory && (
        <Box>
          <Text fontSize="12px" mb="5px">Порядок сортировки</Text>
          <Input
            type="number"
            value={category.order || 0}
            onChange={(e) => setCategory({ ...category, order: parseInt(e.target.value) || 0 })}
          />
        </Box>
      )}

      {!isSubcategory && (
        <Box>
          <Checkbox
            isChecked={category.show_on_homepage || false}
            onChange={(e) => setCategory({ ...category, show_on_homepage: e.target.checked })}
            colorScheme="black"
            size="md"
          >
            <Text fontSize="12px" ml="8px">
              Показывать на главной странице
            </Text>
          </Checkbox>
        </Box>
      )}

      <Box>
        <Text fontSize="12px" mb="10px" fontWeight="500">Изображение</Text>
        <Tabs>
          <TabList>
            <Tab><Icon as={FiLink} mr="5px" />URL</Tab>
            <Tab><Icon as={FiUpload} mr="5px" />Файл</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px="0" pt="15px">
              <Input
                placeholder="Введите URL изображения"
                value={category.image || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </TabPanel>
            <TabPanel px="0" pt="15px">
              <Input
                type="file"
                accept="image/*"
                display="none"
                id="category-edit-upload"
                onChange={handleFileUpload}
              />
              <Button
                as="label"
                htmlFor="category-edit-upload"
                leftIcon={<FiUpload />}
                isLoading={uploading}
                loadingText="Загрузка..."
                cursor="pointer"
                w="100%"
              >
                Выбрать файл
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {imagePreview && (
          <Box mt="15px" border="1px solid" borderColor="#e5e5e5" borderRadius="8px" p="10px">
            <Text fontSize="11px" color="gray.600" mb="8px">Предпросмотр:</Text>
            <Image 
              src={imagePreview} 
              maxH="200px" 
              objectFit="contain" 
              borderRadius="4px"
              cursor="pointer"
              onClick={() => {
                setImagePreviewUrl(imagePreview);
                onImagePreviewOpen();
              }}
              _hover={{ opacity: 0.9 }}
              transition="opacity 0.2s"
            />
          </Box>
        )}
      </Box>

      {/* Модальное окно для просмотра изображения в полном размере */}
      <Modal isOpen={isImagePreviewOpen} onClose={onImagePreviewClose} size="full">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" fontSize="24px" zIndex={1000} />
          <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
            {imagePreviewUrl && (
              <Image
                src={imagePreviewUrl}
                maxW="100%"
                maxH="100vh"
                objectFit="contain"
                borderRadius="8px"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Categories;

