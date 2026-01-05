import React, { useState, useMemo } from 'react';
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
import { FiArrowLeft, FiPlus, FiX, FiUpload, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const AddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // Переводы
    name_translations: {},
    description_translations: {},
    description_title_translations: {},
    material_translations: {},
    branding_translations: {},
    packaging_translations: {},
    size_guide_translations: {},
    delivery_info_translations: {},
    return_info_translations: {},
    exchange_info_translations: {},
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

  // Взрослые размеры
  const adultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Детские размеры
  const kidsSizes = [
    '1 год (86 см)',
    '2 года (92 см)',
    '3 года (98 см)',
    '4 года (104 см)',
    '5 лет (110 см)',
    '6 лет (118 см)',
    '7 лет (122 см)',
    '8 лет (128 см)',
    '9 лет (134 см)',
    '10 лет (140 см)',
    '11 лет (146 см)',
    '12 лет (152 см)',
    '13 лет (158 см)',
    '14 лет (164 см)'
  ];
  
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
    const fetchProduct = async () => {
      if (isEditMode && id) {
        try {
          const response = await axios.get(`${BASE_URL}/products/${id}`);
          const product = response.data;
          
          // Преобразуем данные из API в формат формы
          const productData = {
            name: product.name || '',
            description: product.description || '',
            name_translations: product.name_translations || {},
            description_translations: product.description_translations || {},
            description_title_translations: product.description_title_translations || {},
            material_translations: product.material_translations || {},
            branding_translations: product.branding_translations || {},
            packaging_translations: product.packaging_translations || {},
            size_guide_translations: product.size_guide_translations || {},
            delivery_info_translations: product.delivery_info_translations || {},
            return_info_translations: product.return_info_translations || {},
            exchange_info_translations: product.exchange_info_translations || {},
            category: product.category_id?.toString() || '',
            subcategory: '',
            subSubcategory: '',
            stock: product.stock?.toString() || '0',
            sizes: [],
            description_title: product.description_title || '',
            material: product.material || '',
            branding: product.branding || '',
            packaging: product.packaging || '',
            size_guide: product.size_guide || '',
            delivery_info: product.delivery_info || '',
            return_info: product.return_info || '',
            exchange_info: product.exchange_info || '',
            variants: product.variants?.map((variant, index) => {
              // Преобразуем изображения из API в формат формы
              // Сортируем по полю order, если оно есть
              const sortedImages = variant.images?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
              const variantImages = sortedImages.map((img, imgIndex) => ({
                id: img.id || Date.now() + imgIndex,
                file: null, // Файл не нужен, так как изображение уже загружено
                preview: (() => { const url = img.image_url || img.url || ''; if (!url) return ''; return url.replace(/^http:\/\/147\.45\.155\.163:8000\/uploads/, 'https://libertywear.uz/uploads').replace(/^http:\/\/147\.45\.155\.163:8000/, 'https://libertywear.uz/api').replace(/^http:\/\//, 'https://'); })(), // Используем URL как preview
                url: (() => { const url = img.image_url || img.url || ''; if (!url) return ''; return url.replace(/^http:\/\/147\.45\.155\.163:8000\/uploads/, 'https://libertywear.uz/uploads').replace(/^http:\/\/147\.45\.155\.163:8000/, 'https://libertywear.uz/api').replace(/^http:\/\//, 'https://'); })(), // Сохраняем оригинальный URL
                order: img.order || imgIndex // Сохраняем порядок
              })) || [];
              
              return {
                id: variant.id || Date.now() + index,
                colorName: variant.color_name || '',
                colorImage: (() => { const url = variant.color_image || null; if (!url) return url; return url.replace(/^http:\/\/147\.45\.155\.163:8000\/uploads/, 'https://libertywear.uz/uploads').replace(/^http:\/\/147\.45\.155\.163:8000/, 'https://libertywear.uz/api').replace(/^http:\/\//, 'https://'); })(),
                price: variant.price?.toString() || '0',
                stock: variant.stock?.toString() || '0',
                sizes: Array.isArray(variant.sizes) ? variant.sizes : [],
                sizeStock: variant.size_stock && typeof variant.size_stock === 'object' ? variant.size_stock : {},
                images: variantImages
              };
            }) || []
          };
          
          // Убеждаемся, что все поля имеют значения (не undefined)
          Object.keys(productData).forEach(key => {
            if (productData[key] === undefined) {
              productData[key] = '';
            }
          });
          
          setFormData(productData);
        } catch (error) {
          console.error('Ошибка загрузки товара:', error);
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить данные товара",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };
    
    fetchProduct();
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

  // Функция для определения доступных размеров в зависимости от категории
  const getAvailableSizes = () => {
    if (!formData.category || categories.length === 0) {
      console.log('No category selected or categories not loaded, returning adult sizes');
      return adultSizes;
    }
    
    // Находим полную информацию о категории из categories
    let categoryToCheck = null;
    
    // Ищем в главных категориях
    categoryToCheck = categories.find(cat => cat.id.toString() === formData.category.toString());
    
    // Если не нашли, ищем в подкатегориях
    if (!categoryToCheck) {
      for (const cat of categories) {
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
          const sub = cat.subcategories.find(sub => sub.id.toString() === formData.category.toString());
          if (sub) {
            categoryToCheck = sub;
            break;
          }
        }
      }
    }
    
    if (!categoryToCheck) {
      console.log('Category not found, returning adult sizes');
      return adultSizes;
    }
    
    // Проверяем gender категории
    const gender = categoryToCheck.gender || '';
    const title = (categoryToCheck.title || categoryToCheck.name || '').toLowerCase();
    
    console.log('Checking category:', {
      id: categoryToCheck.id,
      title: categoryToCheck.title || categoryToCheck.name,
      gender: gender,
      title_lower: title
    });
    
    // Проверяем, детская ли это категория
    const isKidsCategory = gender === 'kids' || 
          gender === 'children' || 
          gender === 'kid' ||
          title.includes('дет') || 
          title.includes('kid') || 
          title.includes('children') ||
          title.includes('bolalar') ||
          title.includes('niños');
    
    if (isKidsCategory) {
      console.log('Kids category detected, returning kids sizes');
      return kidsSizes;
    }
    
    console.log('Adult category, returning adult sizes');
    return adultSizes;
  };
  
  // Вычисляем доступные размеры с помощью useMemo для оптимизации
  const availableSizes = useMemo(() => {
    const sizes = getAvailableSizes();
    console.log('Available sizes calculated:', {
      category: formData.category,
      sizesCount: sizes.length,
      firstSize: sizes[0],
      isKids: sizes === kidsSizes || (sizes.length > 0 && (sizes[0].includes('год') || sizes[0].includes('лет')))
    });
    return sizes;
  }, [formData.category, categories]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // При изменении категории сбрасываем подкатегории и размеры
      if (field === 'category') {
        newData.subcategory = '';
        newData.subSubcategory = '';
        // Сбрасываем размеры для главного товара
        newData.sizes = [];
        // Сбрасываем размеры для всех вариантов
        newData.variants = newData.variants.map(variant => ({
          ...variant,
          sizes: [],
          sizeStock: {}
        }));
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

  const handleMoveImageUp = (variantId, imageIndex) => {
    if (imageIndex === 0) return; // Уже первое изображение
    
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? {
              ...variant,
              images: variant.images.map((img, idx) => {
                if (idx === imageIndex) return variant.images[imageIndex - 1];
                if (idx === imageIndex - 1) return variant.images[imageIndex];
                return img;
              })
            }
          : variant
      )
    }));
  };

  const handleMoveImageDown = (variantId, imageIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant => {
        if (variant.id === variantId) {
          if (imageIndex === variant.images.length - 1) return variant; // Уже последнее изображение
          
          return {
            ...variant,
            images: variant.images.map((img, idx) => {
              if (idx === imageIndex) return variant.images[imageIndex + 1];
              if (idx === imageIndex + 1) return variant.images[imageIndex];
              return img;
            })
          };
        }
        return variant;
      })
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
          // Разделяем изображения на новые (с file) и существующие (с url)
          const newImages = variant.images.filter(img => img.file);
          const existingImages = variant.images.filter(img => !img.file && img.url);
          
          // Загружаем только новые изображения
          const newImageUrls = await uploadImages(newImages.map(img => img.file));
          
          // Собираем все URL в правильном порядке (порядок определяется порядком в массиве variant.images)
          // Порядок важен - первое изображение будет главным на карточке товара
          const allImageUrls = variant.images.map(img => {
            if (img.file) {
              // Новое изображение - находим его URL в загруженных
              const index = newImages.findIndex(newImg => newImg.file === img.file);
              const url = newImageUrls[index];
              // Если URL содержит BASE_URL, оставляем как есть (это полный URL)
              return url;
            } else {
              // Существующее изображение - используем его URL
              let url = img.url || img.preview || '';
              // Если URL содержит BASE_URL, это уже полный URL, оставляем как есть
              // Если это относительный путь, добавляем BASE_URL
              if (url && !url.startsWith('http')) {
                url = url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
              }
              return url;
            }
          }).filter(url => url && url.trim()); // Убираем пустые значения
          
          // Загружаем color_image если он есть (новый файл)
          let colorImageUrl = variant.colorImage;
          if (variant.colorImage && typeof variant.colorImage === 'object' && variant.colorImage.file) {
            colorImageUrl = await uploadSingleImage(variant.colorImage.file);
          }
          
          return {
            color_name: variant.colorName,
            color_image: colorImageUrl,
            price: parseFloat(variant.price) || 0,
            stock: parseInt(variant.stock) || 0,
            sizes: variant.sizes || [],
            size_stock: variant.sizeStock || {},
            images: allImageUrls
          };
        })
      );

      // Подготовка данных для отправки на бэкенд
      const productData = {
        name: formData.name,
        description: formData.description,
        name_translations: formData.name_translations,
        description_translations: formData.description_translations,
        description_title_translations: formData.description_title_translations,
        material_translations: formData.material_translations,
        branding_translations: formData.branding_translations,
        packaging_translations: formData.packaging_translations,
        size_guide_translations: formData.size_guide_translations,
        delivery_info_translations: formData.delivery_info_translations,
        return_info_translations: formData.return_info_translations,
        exchange_info_translations: formData.exchange_info_translations,
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
        ? await axios.put(`${BASE_URL}/products/${id}`, productData)
        : await axios.post(`${BASE_URL}/products`, productData);
      
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
                  value={formData.name || ''}
                onChange={(e) => {
                  const newName = e.target.value;
                  handleInputChange('name', newName);
                  setFormData(prev => ({
                    ...prev,
                    name_translations: { ...prev.name_translations, ru: newName }
                  }));
                }}
                placeholder="Например: WOOL BLEND JACKET (русский вариант)"
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

              <TranslationFields
                label="Название товара"
                fieldName="name"
                value={formData.name_translations || { ru: formData.name || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, name_translations: translations }))}
                type="input"
              />

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
                  value={formData.description || ''}
                  onChange={(e) => {
                    const newDesc = e.target.value;
                    handleInputChange('description', newDesc);
                    setFormData(prev => ({
                      ...prev,
                      description_translations: { ...prev.description_translations, ru: newDesc }
                    }));
                  }}
                  placeholder="Описание товара..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={5}
                />
              </FormControl>

              <TranslationFields
                label="Описание"
                fieldName="description"
                value={formData.description_translations || { ru: formData.description || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, description_translations: translations }))}
                type="textarea"
              />

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
                  value={formData.stock || ''}
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
                    value={formData.category || ''}
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
                  Заголовок описания (русский)
                </FormLabel>
                <Input
                  value={formData.description_title || ''}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    handleInputChange('description_title', newTitle);
                    setFormData(prev => ({
                      ...prev,
                      description_title_translations: { ...prev.description_title_translations, ru: newTitle }
                    }));
                  }}
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

              <TranslationFields
                label="Заголовок описания"
                fieldName="description_title"
                value={formData.description_title_translations || { ru: formData.description_title || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, description_title_translations: translations }))}
                type="input"
              />

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Материал (русский)
                </FormLabel>
                <Textarea
                  value={formData.material || ''}
                  onChange={(e) => {
                    const newMaterial = e.target.value;
                    handleInputChange('material', newMaterial);
                    setFormData(prev => ({
                      ...prev,
                      material_translations: { ...prev.material_translations, ru: newMaterial }
                    }));
                  }}
                  placeholder="Например: 100% натуральный хлопок с начесом..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <TranslationFields
                label="Материал"
                fieldName="material"
                value={formData.material_translations || { ru: formData.material || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, material_translations: translations }))}
                type="textarea"
              />

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Брендинг (русский)
                </FormLabel>
                <Textarea
                  value={formData.branding || ''}
                  onChange={(e) => {
                    const newBranding = e.target.value;
                    handleInputChange('branding', newBranding);
                    setFormData(prev => ({
                      ...prev,
                      branding_translations: { ...prev.branding_translations, ru: newBranding }
                    }));
                  }}
                  placeholder="Например: Уникальный принт «OZBEKISTAN»..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <TranslationFields
                label="Брендинг"
                fieldName="branding"
                value={formData.branding_translations || { ru: formData.branding || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, branding_translations: translations }))}
                type="textarea"
              />

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Упаковка (русский)
                </FormLabel>
                <Textarea
                  value={formData.packaging || ''}
                  onChange={(e) => {
                    const newPackaging = e.target.value;
                    handleInputChange('packaging', newPackaging);
                    setFormData(prev => ({
                      ...prev,
                      packaging_translations: { ...prev.packaging_translations, ru: newPackaging }
                    }));
                  }}
                  placeholder="Например: Доставляется в фирменном пакете OZBE."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={2}
                />
              </FormControl>

              <TranslationFields
                label="Упаковка"
                fieldName="packaging"
                value={formData.packaging_translations || { ru: formData.packaging || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, packaging_translations: translations }))}
                type="textarea"
              />

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Гид по размерам (русский)
                </FormLabel>
                <Textarea
                  value={formData.size_guide || ''}
                  onChange={(e) => {
                    const newSizeGuide = e.target.value;
                    handleInputChange('size_guide', newSizeGuide);
                    setFormData(prev => ({
                      ...prev,
                      size_guide_translations: { ...prev.size_guide_translations, ru: newSizeGuide }
                    }));
                  }}
                  placeholder="Например: S - Обхват груди: 110-120 см&#10;M - Обхват груди: 120-130 см&#10;L - Обхват груди: 130-140 см"
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={5}
                />
              </FormControl>

              <TranslationFields
                label="Гид по размерам"
                fieldName="size_guide"
                value={formData.size_guide_translations || { ru: formData.size_guide || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, size_guide_translations: translations }))}
                type="textarea"
              />

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Информация о доставке (русский)
                </FormLabel>
                <Textarea
                  value={formData.delivery_info || ''}
                  onChange={(e) => {
                    const newDeliveryInfo = e.target.value;
                    handleInputChange('delivery_info', newDeliveryInfo);
                    setFormData(prev => ({
                      ...prev,
                      delivery_info_translations: { ...prev.delivery_info_translations, ru: newDeliveryInfo }
                    }));
                  }}
                  placeholder="Например: Бесплатная стандартная доставка при заказе на сумму свыше 500,000 UZS..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <TranslationFields
                label="Информация о доставке"
                fieldName="delivery_info"
                value={formData.delivery_info_translations || { ru: formData.delivery_info || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, delivery_info_translations: translations }))}
                type="textarea"
              />

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Информация о возврате (русский)
                </FormLabel>
                <Textarea
                  value={formData.return_info || ''}
                  onChange={(e) => {
                    const newReturnInfo = e.target.value;
                    handleInputChange('return_info', newReturnInfo);
                    setFormData(prev => ({
                      ...prev,
                      return_info_translations: { ...prev.return_info_translations, ru: newReturnInfo }
                    }));
                  }}
                  placeholder="Например: Вы можете вернуть товар в течение 30 дней..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <TranslationFields
                label="Информация о возврате"
                fieldName="return_info"
                value={formData.return_info_translations || { ru: formData.return_info || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, return_info_translations: translations }))}
                type="textarea"
              />

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="10px"
                >
                  Информация об обмене (русский)
                </FormLabel>
                <Textarea
                  value={formData.exchange_info || ''}
                  onChange={(e) => {
                    const newExchangeInfo = e.target.value;
                    handleInputChange('exchange_info', newExchangeInfo);
                    setFormData(prev => ({
                      ...prev,
                      exchange_info_translations: { ...prev.exchange_info_translations, ru: newExchangeInfo }
                    }));
                  }}
                  placeholder="Например: Обмен товара возможен в течение 14 дней..."
                  borderRadius="0"
                  borderColor="black"
                  border="1px solid"
                  _focus={{ border: "1px solid black", boxShadow: "none" }}
                  fontSize="14px"
                  rows={3}
                />
              </FormControl>

              <TranslationFields
                label="Информация об обмене"
                fieldName="exchange_info"
                value={formData.exchange_info_translations || { ru: formData.exchange_info || '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData(prev => ({ ...prev, exchange_info_translations: translations }))}
                type="textarea"
              />
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
                        value={variant.colorName || ''}
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
                            src={typeof variant.colorImage === 'string' ? variant.colorImage : (variant.colorImage.preview || variant.colorImage.url || '')}
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
                        value={variant.price || ''}
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
                        {availableSizes.length > 0 && (
                          <Text as="span" fontSize="10px" color="gray.500" ml="10px" fontWeight="normal">
                            ({availableSizes.length} размеров)
                          </Text>
                        )}
                      </FormLabel>
                      <Wrap spacing="10px" mb="15px">
                        {availableSizes.length > 0 ? availableSizes.map(size => (
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
                        )) : (
                          <Text fontSize="11px" color="gray.500">
                            Выберите категорию для отображения размеров
                          </Text>
                        )}
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
                          {variant.images.map((image, imageIndex) => (
                            <Box key={image.id} position="relative">
                              <Image
                                src={image.preview || image.url || ''}
                                alt="Preview"
                                borderRadius="10px"
                                objectFit="cover"
                                w="100%"
                                h="100px"
                              />
                              {/* Индикатор первой фотографии (главное изображение) */}
                              {imageIndex === 0 && (
                                <Box
                                  position="absolute"
                                  top="5px"
                                  left="5px"
                                  bg="black"
                                  color="white"
                                  px="6px"
                                  py="2px"
                                  borderRadius="4px"
                                  fontSize="9px"
                                  fontWeight="600"
                                  letterSpacing="0.5px"
                                >
                                  ГЛАВНАЯ
                                </Box>
                              )}
                              {/* Кнопки изменения порядка */}
                              <VStack
                                position="absolute"
                                top="5px"
                                right="5px"
                                spacing="4px"
                              >
                                {imageIndex > 0 && (
                                  <Button
                                    size="xs"
                                    bg="white"
                                    color="black"
                                    p="4px"
                                    minW="24px"
                                    h="24px"
                                    borderRadius="4px"
                                    onClick={() => handleMoveImageUp(variant.id, imageIndex)}
                                    _hover={{ bg: "gray.100" }}
                                    title="Переместить вверх"
                                  >
                                    <FiArrowUp size={12} />
                                  </Button>
                                )}
                                {imageIndex < variant.images.length - 1 && (
                                  <Button
                                    size="xs"
                                    bg="white"
                                    color="black"
                                    p="4px"
                                    minW="24px"
                                    h="24px"
                                    borderRadius="4px"
                                    onClick={() => handleMoveImageDown(variant.id, imageIndex)}
                                    _hover={{ bg: "gray.100" }}
                                    title="Переместить вниз"
                                  >
                                    <FiArrowDown size={12} />
                                  </Button>
                                )}
                              </VStack>
                              <Button
                                position="absolute"
                                bottom="5px"
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
                {formData.category && availableSizes.length > 0 && (
                  <Text as="span" fontSize="10px" color="gray.500" ml="10px" fontWeight="normal" fontStyle="normal">
                    {availableSizes[0]?.includes('год') || availableSizes[0]?.includes('лет') ? '(Детские)' : '(Взрослые)'}
                  </Text>
                )}
              </FormLabel>
              <Wrap spacing="15px">
                {availableSizes.length > 0 ? availableSizes.map(size => (
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
                )) : (
                  <Text fontSize="11px" color="gray.500">
                    Выберите категорию для отображения размеров
                  </Text>
                )}
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

