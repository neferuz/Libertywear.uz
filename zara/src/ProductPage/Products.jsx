import {
  Box,
  Button,
  filter,
  Heading,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Flex,
  Divider,
  useToast,
  VStack,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Paginantion from "./Pagination";
import { BASE_URL,BASE_URL1 } from "../constants/config";
import { NONE } from "../constants/typography";
import { FiPlus } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const { isAuth, token } = useSelector((state) => state.authReducer);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [currentCategoryName, setCurrentCategoryName] = useState(null);

  let [productlist, setproductlist] = useState([]);
  let [fulldata,setfullData]= useState([]);
  let [isError, setisError] = useState(false);
  let [isloading, setisloading] = useState(false);
  let [griddata, setgriddata] = useState("4");
  let [count, setcount] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  let [query,setQuery]= useState("");

let [searchParam,setSearchParam] = useSearchParams()



  const search = useLocation().search;
  const catg = new URLSearchParams(search).get("itemGender");
  const categorySlug = new URLSearchParams(search).get("category");
  
useEffect(() => {
        window.scrollTo(0, 0);
      }, [page]);

  // Загрузка категорий для фильтров и получение названия текущей категории
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL1}/categories/`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Получаем подкатегории для текущего gender
          const genderCategories = res.data
            .filter(cat => cat.gender === catg)
            .flatMap(cat => cat.subcategories || [])
            .map(cat => ({
              id: cat.id,
              name: cat.title || cat.name,
              slug: cat.slug
            }));
          setCategories(genderCategories);
          
          // Если есть categorySlug в URL, находим название категории
          if (categorySlug) {
            const decodedSlug = decodeURIComponent(categorySlug);
            const foundCategory = genderCategories.find(cat => 
              cat.slug === decodedSlug || cat.slug === categorySlug
            );
            if (foundCategory) {
              setCurrentCategoryName(foundCategory.name);
            } else {
              // Если не нашли, форматируем slug
              const formatted = decodedSlug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              setCurrentCategoryName(formatted);
            }
          } else {
            setCurrentCategoryName(null);
        }
      }
      } catch (err) {
        console.error("Error fetching categories:", err);
  }
    };
    if (catg) {
      fetchCategories();
    }
  }, [catg, categorySlug]);



  // Функция для применения фильтров
  const applyFilters = (data) => {
    if (!data || data.length === 0) {
      setproductlist([]);
      return;
    }
    
    let filtered = [...data];
    
    // Фильтр по поиску (только если есть запрос)
    if (query && query.trim()) {
      const searchQuery = query.trim().toUpperCase();
      filtered = filtered.filter(item => {
        const productName = (item.productName || item.name || '').toUpperCase();
        return productName.includes(searchQuery);
      });
    }
    
    // Фильтр по цене (только если диапазон изменен)
    if (priceRange[0] > 0 || priceRange[1] < 10000000) {
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }
    
    // Если нет фильтров, показываем все товары
    setproductlist(filtered);
  };

//search box.....
const handleInputChange = (event) => {
  setQuery(event.target.value);
}

let getdata = async (page) => {
  try {
    setisloading(true);
    setisError(false); // Reset error state
    
    // Формируем параметры запроса
    let url = `${BASE_URL1}/cloths?itemGender=${catg}&page=${page}`;
    
    // Добавляем фильтр по категории из URL если есть (приоритет URL)
    if (categorySlug) {
      // Декодируем categorySlug для использования в URL
      try {
        const decodedSlug = decodeURIComponent(categorySlug);
        url += `&itemCategory=${encodeURIComponent(decodedSlug)}`;
      } catch (e) {
        // Если декодирование не удалось, используем как есть
        url += `&itemCategory=${categorySlug}`;
      }
    } else if (selectedCategories.length > 0) {
      // Если нет категории в URL, используем выбранные в фильтре
      url += `&itemCategory=${selectedCategories[0]}`;
    }
    
    let res = await axios.get(url);
    
    // Преобразуем данные из новой структуры бэкенда в формат, ожидаемый фронтендом
    const transformedData = (res.data.data || []).map(product => {
      // Берем первый вариант для отображения (или создаем дефолтный)
      const firstVariant = product.variants && product.variants.length > 0 
        ? product.variants[0] 
        : null;
      
      // Собираем все изображения из всех вариантов
      const allImages = [];
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.images && variant.images.length > 0) {
            variant.images.forEach(img => {
              if (img.image_url) allImages.push(img.image_url);
            });
          }
          if (variant.color_image) {
            allImages.push(variant.color_image);
          }
        });
      }
      
      return {
        _id: product.id, // Преобразуем id в _id для совместимости
        id: product.id,
        productName: product.name,
        name: product.name,
        price: firstVariant ? firstVariant.price : 0,
        imageURL: allImages.length > 0 ? allImages.join(',') : '',
        description: product.description,
        variants: product.variants || []
      };
    });
    
    // Сохраняем все данные в fulldata
    setfullData(transformedData);
    setTotalPage(res.data.count);
    
    // Применяем фильтры сразу после загрузки
    applyFilters(transformedData);
  } catch (err) {
    setisError(true);
    console.error("Error fetching products:", err);
  } finally {
    setisloading(false);
  }
};


  useEffect(() => {
    setPage(0); // Сбрасываем страницу при изменении фильтров
    getdata(0);
  }, [selectedCategories, categorySlug, catg]);

  useEffect(() => {
    getdata(page);
  }, [page]);

  // Применяем фильтры по цене и поиску к уже загруженным данным
  useEffect(() => {
    if (fulldata.length > 0) {
      applyFilters(fulldata);
    } else {
      setproductlist([]);
    }
  }, [priceRange, query, fulldata]);

  useEffect(() => {}, [griddata]);



  let handleHigh = () => {
    setcount(count + 1);
    let highdata = productlist.sort((a, b) => {
      return Number(b.price) - Number(a.price);
    });

    setproductlist(highdata);
  };

  let handleLow = () => {
    setcount(count + 1);
    let lowdata = productlist.sort((a, b) => {
      return Number(a.price) - Number(b.price);
    });

    setproductlist(lowdata);
  };




  // Загрузка избранного при монтировании
  useEffect(() => {
    if (isAuth && token) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`${BASE_URL1}/favorites/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFavorites(response.data.map(fav => fav.product_id));
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };
      fetchFavorites();
    }
  }, [isAuth, token]);

  // Проверка, в избранном ли товар
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  // Добавление/удаление из избранного
  const handleToggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuth) {
      toast({
        title: "Войдите в аккаунт",
        description: "Для добавления в избранное необходимо войти",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFavoritesLoading(prev => ({ ...prev, [productId]: true }));

    try {
      if (isFavorite(productId)) {
        // Удаляем из избранного
        await axios.delete(`${BASE_URL1}/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== productId));
        toast({
          title: "Удалено",
          description: "Товар удален из избранного",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // Добавляем в избранное
        await axios.post(`${BASE_URL1}/favorites/`, 
          { product_id: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites([...favorites, productId]);
        toast({
          title: "Добавлено",
          description: "Товар добавлен в избранное",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить избранное",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setFavoritesLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Function to format category name
  const getCategoryName = () => {
    // Если есть загруженное название категории, используем его
    if (currentCategoryName) {
      return currentCategoryName;
    }
    
    // Если есть slug категории, декодируем и форматируем его
    if (categorySlug) {
      try {
      const decoded = decodeURIComponent(categorySlug);
      // Заменяем дефисы на пробелы и делаем первую букву заглавной
      return decoded
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      } catch (e) {
        // Если декодирование не удалось, используем как есть
        return categorySlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    // Если нет категории, но есть gender - показываем "Все товары"
    if (catg) {
      return "Все товары";
    }
    return "Все товары";
  };

  if (isloading) {
    return (
      <Box mt={{ base: "80px", sm: "100px", md: "120px" }} paddingX={{ base: "10px", sm: "15px", md: "40px", lg: "60px" }}>
        <SimpleGrid
          columns={{ base: 2, sm: 2, md: 2, lg: 3 }}
          gap={{ base: "15px", sm: "20px", md: "25px", lg: "30px" }}
          width="100%"
        >
          {[...Array(9)].map((_, i) => (
            <Stack key={i}>
              <Skeleton height={{ base: "300px", md: "400px" }} />
              <Skeleton height="60px" mt={3} />
            </Stack>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  return (
    <Box 
      mt={{ base: "80px", md: "100px" }} 
      paddingX={{ base: "20px", md: "40px", lg: "60px" }}
      backgroundColor="white"
      minHeight="calc(100vh - 100px)"
    >
      {isError !== "" && <h1>{isError}</h1>}

      {/* Category Title */}
      <Heading
        fontSize={{ base: "20px", md: "24px", lg: "28px" }}
        fontWeight="400"
        textAlign="center"
        letterSpacing="1px"
        textTransform="uppercase"
        mb={{ base: "40px", md: "50px" }}
        color="black"
      >
        {getCategoryName()}
      </Heading>
        
      <Box>
        {/* Sort and Filter Controls - показываем только если есть товары */}
        {productlist.length > 0 && (
          <>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: "15px", md: "20px" }}
              mb={{ base: "30px", md: "40px" }}
              justifyContent="space-between"
              alignItems={{ base: "flex-start", md: "center" }}
            >
              <HStack gap={{ base: "10px", md: "15px" }} flexWrap="wrap">
                <Button 
                  onClick={handleHigh}
                  variant="outline"
                  size="sm"
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  borderRadius="0"
                  borderColor="black"
                  _hover={{ backgroundColor: "black", color: "white" }}
                >
                  По убыванию
                </Button>
                <Button 
                  onClick={handleLow}
                  variant="outline"
                  size="sm"
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  borderRadius="0"
                  borderColor="black"
                  _hover={{ backgroundColor: "black", color: "white" }}
                >
                  По возрастанию
                </Button>
                <Button 
                  onClick={onOpen}
                  variant="outline"
                  size="sm"
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  borderRadius="0"
                  borderColor="black"
                  _hover={{ backgroundColor: "black", color: "white" }}
                  leftIcon={<FiFilter />}
                  display={{ base: "flex", md: "flex" }}
                >
                  Фильтры
                  {selectedCategories.length > 0 && (
                    <Badge ml={2} colorScheme="black" borderRadius="full" px={2}>
                      {selectedCategories.length}
                    </Badge>
                  )}
                </Button>

                {/* Search Icon - встроен в панель управления */}
                <Box
                  as="button"
                  onClick={onSearchOpen}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="36px"
                  height="36px"
                  backgroundColor="transparent"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    opacity: 0.7,
                  }}
                  sx={{
                    '& svg': {
                      color: 'black',
                      transition: 'color 0.3s ease',
                    },
                    '&:hover svg': {
                      color: 'black',
                    }
                  }}
                >
                  <FiSearch size={18} />
                </Box>
              </HStack>

              <HStack gap={4} display={{ base: NONE, lg: "flex" }}>
                <Text fontSize="12px" fontWeight="400" letterSpacing="0.5px">Показать</Text>
                <Button 
                  onClick={() => setgriddata(2)}
                  variant="outline"
                  size="sm"
                  fontSize="12px"
                  borderRadius="0"
                  borderColor="black"
                  backgroundColor={griddata === "2" ? "black" : "transparent"}
                  color={griddata === "2" ? "white" : "black"}
                  _hover={{ backgroundColor: "black", color: "white" }}
                >
                  2
                </Button>
                <Button 
                  onClick={() => setgriddata(3)}
                  variant="outline"
                  size="sm"
                  fontSize="12px"
                  borderRadius="0"
                  borderColor="black"
                  backgroundColor={griddata === "3" ? "black" : "transparent"}
                  color={griddata === "3" ? "white" : "black"}
                  _hover={{ backgroundColor: "black", color: "white" }}
                >
                  3
                </Button>
                <Button 
                  onClick={() => setgriddata(4)}
                  variant="outline"
                  size="sm"
                  fontSize="12px"
                  borderRadius="0"
                  borderColor="black"
                  backgroundColor={griddata === "4" ? "black" : "transparent"}
                  color={griddata === "4" ? "white" : "black"}
                  _hover={{ backgroundColor: "black", color: "white" }}
                >
                  4
                </Button>
              </HStack>
            </Flex>

            {/* Search Input - появляется под панелью управления */}
            {isSearchOpen && (
              <Box
                mb={{ base: "30px", md: "40px" }}
                animation="slideDown 0.3s ease"
                sx={{
                  '@keyframes slideDown': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(-10px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Flex align="center" gap="10px" maxW="600px" mx="auto">
              <Input 
                    flex="1"
                type="text" 
                value={query} 
                onChange={handleInputChange} 
                placeholder="Поиск товаров..."
                borderRadius="0"
                borderColor="black"
                borderBottom="1px solid"
                borderTop="none"
                borderLeft="none"
                borderRight="none"
                _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                fontSize={{ base: "14px", md: "16px" }}
                    autoFocus
                  />
                  <Box
                    as="button"
                    onClick={() => {
                      onSearchClose();
                      setQuery("");
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="32px"
                    height="32px"
                    backgroundColor="transparent"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _hover={{
                      opacity: 0.7,
                    }}
                    sx={{
                      '& svg': {
                        color: 'black',
                        transition: 'color 0.3s ease',
                      },
                      '&:hover svg': {
                        color: 'black',
                      }
                    }}
                  >
                    <FiX size={16} />
                  </Box>
                </Flex>
            </Box>
            )}
          </>
        )}

        {/* Empty State */}
        {productlist.length === 0 && !isloading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight={{ base: "300px", md: "400px" }}
            textAlign="center"
            py={{ base: "60px", md: "80px" }}
          >
            <Text
              fontSize={{ base: "18px", md: "24px", lg: "28px" }}
              fontWeight="400"
              letterSpacing="1px"
              color="black"
              fontFamily="'Manrope', sans-serif"
              mb="10px"
            >
              Товаров нет
            </Text>
            <Text
              fontSize={{ base: "12px", md: "14px" }}
              fontWeight="300"
              letterSpacing="0.5px"
              color="gray.600"
              fontFamily="'Manrope', sans-serif"
              maxW="400px"
            >
              В данной категории пока нет товаров
            </Text>
          </Box>
        )}

        {/* Products Grid */}
        {productlist.length > 0 && (
          <SimpleGrid
            columns={
              griddata !== ""
                ? { base: 2, sm: 2, md: 3, lg: griddata }
                : { base: 2, sm: 2, md: 3, lg: 3 }
            }
            gap={{ base: "15px", sm: "20px", md: "25px", lg: "30px" }}
            width="100%"
            mb={{ base: "40px", md: "60px" }}
          >
            {productlist.map((el, index) => {
            const images = el.imageURL?.split(",").filter(img => img && img.trim()) || [];
            const firstImage = images[0] || '';
            const secondImage = images[1] || images[0] || '';
            const hasMultipleImages = images.length > 1;

            // Используем уникальный key
            const uniqueKey = el.id || el._id || `product-${index}`;

            return (
              <Link 
                key={uniqueKey} 
                to={`/products/${el.id || el._id}`} 
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Box
                  cursor="pointer"
                  backgroundColor="white"
                  padding="10px"
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "all 0.3s ease",
                  }}
                  transition="all 0.3s ease"
                >
                  <Box
                    overflow="hidden"
                    marginBottom="20px"
                    backgroundColor="#f5f5f5"
                    position="relative"
                    height={{ base: "320px", md: "420px" }}
                    borderRadius="2px"
                  >
                    <Box
                      position="relative"
                      width="100%"
                      height="100%"
                      sx={{
                        '& .image-main': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 1,
                          transition: 'opacity 0.5s ease-in-out',
                        },
                        '& .image-hover': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          transition: 'opacity 0.5s ease-in-out',
                        },
                        '&:hover .image-main': {
                          opacity: hasMultipleImages ? 0 : 1,
                        },
                        '&:hover .image-hover': {
                          opacity: hasMultipleImages ? 1 : 0,
                        },
                      }}
                    >
                      {firstImage ? (
                        <Image 
                          className="image-main"
                          src={firstImage} 
                          alt={el.productName || el.name || 'Товар'}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          _hover={{
                            transform: "scale(1.05)",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      ) : (
                        <Box 
                          width="100%" 
                          height="100%" 
                          backgroundColor="#f5f5f5"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="14px" color="gray.400">Нет изображения</Text>
                        </Box>
                      )}
                      {hasMultipleImages && secondImage && (
                        <Image 
                          className="image-hover"
                          src={secondImage} 
                          alt={el.productName || el.name || 'Товар'}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          _hover={{
                            transform: "scale(1.05)",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Stack spacing="10px">
                    <Text
                      fontSize={{ base: "15px", md: "17px" }}
                      fontWeight="400"
                      letterSpacing="0.5px"
                      noOfLines={2}
                      color="black"
                      minHeight="48px"
                    >
                      {el.productName?.charAt(0).toUpperCase() + el.productName?.slice(1) || "Товар"}
                    </Text>
                    <Flex alignItems="center" justifyContent="space-between" pt="5px">
                      <Text 
                        fontSize={{ base: "17px", md: "19px" }} 
                        fontWeight="500"
                        letterSpacing="0.5px"
                        color="black"
                      >
                        {parseInt(el.price || 0).toLocaleString('ru-RU')} UZS
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
                          transition="opacity 0.2s"
                        >
                          <FiPlus size={18} strokeWidth={1} color="#000000" />
                        </Box>
                        <Box 
                          cursor="pointer"
                          onClick={(e) => handleToggleFavorite(e, el._id || el.id)}
                          _hover={{ opacity: 0.7 }}
                          transition="opacity 0.2s"
                          opacity={favoritesLoading[el._id || el.id] ? 0.5 : 1}
                        >
                          {isFavorite(el._id || el.id) ? (
                            <AiFillHeart size={20} color="#000000" />
                          ) : (
                            <AiOutlineHeart size={20} color="#000000" />
                          )}
                        </Box>
                      </Flex>
                    </Flex>
                  </Stack>
                </Box>
              </Link>
            );
          })}
          </SimpleGrid>
        )}

        {/* Pagination - показываем только если есть товары */}
        {productlist.length > 0 && (
          <Paginantion
            page={page}
            setPage={setPage}
            divide={10}
            totalPage={totalPage}
          />
        )}
      </Box>

      {/* Bottom Divider */}
      <Box mt={{ base: "60px", md: "80px" }} mb={{ base: "40px", md: "60px" }}>
        <Divider 
          borderColor="black" 
          borderWidth="1px"
          opacity={0.2}
        />
      </Box>

      {/* Фильтры Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            fontSize="16px"
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            borderBottom="1px solid #e5e5e5"
            pb="15px"
          >
            Фильтры
          </DrawerHeader>

          <DrawerBody pt="30px">
            <VStack spacing="30px" align="stretch">
              {/* Фильтр по категориям */}
              {categories.length > 0 && (
                <Box>
                  <Text
                    fontSize="13px"
                    fontWeight="500"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    mb="15px"
                    color="gray.700"
                  >
                    Категории
                  </Text>
                  <CheckboxGroup
                    value={selectedCategories}
                    onChange={(values) => setSelectedCategories(values)}
                  >
                    <VStack align="stretch" spacing="12px">
                      {categories.map((category) => (
                        <Checkbox
                          key={category.id}
                          value={category.slug}
                          fontSize="14px"
                          fontWeight="400"
                          colorScheme="black"
                        >
                          {category.name}
                        </Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </Box>
              )}

              {/* Фильтр по цене */}
              <Box>
                <Text
                  fontSize="13px"
                  fontWeight="500"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="15px"
                  color="gray.700"
                >
                  Цена
                </Text>
                <VStack spacing="15px" align="stretch">
                  <RangeSlider
                    aria-label={['min', 'max']}
                    value={priceRange}
                    onChange={(val) => setPriceRange(val)}
                    min={0}
                    max={10000000}
                    step={10000}
                    colorScheme="black"
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                  <Flex justify="space-between" fontSize="12px" color="gray.600">
                    <Text>{priceRange[0].toLocaleString('ru-RU')} UZS</Text>
                    <Text>{priceRange[1].toLocaleString('ru-RU')} UZS</Text>
                  </Flex>
                </VStack>
              </Box>

              {/* Кнопка сброса фильтров */}
              {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000000) && (
                <Button
                  variant="outline"
                  size="sm"
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  borderRadius="0"
                  borderColor="black"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 10000000]);
                  }}
                  leftIcon={<FiX />}
                  _hover={{ backgroundColor: "black", color: "white" }}
                >
                  Сбросить фильтры
                </Button>
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTop="1px solid #e5e5e5">
            <Button
              w="100%"
              bg="black"
              color="white"
              borderRadius="0"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              _hover={{ backgroundColor: "#333" }}
              onClick={onClose}
            >
              Применить
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default ProductPage;