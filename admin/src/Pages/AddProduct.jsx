import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  VStack, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea,
  Select,
  HStack,
  Icon,
  Text,
  useToast,
  SimpleGrid,
  Image,
  Badge,
  Checkbox,
  Wrap,
  WrapItem,
  Spinner
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const AddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    subSubcategory: '',
    stock: '',
    sizes: [], // Массив выбранных размеров для главного товара
    // Детальное описание товара
    description_title: '',
    material: '',
    branding: '',
    packaging: '',
    size_guide: '',
    delivery_info: '',
    return_info: '',
    exchange_info: '',
    variants: [
      {
        id: Date.now(),
        colorName: '',
        colorImage: null,
        price: '',
        stock: '',
        sizes: [], // Массив выбранных размеров для этого варианта
        sizeStock: {}, // Остатки по размерам: { 'S': 10, 'M': 20 }
        images: []
      }
    ]
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Загрузка категорий из бэкенда
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get(`${BASE_URL}/categories/`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить категории",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Загрузка данных товара при редактировании
  useEffect(() => {
    if (isEditMode && id) {
      // В реальном приложении здесь будет запрос к API для загрузки данных товара
      // Пока используем мок данные
      const mockProductData = {
        name: 'WOOL BLEND JACKET',
        description: 'Описание товара...',
        category: '',
        subcategory: '',
        subSubcategory: '',
        stock: '45',
        sizes: ['S', 'M', 'L'],
        variants: [
          {
            id: Date.now(),
            colorName: 'Черный',
            colorImage: null,
            price: '299900',
            stock: '20',
            sizes: ['S', 'M', 'L'],
            sizeStock: { 'S': 10, 'M': 15, 'L': 5 },
            images: []
          }
        ]
      };
      
      setFormData(mockProductData);
    }
  }, [isEditMode, id]);

  // Преобразование категорий в плоский список для выбора
  const getAllCategoriesForSelect = () => {
    const allCategories = [];
    
    // Добавляем главные категории
    categories.forEach(cat => {
      allCategories.push({
        id: cat.id,
        name: cat.title || cat.name,
        type: 'main',
        parentId: null
      });
      
      // Добавляем подкатегории
      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          allCategories.push({
            id: sub.id,
            name: `${cat.title || cat.name} > ${sub.title || sub.name}`,
            type: 'sub',
            parentId: cat.id
          });
          
          // Добавляем под-подкатегории
          if (sub.subcategories && sub.subcategories.length > 0) {
            sub.subcategories.forEach(subSub => {
              allCategories.push({
                id: subSub.id,
                name: `${cat.title || cat.name} > ${sub.title || sub.name} > ${subSub.title || subSub.name}`,
                type: 'subsub',
                parentId: sub.id
              });
            });
          }
        });
      }
    });
    
    return allCategories;
  };

  // Находим выбранную категорию (может быть главная, подкатегория или под-подкатегория)
  const selectedCategoryItem = getAllCategoriesForSelect().find(item => item.id.toString() === formData.category);
  
  // Определяем тип выбранной категории
  const getCategoryType = () => {
    if (!selectedCategoryItem) return null;
    return selectedCategoryItem.type;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // При изменении категории сбрасываем подкатегории
      if (field === 'category') {
        newData.subcategory = '';
        newData.subSubcategory = '';
      }
      
      return newData;
    });
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: Date.now(),
          colorName: '',
          colorImage: null,
          price: '',
          stock: '',
          sizes: [],
          sizeStock: {},
          images: []
        }
      ]
    }));
  };

  const handleRemoveVariant = (variantId) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter(v => v.id !== variantId)
      }));
    }
  };

  const handleVariantChange = (variantId, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleVariantSizeToggle = (variantId, size) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? {
              ...variant,
              sizes: (variant.sizes || []).includes(size)
                ? (variant.sizes || []).filter(s => s !== size)
                : [...(variant.sizes || []), size]
            }
          : variant
      )
    }));
  };

  const handleVariantSizeStockChange = (variantId, size, stock) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? {
              ...variant,
              sizeStock: {
                ...(variant.sizeStock || {}),
                [size]: stock
              }
            }
          : variant
      )
    }));
  };

  const handleVariantImageUpload = (variantId, e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? { ...variant, images: [...variant.images, ...newImages] }
          : variant
      )
    }));
  };

  const handleRemoveVariantImage = (variantId, imageId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? { ...variant, images: variant.images.filter(img => img.id !== imageId) }
          : variant
      )
    }));
  };

  const uploadSingleImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (uploadRes.data && uploadRes.data.url) {
        return `${BASE_URL}${uploadRes.data.url}`;
      }
      return null;
    } catch (err) {
      console.error("Error uploading image:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите название товара",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите категорию",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Проверка вариантов
    for (let variant of formData.variants) {
      if (!variant.colorName.trim()) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, заполните название цвета для всех вариантов",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (!variant.price) {
        toast({
          title: "Ошибка",
          description: `Пожалуйста, введите цену для варианта "${variant.colorName}"`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (variant.images.length === 0) {
        toast({
          title: "Ошибка",
          description: `Пожалуйста, загрузите хотя бы одно изображение для варианта "${variant.colorName}"`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    // Загружаем изображения и получаем их URL
    const uploadImages = async (imageFiles) => {
      const uploadedUrls = [];
      for (const imageFile of imageFiles) {
        try {
          const formData = new FormData();
          formData.append('file', imageFile);
          const uploadRes = await axios.post(`${BASE_URL}/upload/image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if (uploadRes.data && uploadRes.data.url) {
            uploadedUrls.push(`${BASE_URL}${uploadRes.data.url}`);
          }
        } catch (err) {
          console.error("Error uploading image:", err);
          toast({
            title: "Предупреждение",
            description: "Не удалось загрузить одно из изображений",
            status: "warning",
            duration: 2000,
          });
        }
      }
      return uploadedUrls;
    };

    try {
      // Загружаем изображения для всех вариантов
      const variantsWithImages = await Promise.all(
        formData.variants.map(async (variant) => {
          const imageUrls = await uploadImages(variant.images.map(img => img.file));
          
          // Загружаем color_image если он есть
          let colorImageUrl = null;
          if (variant.colorImage && variant.colorImage.file) {
            colorImageUrl = await uploadSingleImage(variant.colorImage.file);
          }
          
          return {
            color_name: variant.colorName,
            color_image: colorImageUrl,
            price: parseFloat(variant.price) || 0,
            stock: parseInt(variant.stock) || 0,
            sizes: variant.sizes || [],
            size_stock: variant.sizeStock || {},
            images: imageUrls
          };
        })
      );

      // Подготовка данных для отправки на бэкенд
      const productData = {
        name: formData.name,
        description: formData.description,
        category_id: parseInt(formData.category),
        stock: parseInt(formData.stock) || 0,
        description_title: formData.description_title || null,
        material: formData.material || null,
        branding: formData.branding || null,
        packaging: formData.packaging || null,
        size_guide: formData.size_guide || null,
        delivery_info: formData.delivery_info || null,
        return_info: formData.return_info || null,
        exchange_info: formData.exchange_info || null,
        variants: variantsWithImages
      };

      // Отправка на бэкенд
      const response = isEditMode 
        ? await axios.put(`${BASE_URL}/cloths/${id}`, productData)
        : await axios.post(`${BASE_URL}/cloths`, productData);
      
      toast({
        title: "Успешно",
        description: isEditMode ? "Товар успешно обновлен" : "Товар успешно добавлен",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/products');
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось сохранить товар",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Box
        mb="40px"
        pb="25px"
        borderBottom="2px solid"
        borderColor="#e5e5e5"
      >
        <Flex align="center" gap="25px">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/products')}
            _hover={{ bg: "gray.100" }}
            fontSize="12px"
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            px="15px"
            py="10px"
          >
            Назад
          </Button>
          <Heading
            fontSize="32px"
            fontWeight="400"
            letterSpacing="3px"
            textTransform="uppercase"
            fontFamily="'Manrope', sans-serif"
            color="black"
            as="h1"
            m="0"
            sx={{
              textTransform: 'uppercase !important',
              letterSpacing: '3px !important',
              fontSize: '32px !important',
              fontWeight: '400 !important',
            }}
          >
            ДОБАВИТЬ ТОВАР
          </Heading>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="30px">
        {/* Left Column - Main Info */}
        <VStack spacing="25px" align="stretch">
          <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
            <Text
              fontSize="14px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="20px"
            >
              Основная информация
            </Text>

            <VStack spacing="20px" align="stretch">
              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Название товара *
                </FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Например: WOOL BLEND JACKET"
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  paddingY="15px"
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Описание
                </FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Описание товара..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={5}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Общий остаток на складе
                </FormLabel>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="100"
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  paddingY="15px"
                />
              </FormControl>
            </VStack>
          </Box>

          {/* Category Selection */}
          <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
            <Text
              fontSize="14px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="20px"
            >
              Категория *
            </Text>

            <VStack spacing="20px" align="stretch">
              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Категория
                </FormLabel>
                {loadingCategories ? (
                  <Flex align="center" justify="center" py="20px">
                    <Spinner size="sm" />
                  </Flex>
                ) : (
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="Выберите категорию или подкатегорию"
                    borderRadius="0"
                    borderColor="black"
                    borderBottom="1px solid"
                    borderTop="none"
                    borderLeft="none"
                    borderRight="none"
                    _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                    fontSize="14px"
                    paddingY="15px"
                  >
                    {getAllCategoriesForSelect().map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>
            </VStack>
          </Box>

          {/* Детальное описание товара */}
          <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
            <Text
              fontSize="14px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="20px"
            >
              Детальное описание товара
            </Text>

            <VStack spacing="20px" align="stretch">
              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Заголовок описания
                </FormLabel>
                <Input
                  value={formData.description_title}
                  onChange={(e) => handleInputChange('description_title', e.target.value)}
                  placeholder="Например: Ozbekistan-это центр мира!"
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  paddingY="15px"
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Материал
                </FormLabel>
                <Textarea
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="Например: 100% натуральный хлопок с начесом..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Брендинг
                </FormLabel>
                <Textarea
                  value={formData.branding}
                  onChange={(e) => handleInputChange('branding', e.target.value)}
                  placeholder="Например: Уникальный принт «OZBEKISTAN»..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Упаковка
                </FormLabel>
                <Textarea
                  value={formData.packaging}
                  onChange={(e) => handleInputChange('packaging', e.target.value)}
                  placeholder="Например: Доставляется в фирменном пакете OZBE."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={2}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Гид по размерам
                </FormLabel>
                <Textarea
                  value={formData.size_guide}
                  onChange={(e) => handleInputChange('size_guide', e.target.value)}
                  placeholder="Например: S - Обхват груди: 110-120 см&#10;M - Обхват груди: 120-130 см&#10;L - Обхват груди: 130-140 см"
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={5}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Информация о доставке
                </FormLabel>
                <Textarea
                  value={formData.delivery_info}
                  onChange={(e) => handleInputChange('delivery_info', e.target.value)}
                  placeholder="Например: Бесплатная стандартная доставка при заказе на сумму свыше 500,000 UZS..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Информация о возврате
                </FormLabel>
                <Textarea
                  value={formData.return_info}
                  onChange={(e) => handleInputChange('return_info', e.target.value)}
                  placeholder="Например: Вы можете вернуть товар в течение 30 дней..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Информация об обмене
                </FormLabel>
                <Textarea
                  value={formData.exchange_info}
                  onChange={(e) => handleInputChange('exchange_info', e.target.value)}
                  placeholder="Например: Обмен товара возможен в течение 14 дней..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>
            </VStack>
          </Box>
        </VStack>

        {/* Right Column - Variants */}
        <VStack spacing="25px" align="stretch">
          {/* Product Variants */}
          <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
            <Flex justify="space-between" align="center" mb="20px">
              <Text
                fontSize="14px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
              >
                Варианты товара (Цвета)
              </Text>
              <Button
                leftIcon={<FiPlus />}
                size="sm"
                variant="outline"
                borderRadius="20px"
                fontSize="11px"
                borderColor="black"
                color="black"
                _hover={{ bg: "black", color: "white" }}
                onClick={handleAddVariant}
              >
                Добавить цвет
              </Button>
            </Flex>

            <VStack spacing="20px" align="stretch">
              {formData.variants.map((variant, index) => (
                <Box
                  key={variant.id}
                  p="20px"
                  border="1px solid"
                  borderColor="#e5e5e5"
                  borderRadius="15px"
                  bg="gray.50"
                  position="relative"
                >
                  {/* Variant Header */}
                  <Flex align="center" justify="space-between" mb="15px">
                    <Text fontSize="12px" fontWeight="500" color="gray.700" letterSpacing="0.5px">
                      Вариант {index + 1}
                    </Text>
                    {formData.variants.length > 1 && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleRemoveVariant(variant.id)}
                        color="red.500"
                        _hover={{ bg: "red.50" }}
                      >
                        <FiX />
                      </Button>
                    )}
                  </Flex>

                  <VStack spacing="15px" align="stretch">
                    {/* Color Name */}
                    <FormControl>
                      <FormLabel
                        fontSize="11px"
                        fontWeight="400"
                        letterSpacing="0.5px"
                        textTransform="uppercase"
                        mb="8px"
                      >
                        Название цвета *
                      </FormLabel>
                      <Input
                        value={variant.colorName}
                        onChange={(e) => handleVariantChange(variant.id, 'colorName', e.target.value)}
                        placeholder="Например: Черный"
                        borderRadius="0"
                        borderColor="black"
                        borderBottom="1px solid"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                        fontSize="13px"
                        paddingY="12px"
                        bg="white"
                      />
                    </FormControl>

                    {/* Color Preview Image */}
                    <FormControl>
                      <FormLabel
                        fontSize="11px"
                        fontWeight="400"
                        letterSpacing="0.5px"
                        textTransform="uppercase"
                        mb="8px"
                      >
                        Фото цвета (превью)
                      </FormLabel>
                      {variant.colorImage ? (
                        <Box position="relative" mb="10px">
                          <Image
                            src={variant.colorImage.preview}
                            alt="Color preview"
                            borderRadius="10px"
                            objectFit="cover"
                            w="80px"
                            h="80px"
                            border="2px solid"
                            borderColor="#e5e5e5"
                          />
                          <Button
                            position="absolute"
                            top="-5px"
                            right="-5px"
                            size="xs"
                            bg="red.500"
                            color="white"
                            borderRadius="50%"
                            p="0"
                            minW="20px"
                            h="20px"
                            onClick={() => handleVariantChange(variant.id, 'colorImage', null)}
                            _hover={{ bg: "red.600" }}
                          >
                            <FiX size={10} />
                          </Button>
                        </Box>
                      ) : (
                        <Box
                          as="label"
                          cursor="pointer"
                          border="2px dashed"
                          borderColor="#e5e5e5"
                          borderRadius="10px"
                          p="20px"
                          textAlign="center"
                          _hover={{ borderColor: "black", bg: "gray.50" }}
                          transition="all 0.2s"
                          display="block"
                          w="80px"
                        >
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                handleVariantChange(variant.id, 'colorImage', {
                                  id: Date.now(),
                                  file: file,
                                  preview: URL.createObjectURL(file)
                                });
                              }
                            }}
                            display="none"
                            id={`color-image-upload-${variant.id}`}
                          />
                          <VStack spacing="5px">
                            <Icon as={FiUpload} boxSize="20px" color="gray.400" />
                            <Text fontSize="10px" color="gray.500">
                              Загрузить
                            </Text>
                          </VStack>
                        </Box>
                      )}
                    </FormControl>

                    {/* Price */}
                    <FormControl>
                      <FormLabel
                        fontSize="11px"
                        fontWeight="400"
                        letterSpacing="0.5px"
                        textTransform="uppercase"
                        mb="8px"
                      >
                        Цена (UZS) *
                      </FormLabel>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                        placeholder="299900"
                        borderRadius="0"
                        borderColor="black"
                        borderBottom="1px solid"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                        fontSize="13px"
                        paddingY="12px"
                        bg="white"
                      />
                    </FormControl>

                    {/* Sizes for this variant */}
                    <FormControl>
                      <FormLabel
                        fontSize="11px"
                        fontWeight="400"
                        letterSpacing="0.5px"
                        textTransform="uppercase"
                        mb="10px"
                      >
                        Размеры для этого цвета
                      </FormLabel>
                      <Wrap spacing="10px" mb="15px">
                        {availableSizes.map(size => (
                          <WrapItem key={size}>
                            <Checkbox
                              isChecked={(variant.sizes || []).includes(size)}
                              onChange={() => handleVariantSizeToggle(variant.id, size)}
                              borderRadius="4px"
                              borderColor="black"
                              _checked={{
                                bg: "black",
                                borderColor: "black",
                                color: "white"
                              }}
                            >
                              <Text fontSize="12px" fontWeight="400">
                                {size}
                              </Text>
                            </Checkbox>
                          </WrapItem>
                        ))}
                      </Wrap>

                      {/* Stock by size */}
                      {(variant.sizes || []).length > 0 && (
                        <VStack spacing="10px" align="stretch" mt="10px">
                          <Text fontSize="10px" color="gray.600" letterSpacing="0.5px">
                            Остатки по размерам:
                          </Text>
                          <SimpleGrid columns={2} spacing="10px">
                            {(variant.sizes || []).map(size => (
                              <FormControl key={size}>
                                <FormLabel fontSize="10px" mb="5px">
                                  {size}
                                </FormLabel>
                                <Input
                                  type="number"
                                  value={(variant.sizeStock || {})[size] || ''}
                                  onChange={(e) => handleVariantSizeStockChange(variant.id, size, e.target.value)}
                                  placeholder="0"
                                  borderRadius="0"
                                  borderColor="gray.400"
                                  borderBottom="1px solid"
                                  borderTop="none"
                                  borderLeft="none"
                                  borderRight="none"
                                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                                  fontSize="12px"
                                  paddingY="10px"
                                  bg="white"
                                />
                              </FormControl>
                            ))}
                          </SimpleGrid>
                        </VStack>
                      )}
                    </FormControl>

                    {/* Images for this variant */}
                    <Box>
                      <Text
                        fontSize="11px"
                        fontWeight="400"
                        letterSpacing="0.5px"
                        textTransform="uppercase"
                        mb="10px"
                      >
                        Фотографии для этого цвета *
                      </Text>
                      
                      <Box
                        as="label"
                        cursor="pointer"
                        border="2px dashed"
                        borderColor="#e5e5e5"
                        borderRadius="12px"
                        p="20px"
                        textAlign="center"
                        _hover={{ borderColor: "black", bg: "white" }}
                        transition="all 0.2s"
                        display="block"
                        mb="15px"
                      >
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleVariantImageUpload(variant.id, e)}
                          display="none"
                          id={`image-upload-${variant.id}`}
                        />
                        <VStack spacing="8px">
                          <Icon as={FiUpload} boxSize="24px" color="gray.400" />
                          <Text fontSize="11px" color="gray.500">
                            Загрузить фотографии
                          </Text>
                        </VStack>
                      </Box>

                      {variant.images.length > 0 && (
                        <SimpleGrid columns={3} spacing="10px">
                          {variant.images.map((image) => (
                            <Box key={image.id} position="relative">
                              <Image
                                src={image.preview}
                                alt="Preview"
                                borderRadius="10px"
                                objectFit="cover"
                                w="100%"
                                h="100px"
                              />
                              <Button
                                position="absolute"
                                top="5px"
                                right="5px"
                                size="xs"
                                bg="red.500"
                                color="white"
                                borderRadius="50%"
                                p="0"
                                minW="18px"
                                h="18px"
                                onClick={() => handleRemoveVariantImage(variant.id, image.id)}
                                _hover={{ bg: "red.600" }}
                              >
                                <FiX size={10} />
                              </Button>
                            </Box>
                          ))}
                        </SimpleGrid>
                      )}
                    </Box>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* General Sizes Info */}
          <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="30px">
            <Text
              fontSize="14px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="20px"
            >
              Общие размеры товара
            </Text>

            <FormControl>
              <FormLabel
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                mb="15px"
              >
                Доступные размеры (для всех цветов)
              </FormLabel>
              <Wrap spacing="15px">
                {availableSizes.map(size => (
                  <WrapItem key={size}>
                    <Checkbox
                      isChecked={formData.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      borderRadius="4px"
                      borderColor="black"
                      size="md"
                      _checked={{
                        bg: "black",
                        borderColor: "black",
                        color: "white"
                      }}
                    >
                      <Text fontSize="13px" fontWeight="400" letterSpacing="0.5px">
                        {size}
                      </Text>
                    </Checkbox>
                  </WrapItem>
                ))}
              </Wrap>
              
              {formData.sizes.length > 0 && (
                <Text fontSize="11px" color="gray.600" mt="15px" fontStyle="italic">
                  Выбрано размеров: {formData.sizes.join(', ')}
                </Text>
              )}
            </FormControl>
          </Box>
        </VStack>
      </SimpleGrid>

      {/* Submit Buttons */}
      <Flex justify="flex-end" gap="15px" mt="30px">
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
          px="30px"
          py="20px"
          onClick={() => navigate('/products')}
        >
          Отмена
        </Button>
        <Button
          bg="black"
          color="white"
          borderRadius="20px"
          fontSize="12px"
          fontWeight="400"
          letterSpacing="0.5px"
          textTransform="uppercase"
          _hover={{ bg: "gray.800" }}
          px="30px"
          py="20px"
          onClick={handleSubmit}
        >
          {isEditMode ? 'Сохранить изменения' : 'Сохранить товар'}
        </Button>
      </Flex>
    </Box>
  );
};

export default AddProduct;

