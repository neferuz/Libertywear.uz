import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Text,
  Skeleton,
  useToast,
  Flex,
  RadioGroup,
  Radio,
  VStack,
  SimpleGrid,
  Stack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiPlus, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL1 } from "../constants/config";
import { CART_UPDATE } from "../Redux/cart.redux/cartTypes";
import { useCart } from "../Context/CartContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const SingleProduct = () => {
  const { token, isAuth } = useSelector((state) => state.authReducer);
  let params = useParams();
  let { id } = params;
  const nav = useNavigate();
  const { openCart } = useCart();
  const [value, setValue] = useState("M");
  let [prodata, setProdata] = useState({});
  let [error, setError] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [arrayData, setArrayData] = useState([]);
  const [present, setPresent] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const similarProductsScrollRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // Преобразуем варианты из API в формат для отображения
  const colorVariants = prodata?.variants && prodata.variants.length > 0
    ? prodata.variants.map((variant) => ({
        name: variant.color_name || 'Color',
        image: variant.color_image || (variant.images && variant.images.length > 0 ? variant.images[0].image_url : ''),
        colorCode: '#000000', // Можно добавить цвет в бэкенд позже
        variant: variant // Сохраняем весь объект варианта
      }))
    : [];
  const toast = useToast();
  const [cartLoading, setCartLoading] = useState(false);
  const dispatch = useDispatch();

  const getMyData = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL1}/cloths/${id}`);
      if (res.data) {
        const product = res.data;
        // Преобразуем данные из новой структуры бэкенда
        const transformedProduct = {
          _id: product.id,
          id: product.id,
          productName: product.name,
          name: product.name,
          description: product.description,
          description_title: product.description_title,
          material: product.material,
          branding: product.branding,
          packaging: product.packaging,
          size_guide: product.size_guide,
          delivery_info: product.delivery_info,
          return_info: product.return_info,
          exchange_info: product.exchange_info,
          price: product.variants && product.variants.length > 0 ? product.variants[0].price : 0,
          variants: product.variants || [],
          category_id: product.category_id,
          category: product.category
        };
        setProdata(transformedProduct);
        
        // Устанавливаем первый вариант как выбранный по умолчанию
        if (product.variants && product.variants.length > 0) {
          setSelectedColor(0);
        }
        
        // Собираем изображения из первого варианта (по умолчанию)
        const allImages = [];
        const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
        
        if (firstVariant) {
          // Добавляем изображения варианта
          if (firstVariant.images && firstVariant.images.length > 0) {
            firstVariant.images.forEach((img, idx) => {
              if (img.image_url) {
                allImages.push({
                  ...transformedProduct,
                  _id: `${product.id}-${idx}`,
                  imageURL: img.image_url
                });
              }
            });
          }
          // Добавляем color_image если есть
          if (firstVariant.color_image) {
            allImages.push({
              ...transformedProduct,
              _id: `${product.id}-color`,
              imageURL: firstVariant.color_image
            });
          }
        }
        
        // Если изображений меньше 5, дублируем первое
        while (allImages.length < 5 && allImages.length > 0) {
          allImages.push({
            ...allImages[0],
            _id: `${product.id}-${allImages.length}`
          });
        }
        
        // Проверяем, есть ли реальные изображения (не пустые)
        const validImages = allImages.filter(img => img.imageURL && img.imageURL.trim() !== '' && img.imageURL !== 'undefined');
        
        // Если нет изображений, устанавливаем пустой массив
        if (validImages.length === 0) {
          setArrayData([]);
      } else {
          // Если изображений меньше 5, дублируем первое
          let finalImages = [...validImages];
          while (finalImages.length < 5 && finalImages.length > 0) {
            finalImages.push({
              ...finalImages[0],
              _id: `${product.id}-${finalImages.length}`
            });
          }
          setArrayData(finalImages.slice(0, 5));
        }
      } else {
        // Если данных нет, устанавливаем пустые значения
        setProdata({});
        setArrayData([]);
        setError("Товар не найден");
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching product:', err);
      // При ошибке устанавливаем пустые значения
      setProdata({});
      setArrayData([]);
      setError(err.response?.data?.detail || "Не удалось загрузить товар");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      // Если товар еще не загружен, не загружаем похожие
      if (!prodata || !prodata.id) {
        return;
      }

      try {
        // Получаем категорию текущего товара
        const currentCategoryId = prodata.category_id;
        const currentCategory = prodata.category;
        
        // Определяем gender из категории
        let gender = null;
        if (currentCategory) {
          gender = currentCategory.gender || null;
        }
        
        // Пытаемся загрузить товары из той же категории
        let similarProductsData = [];
        
        // Если есть category_id, пытаемся найти товары из той же категории
        if (currentCategoryId) {
          try {
            const categoryRes = await axios.get(`${BASE_URL1}/categories/${currentCategoryId}`);
            if (categoryRes.data) {
              const categorySlug = categoryRes.data.slug;
              // Загружаем товары из той же категории
              const res = await axios.get(`${BASE_URL1}/cloths?page=0&limit=20&itemCategory=${categorySlug}`);
              if (res.data && res.data.data && res.data.data.length > 0) {
                // Исключаем текущий товар
                similarProductsData = res.data.data
                  .filter(p => p.id !== prodata.id)
                  .slice(0, 8);
              }
            }
          } catch (err) {
            console.log('Error fetching by category:', err);
          }
        }
        
        // Если товаров из той же категории нет или мало, загружаем из той же gender категории
        if (similarProductsData.length < 8) {
          // Пытаемся получить gender из категории, если не получили ранее
          if (!gender && currentCategoryId) {
            try {
              const categoryRes = await axios.get(`${BASE_URL1}/categories/${currentCategoryId}`);
              if (categoryRes.data && categoryRes.data.gender) {
                gender = categoryRes.data.gender;
              }
            } catch (err) {
              console.log('Error fetching category for gender:', err);
            }
          }
          
          // Загружаем товары из той же gender категории
          if (gender) {
            try {
              const res = await axios.get(`${BASE_URL1}/cloths?page=0&limit=20&itemGender=${gender}`);
              if (res.data && res.data.data && res.data.data.length > 0) {
                // Исключаем текущий товар и добавляем к существующим
                const genderProducts = res.data.data
                  .filter(p => p.id !== prodata.id && !similarProductsData.find(sp => sp.id === p.id))
                  .slice(0, 8 - similarProductsData.length);
                
                similarProductsData = [...similarProductsData, ...genderProducts];
              }
            } catch (err) {
              console.log('Error fetching by gender:', err);
            }
          }
        }
        
        // Преобразуем данные в формат для отображения
        const transformedProducts = similarProductsData.map(product => {
          const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
          const allImages = [];
          
          if (firstVariant) {
            if (firstVariant.images && firstVariant.images.length > 0) {
              allImages.push(firstVariant.images[0].image_url);
            }
            if (firstVariant.color_image) {
              allImages.push(firstVariant.color_image);
            }
          }
          
          return {
            _id: product.id,
            id: product.id,
            productName: product.name,
            name: product.name,
            price: firstVariant ? firstVariant.price : 0,
            imageURL: allImages.length > 0 ? allImages[0] : '',
            variants: product.variants || []
          };
        });
        
        if (transformedProducts.length > 0) {
          setSimilarProducts(transformedProducts);
        } else {
          // Если ничего не найдено, показываем пустой массив
          setSimilarProducts([]);
        }
      } catch (err) {
        console.error('Error fetching similar products:', err);
        setSimilarProducts([]);
      }
    };
    
    fetchSimilarProducts();
  }, [prodata]);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await axios({
          method: "get",
          url: `${BASE_URL1}/cart/${id}`,
          headers: {
            Authorization: token,
          },
        });

        if (res.data.status === 1) {
          setPresent(true);
        }
      } catch (err) {
        // Silent fail
      }
    };
    if (token) getStatus();
  }, [id, token]);

  useEffect(() => {
    getMyData(id);
  }, [id]);

  // Проверка, в избранном ли товар
  useEffect(() => {
    const checkFavorite = async () => {
      // Получаем токен из разных источников
      const authToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
      const authStatus = isAuth || localStorage.getItem('isAuth') === 'true' || sessionStorage.getItem('isAuth') === 'true';
      
      if (authStatus && authToken && prodata?.id) {
        try {
          const response = await axios.get(`${BASE_URL1}/favorites/check/${prodata.id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          setIsFavorite(response.data.is_favorite || false);
        } catch (error) {
          console.error('Error checking favorite:', error);
          // Если ошибка 401, пользователь не авторизован - это нормально
          if (error.response?.status !== 401) {
            setIsFavorite(false);
          }
        }
      } else {
        setIsFavorite(false);
      }
    };
    checkFavorite();
  }, [isAuth, token, prodata?.id]);

  // Добавление/удаление из избранного
  const handleToggleFavorite = async () => {
    console.log('handleToggleFavorite called, isAuth:', isAuth, 'prodata.id:', prodata?.id, 'isFavorite:', isFavorite);
    
    if (!isAuth) {
      toast({
        title: "Войдите в аккаунт",
        description: "Для добавления в избранное необходимо войти",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      nav("/login");
      return;
    }

    if (!prodata?.id) {
      toast({
        title: "Ошибка",
        description: "Данные товара недоступны",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Получаем токен из разных источников
    const authToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!authToken) {
      toast({
        title: "Ошибка авторизации",
        description: "Токен не найден. Пожалуйста, войдите снова",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      nav("/login");
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Удаляем из избранного
        await axios.delete(`${BASE_URL1}/favorites/${prodata.id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setIsFavorite(false);
        toast({
          title: "Удалено",
          description: "Товар удален из избранного",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // Добавляем в избранное
        try {
          await axios.post(`${BASE_URL1}/favorites/`, 
            { product_id: prodata.id },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          setIsFavorite(true);
          toast({
            title: "Добавлено",
            description: "Товар добавлен в избранное",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } catch (addError) {
          // Если ошибка 400, товар уже в избранном
          if (addError.response?.status === 400) {
            const errorMessage = addError.response?.data?.detail || "";
            const isAlreadyFavorite = errorMessage.includes("already in favorites") || 
                                      errorMessage.includes("уже в избранном") || 
                                      errorMessage.toLowerCase().includes("already");
            
            if (isAlreadyFavorite) {
              // Товар уже в избранном - синхронизируем состояние
              try {
                const checkResponse = await axios.get(`${BASE_URL1}/favorites/check/${prodata.id}`, {
                  headers: { Authorization: `Bearer ${authToken}` }
                });
                setIsFavorite(checkResponse.data.is_favorite || true);
                toast({
                  title: "Уже в избранном",
                  description: "Товар уже находится в избранном",
                  status: "info",
                  duration: 2000,
                  isClosable: true,
                });
              } catch (checkError) {
                // Если проверка не удалась, просто устанавливаем как избранное
                setIsFavorite(true);
              }
            } else {
              throw addError; // Пробрасываем ошибку дальше
            }
          } else {
            throw addError; // Пробрасываем ошибку дальше
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Обработка различных типов ошибок
      if (error.response?.status === 401) {
        toast({
          title: "Сессия истекла",
          description: "Пожалуйста, войдите в аккаунт снова",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        nav("/login");
      } else if (error.response?.status === 404) {
        toast({
          title: "Товар не найден",
          description: "Товар был удален или не существует",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorMessage = error.response?.data?.detail || error.message || "Не удалось изменить избранное";
        toast({
          title: "Ошибка",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!prodata || !prodata.id) {
      toast({
        title: "Ошибка",
        description: "Данные товара недоступны.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    // Проверяем, что выбран размер
    if (!value) {
      toast({
        title: "Выберите размер",
        description: "Пожалуйста, выберите размер товара перед добавлением в корзину.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    // Проверяем авторизацию
    if (!isAuth || !token) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы добавить товар в корзину.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      nav("/login");
      return;
    }
    
    setCartLoading(true);
    
    // Получаем выбранный вариант (цвет)
    const selectedVariant = prodata.variants && prodata.variants.length > 0 
      ? prodata.variants[selectedColor] || prodata.variants[0]
      : null;
    
    // Подготавливаем данные товара для корзины
    const cartItemData = {
      ...prodata,
      _id: prodata.id || prodata._id,
      pid: prodata.id || prodata._id,
      quantity: 1,
      sizes: value,
      selectedSize: value,
      selectedVariant: selectedVariant,
      variantId: selectedVariant?.id || null,
      colorName: selectedVariant?.color_name || null,
      price: selectedVariant?.price || prodata.price || 0,
    };
    
    // Удаляем лишние поля, которые могут вызвать проблемы
    delete cartItemData.variants; // Не отправляем все варианты
    delete cartItemData.category; // Не отправляем объект категории
    
    const cartItem = [cartItemData];

    try {
      // Формируем заголовок Authorization с префиксом "Bearer " если его нет
      const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      const res = await axios({
        method: "post",
        url: `${BASE_URL1}/cart/add`,
        data: { items: cartItem },
        headers: {
          Authorization: authHeader,
        },
      });

      if (res.data.status === 1) {
        dispatch({ type: CART_UPDATE });
        setPresent(true);
        openCart(); // Открываем корзину после добавления товара
        toast({
          title: "Товар добавлен в корзину",
          description: "Товар успешно добавлен в вашу корзину",
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to Add",
          description: res.data.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      setCartLoading(false);
      if (err.response?.status === 401) {
        toast({
          title: "Требуется авторизация",
          description: "Пожалуйста, войдите в систему, чтобы добавить товар в корзину.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        nav("/login");
      } else {
        toast({
          title: "Ошибка",
          description: err.response?.data?.detail || err.response?.data?.message || "Не удалось добавить товар в корзину",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Box mt={{ base: "100px", md: "120px" }} paddingX={{ base: "20px", md: "40px" }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Skeleton height="600px" />
          <Skeleton height="600px" />
        </SimpleGrid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        mt={{ base: "100px", md: "120px" }} 
        paddingX={{ base: "20px", md: "40px" }} 
        textAlign="center"
        minHeight="calc(100vh - 200px)"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading 
          fontSize={{ base: "20px", md: "24px" }}
          fontWeight="400"
          letterSpacing="0.5px"
          mb="20px"
        >
          {error}
        </Heading>
        <Text 
          fontSize={{ base: "14px", md: "16px" }}
          color="gray.600"
          mb="30px"
        >
          Товар не найден или был удален
        </Text>
      </Box>
    );
  }

  return (
      <Box
        mt={{ base: "70px", sm: "75px", md: "80px", lg: "85px" }}
        paddingX={{ base: "15px", sm: "20px", md: "30px", lg: "40px", xl: "60px" }}
        paddingY={{ base: "20px", sm: "25px", md: "30px" }}
        backgroundColor="white"
        width="100%"
        maxWidth="100%"
        overflowX="hidden"
      >
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "20px", sm: "25px", md: "30px", lg: "50px", xl: "60px" }}
          alignItems={{ base: "stretch", lg: "flex-start" }}
          width="100%"
        >
        {/* Images Section - Left Side */}
          <Box
            width={{ base: "100%", lg: "55%" }}
            display="flex"
            flexDirection={{ base: "column", lg: "row" }}
            gap={{ base: "15px", sm: "20px", lg: "20px" }}
            flexShrink={0}
          >
          {/* Thumbnails - Left Side (Vertical) */}
          <VStack
            spacing="10px"
            display={{ base: "none", lg: "flex" }}
            width="80px"
            flexShrink={0}
          >
            {arrayData.length > 0 ? (
              arrayData.slice(0, 5).map((el, index) => {
                const imageUrl = el?.imageURL || prodata?.imageURL;
                return (
              <Box
                key={el?._id || prodata?._id || index}
                width="80px"
                height="80px"
                cursor="pointer"
                border={selectedImageIndex === index ? "2px solid black" : "1px solid #e5e5e5"}
                padding="2px"
                _hover={{ borderColor: "black" }}
                transition="all 0.2s"
                onClick={() => setSelectedImageIndex(index)}
                overflow="hidden"
                backgroundColor="#f5f5f5"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
              >
                    {imageUrl && imageUrl.trim() !== '' ? (
                <Image
                        src={imageUrl}
                  alt={`${prodata?.productName || 'Product'} ${index + 1}`}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                    ) : (
                      <Text fontSize="10px" color="gray.400" textAlign="center" px="5px">
                        Нет изображения
                      </Text>
                    )}
              </Box>
                );
              })
            ) : (
              <Box
                width="80px"
                height="80px"
                border="1px solid #e5e5e5"
                padding="2px"
                overflow="hidden"
                backgroundColor="#f5f5f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="10px" color="gray.400" textAlign="center" px="5px">
                  Нет изображения
                </Text>
              </Box>
            )}
          </VStack>

          {/* Main Image - Right Side with Carousel */}
          <Box
            flex="1"
            position="relative"
            backgroundColor="#f5f5f5"
            overflow="visible"
            width="100%"
            sx={{
              '.control-dots': {
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
                boxShadow: 'none',
              },
              '.control-dots .dot': {
                width: '30px',
                height: '2px',
                borderRadius: '0',
                backgroundColor: 'white',
                border: 'none',
                opacity: 1,
                margin: '0 4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'none',
              },
              '.control-dots .dot.selected': {
                backgroundColor: 'black',
                border: 'none',
                width: '40px',
                height: '2px',
                boxShadow: 'none',
              },
              '.control-dots .dot:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                boxShadow: 'none',
              },
              // Hide scrollbar for carousel and prevent text selection
              '& .carousel-root': {
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              },
              '& .carousel': {
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              },
              '& .slider-wrapper': {
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              },
              '& .slider': {
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              },
              '& *': {
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent',
              },
            }}
          >
            <Box position="relative" width="100%">
              <Carousel
                selectedItem={selectedImageIndex}
                onChange={setSelectedImageIndex}
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                showArrows={true}
                infiniteLoop={true}
                emulateTouch={true}
                swipeable={true}
                useKeyboardArrows={true}
                autoPlay={false}
                transitionTime={300}
                renderArrowPrev={(onClickHandler, hasPrev, label) => {
                  if (!hasPrev) return null;
                  return (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      aria-label={label}
                      style={{
                        position: 'absolute',
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: '300',
                        color: 'black',
                        boxShadow: 'none',
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      ‹
                    </button>
                  );
                }}
                renderArrowNext={(onClickHandler, hasNext, label) => {
                  if (!hasNext) return null;
                  return (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      aria-label={label}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: '300',
                        color: 'black',
                        boxShadow: 'none',
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      ›
                    </button>
                  );
                }}
              >
                {arrayData.length > 0 ? (
                  arrayData.slice(0, 5).map((el, index) => {
                    const imageUrl = el?.imageURL || prodata?.imageURL;
                    return (
                  <div key={el?._id || prodata?._id || index}>
                        {imageUrl && imageUrl.trim() !== '' ? (
                    <Box
                      as="img"
                            src={imageUrl}
                      alt={`${prodata?.productName || 'Product'} ${index + 1}`}
                      width="100%"
                      height={{ base: "280px", sm: "350px", md: "500px", lg: "650px", xl: "700px" }}
                      objectFit="cover"
                      display="block"
                    />
                        ) : (
                          <Box
                            width="100%"
                            height={{ base: "280px", sm: "350px", md: "500px", lg: "650px", xl: "700px" }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor="#f5f5f5"
                          >
                            <Text fontSize="16px" color="gray.500" textAlign="center">
                              Нет изображения
                            </Text>
                          </Box>
                        )}
                  </div>
                    );
                  })
                ) : (
                  <div>
                    <Box
                      width="100%"
                      height={{ base: "280px", sm: "350px", md: "500px", lg: "650px", xl: "700px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                      backgroundColor="#f5f5f5"
              >
                      <Text fontSize="16px" color="gray.500" textAlign="center">
                        Нет изображения
                      </Text>
              </Box>
                  </div>
                )}
              </Carousel>
            </Box>
          </Box>

          {/* Mobile Thumbnails - Horizontal Scroll */}
          <Box
            display={{ base: "flex", lg: "none" }}
            gap="10px"
            overflowX="auto"
            width="100%"
            paddingBottom="10px"
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {arrayData.length > 0 ? (
              arrayData.slice(0, 5).map((el, index) => {
                const imageUrl = el?.imageURL || prodata?.imageURL;
                return (
              <Box
                key={el?._id || prodata?._id || index}
                minWidth={{ base: "60px", sm: "80px" }}
                width={{ base: "60px", sm: "80px" }}
                height={{ base: "60px", sm: "80px" }}
                cursor="pointer"
                border={selectedImageIndex === index ? "2px solid black" : "1px solid #e5e5e5"}
                padding="2px"
                _hover={{ borderColor: "black" }}
                transition="all 0.2s"
                onClick={() => setSelectedImageIndex(index)}
                overflow="hidden"
                backgroundColor="#f5f5f5"
                flexShrink={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
              >
                    {imageUrl && imageUrl.trim() !== '' ? (
                <Image
                        src={imageUrl}
                  alt={`${prodata?.productName || 'Product'} ${index + 1}`}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                    ) : (
                      <Text fontSize="9px" color="gray.400" textAlign="center" px="3px">
                        Нет изображения
                      </Text>
                    )}
              </Box>
                );
              })
            ) : (
              <Box
                minWidth={{ base: "60px", sm: "80px" }}
                width={{ base: "60px", sm: "80px" }}
                height={{ base: "60px", sm: "80px" }}
                border="1px solid #e5e5e5"
                padding="2px"
                overflow="hidden"
                backgroundColor="#f5f5f5"
                flexShrink={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="9px" color="gray.400" textAlign="center" px="3px">
                  Нет изображения
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Product Info Section - Right Side */}
          <Box
            width={{ base: "100%", lg: "45%" }}
            maxWidth={{ base: "100%", lg: "500px" }}
            paddingTop={{ base: "0px", lg: "20px" }}
            position="relative"
            flexShrink={0}
          >
          {/* Heart icon in top right - Working favorite button */}
          <Box
            position="absolute"
            top="0"
            right="0"
            cursor="pointer"
            onClick={handleToggleFavorite}
            _hover={{ opacity: 0.7 }}
            transition="opacity 0.2s"
            opacity={favoriteLoading ? 0.5 : 1}
            zIndex={10}
          >
            {isFavorite ? (
              <AiFillHeart size={24} color="#000000" />
            ) : (
              <AiOutlineHeart size={24} color="#000000" />
            )}
          </Box>

          <VStack spacing={{ base: "15px", sm: "20px", md: "23px", lg: "25px" }} alignItems="flex-start" width="100%">
            {/* Product Name - Left aligned */}
            <Box width="100%">
              <Text
                fontSize={{ base: "16px", sm: "18px", md: "20px", lg: "22px" }}
                fontWeight="400"
                textTransform="uppercase"
                letterSpacing="0.5px"
                lineHeight="1.4"
                textAlign="left"
              >
                {prodata?.productName || 'Product Name'}
          </Text>
            </Box>

            {/* Price - Left aligned, in UZS */}
            <Box width="100%">
              <Text fontSize={{ base: "18px", sm: "20px", md: "22px", lg: "24px" }} fontWeight="500" textAlign="left">
                {prodata?.price ? parseFloat(prodata.price).toLocaleString('ru-RU') : '0'} UZS
              </Text>
            </Box>

            {/* Color Selection - Show only first variant */}
            {colorVariants.length > 0 && (
              <Box width="100%">
                <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="500" mb={{ base: "10px", md: "12px" }} letterSpacing="0.5px" textAlign="left">
                  ЦВЕТ: {colorVariants[0]?.name?.toUpperCase() || 'N/A'}
                </Text>
                <Box
                  border="1px solid #e5e5e5"
                        padding="2px"
                        backgroundColor="#f5f5f5"
                  display="inline-block"
                      >
                        <Image
                    src={colorVariants[0].image || (colorVariants[0].variant?.images?.[0]?.image_url || '') || 'https://via.placeholder.com/60'}
                    alt={colorVariants[0].name}
                    width={{ base: "50px", sm: "55px", md: "60px" }}
                    height={{ base: "50px", sm: "55px", md: "60px" }}
                          objectFit="cover"
                        />
                      </Box>
              </Box>
            )}


            <Divider borderColor="#e5e5e5" />

            {/* Size Selection - Simplified */}
            <Box width="100%">
              <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="500" mb={{ base: "12px", md: "15px" }} letterSpacing="0.5px" textAlign="left">
                РАЗМЕР
          </Text>
                <HStack spacing={{ base: "8px", md: "10px" }} flexWrap="wrap">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <Button
                  key={size}
                    minWidth={{ base: "40px", sm: "45px", md: "50px" }}
                    height={{ base: "40px", sm: "45px", md: "50px" }}
                    fontSize={{ base: "11px", sm: "12px", md: "13px" }}
                      borderRadius="0"
                      bg={value === size ? "black" : "white"}
                      color={value === size ? "white" : "black"}
                      border="1px solid black"
                    padding="0"
                      _hover={{
                        bg: value === size ? "black" : "#f5f5f5",
                      }}
                      transition="all 0.2s"
                    onClick={() => setValue(size)}
                >
                      {size}
                </Button>
              ))}
                </HStack>
          </Box>

            <Divider borderColor="#e5e5e5" />

            {/* Add to Bag Button */}
          <Button
            onClick={() => {
              if (isAuth) {
                if (!present) {
                  handleAdd();
                } else {
                  openCart(); // Открываем корзину вместо навигации на /cart
                }
              } else {
                toast({
                  title: "Требуется вход",
                  description: "Пожалуйста, войдите в систему, чтобы добавить товар в корзину.",
                  status: "warning",
                  duration: 2000,
                  position: "top",
                  isClosable: true,
                });
                nav("/login");
              }
            }}
            width="100%"
            fontSize={{ base: "10px", md: "11px", lg: "12px" }}
            borderRadius="0"
            bg="black"
            color="white"
            paddingY={{ base: "18px", md: "20px", lg: "22px" }}
            isLoading={cartLoading}
            loadingText="Добавление..."
            _hover={{ 
              backgroundColor: "#333",
              transform: "translateY(-2px)",
              transition: "all 0.2s"
            }}
            _active={{
              transform: "translateY(0)",
            }}
            letterSpacing="1px"
            textTransform="uppercase"
            fontWeight="400"
            transition="all 0.2s"
            fontFamily="'Manrope', sans-serif"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="8px"
          >
            {present ? (
              <>
                <FiShoppingBag size={14} />
                Перейти в корзину
              </>
            ) : (
              <>
                <FiPlus size={14} />
                Добавить в корзину
              </>
            )}
          </Button>

            {/* Accordion Sections */}
            <Accordion allowToggle defaultIndex={[0]} width="100%">
              {/* Description Section */}
              <AccordionItem key="description" border="none" borderTop="1px solid #e5e5e5" borderBottom="1px solid #e5e5e5">
                <AccordionButton
                  paddingY={{ base: "12px", md: "15px" }}
                  paddingX="0"
                  _hover={{ backgroundColor: "transparent" }}
                  _expanded={{ backgroundColor: "transparent" }}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="500" letterSpacing="0.5px">
                      Описание
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel paddingX="0" paddingY={{ base: "12px", md: "15px" }} paddingBottom={{ base: "15px", md: "20px" }}>
                  <VStack spacing={{ base: "10px", md: "12px" }} alignItems="flex-start">
                    {prodata.description_title && (
                      <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="600" textAlign="left">
                        {prodata.description_title}
                      </Text>
                    )}
                    {prodata.material && (
                      <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                        Материал: {prodata.material}
                      </Text>
                    )}
                    {prodata.branding && (
                      <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                        Брендинг: {prodata.branding}
                      </Text>
                    )}
                    {prodata.packaging && (
                      <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                        Упаковка: {prodata.packaging}
                      </Text>
                    )}
                    {!prodata.description_title && !prodata.material && !prodata.branding && !prodata.packaging && (
                      <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                        {prodata.description || "Описание товара отсутствует"}
                      </Text>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              {/* Size Guide Section */}
              <AccordionItem key="size-guide" border="none" borderBottom="1px solid #e5e5e5">
                <AccordionButton
                  paddingY={{ base: "12px", md: "15px" }}
                  paddingX="0"
                  _hover={{ backgroundColor: "transparent" }}
                  _expanded={{ backgroundColor: "transparent" }}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="500" letterSpacing="0.5px">
                      Гид по размерам
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel paddingX="0" paddingY={{ base: "12px", md: "15px" }} paddingBottom={{ base: "15px", md: "20px" }}>
                  <VStack spacing={{ base: "8px", md: "10px" }} alignItems="flex-start">
                    {prodata.size_guide ? (
                      <Text 
                        fontSize={{ base: "10px", md: "11px" }} 
                        color="#666" 
                        lineHeight="1.6" 
                        textAlign="left"
                        whiteSpace="pre-line"
                      >
                        {prodata.size_guide}
                      </Text>
                    ) : (
                      <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                        Размерная сетка поможет вам выбрать правильный размер. Обратите внимание, что размеры могут отличаться в зависимости от модели.
                      </Text>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              {/* Delivery and Return Section */}
              <AccordionItem key="delivery-return" border="none" borderBottom="1px solid #e5e5e5">
                <AccordionButton
                  paddingY={{ base: "12px", md: "15px" }}
                  paddingX="0"
                  _hover={{ backgroundColor: "transparent" }}
                  _expanded={{ backgroundColor: "transparent" }}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="500" letterSpacing="0.5px">
                      Доставка и возврат
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel paddingX="0" paddingY={{ base: "12px", md: "15px" }} paddingBottom={{ base: "15px", md: "20px" }}>
                  <VStack spacing={{ base: "10px", md: "12px" }} alignItems="flex-start">
                    {prodata.delivery_info && (
                      <>
                        <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="500" textAlign="left">
                          ДОСТАВКА
                        </Text>
                        <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                          {prodata.delivery_info}
                        </Text>
                      </>
                    )}
                    {prodata.return_info && (
                      <>
                        <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="500" textAlign="left" mt={{ base: "8px", md: "10px" }}>
                          ВОЗВРАТ
                        </Text>
                        <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                          {prodata.return_info}
                        </Text>
                      </>
                    )}
                    {prodata.exchange_info && (
                      <>
                        <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="500" textAlign="left" mt={{ base: "8px", md: "10px" }}>
                          ОБМЕН
                        </Text>
                        <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                          {prodata.exchange_info}
                        </Text>
                      </>
                    )}
                    {!prodata.delivery_info && !prodata.return_info && !prodata.exchange_info && (
                      <>
                        <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="500" textAlign="left">
                          ДОСТАВКА
                        </Text>
                        <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                          Бесплатная стандартная доставка при заказе на сумму свыше 500,000 UZS. Доставка обычно занимает 3-5 рабочих дней.
                        </Text>
                        <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="500" textAlign="left" mt={{ base: "8px", md: "10px" }}>
                          ВОЗВРАТ
                        </Text>
                        <Text fontSize={{ base: "10px", md: "11px" }} color="#666" lineHeight="1.6" textAlign="left">
                          Вы можете вернуть товар в течение 30 дней с момента покупки. Товар должен быть в оригинальной упаковке и не использованным.
                        </Text>
                      </>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        </Box>
      </Flex>

      {/* Similar Products Section */}
      <Box 
        mt={{ base: "60px", md: "100px" }} 
        width="100%" 
        position="relative" 
        overflow="visible"
      >
        <Heading
          fontSize={{ base: "18px", md: "22px", lg: "24px" }}
          fontWeight="400"
          textAlign="center"
          letterSpacing="0.5px"
          mb={{ base: "30px", md: "40px" }}
        >
          Похожие товары
        </Heading>

        <Box 
          position="relative" 
          width="100%" 
          overflow="visible"
        >
          {/* Left Arrow */}
          <Box
            as="button"
            position="absolute"
            left={{ base: "10px", lg: "-50px" }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={30}
            backgroundColor="transparent"
            border="none"
            borderRadius="50%"
            width="40px"
            height="40px"
            minWidth="40px"
            padding="0"
            display={{ base: "none", lg: "flex" }}
            alignItems="center"
            justifyContent="center"
            fontSize="28px"
            fontWeight="300"
            color="black"
            cursor="pointer"
            boxShadow="none"
            _hover={{ opacity: 0.7 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const container = similarProductsScrollRef.current;
              if (container) {
                const firstChild = container.firstElementChild;
                if (firstChild) {
                  const cardWidth = firstChild.offsetWidth;
                  const gap = 30;
                  const scrollAmount = cardWidth + gap;
                  const newScrollLeft = container.scrollLeft - scrollAmount;
                  container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                }
              }
            }}
            _active={{ opacity: 0.5 }}
            type="button"
            aria-label="Scroll left"
          >
            ‹
          </Box>

          {/* Right Arrow */}
          <Box
            as="button"
            position="absolute"
            right={{ base: "10px", lg: "-50px" }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={30}
            backgroundColor="transparent"
            border="none"
            borderRadius="50%"
            width="40px"
            height="40px"
            minWidth="40px"
            padding="0"
            display={{ base: "none", lg: "flex" }}
            alignItems="center"
            justifyContent="center"
            fontSize="28px"
            fontWeight="300"
            color="black"
            cursor="pointer"
            boxShadow="none"
            _hover={{ opacity: 0.7 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const container = similarProductsScrollRef.current;
              if (container) {
                const firstChild = container.firstElementChild;
                if (firstChild) {
                  const cardWidth = firstChild.offsetWidth;
                  const gap = 30;
                  const scrollAmount = cardWidth + gap;
                  const newScrollLeft = container.scrollLeft + scrollAmount;
                  container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                }
              }
            }}
            _active={{ opacity: 0.5 }}
            type="button"
            aria-label="Scroll right"
          >
            ›
          </Box>

          <Box
            ref={similarProductsScrollRef}
            id="similar-products-scroll"
            display="flex"
            gap={{ base: "15px", md: "20px", lg: "30px" }}
            overflowX="auto"
            overflowY="hidden"
            width="100%"
            paddingX="0"
            position="relative"
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {similarProducts.length > 0 ? similarProducts.map((product, index) => (
              <Box
                key={product.id || product._id || `similar-${index}`}
                minWidth={{ base: "280px", sm: "280px", md: "300px", lg: "280px" }}
                width={{ base: "280px", sm: "280px", md: "300px", lg: "280px" }}
                flexShrink={0}
              >
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                  <Stack
                    backgroundColor="white"
                    cursor="pointer"
                    _hover={{
                      transform: "translateY(-5px)",
                      transition: "transform 0.3s ease",
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                  >
                    <Box position="relative" overflow="hidden" backgroundColor="white">
                      <Image
                        src={product.imageURL}
                        alt={product.productName}
                        width="100%"
                        height={{ base: "300px", md: "400px" }}
                        objectFit="cover"
                      />
                    </Box>
                    <Stack p={3} spacing="6px" textAlign="left">
                      <Text
                        fontSize={{ base: "11px", md: "12px" }}
                        fontWeight="400"
                        textTransform="uppercase"
                        letterSpacing="0.3px"
                        noOfLines={2}
                        lineHeight="1.3"
                        textAlign="left"
                      >
                        {product.productName}
                      </Text>
                      <Flex alignItems="center" justifyContent="space-between" mt="2px">
                        <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="500" textAlign="left">
                          {parseInt(product.price || 0).toLocaleString('ru-RU')} UZS
                        </Text>
                        <Flex alignItems="center" gap="12px">
                          <Box 
                            cursor="pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Handle add to cart
                            }}
                            _hover={{ opacity: 0.7 }}
                          >
                            <FiPlus size={16} strokeWidth={1} color="#000000" />
                          </Box>
                          <Box 
                            cursor="pointer" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            _hover={{ opacity: 0.7 }}
                          >
                            <AiOutlineHeart size={14} />
                          </Box>
                        </Flex>
                      </Flex>
                    </Stack>
                  </Stack>
                </Link>
              </Box>
            )) : (
              <Text>Нет похожих товаров</Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleProduct;
