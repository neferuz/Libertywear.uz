import { Input, Box, Text, Flex, VStack, SimpleGrid, Stack, Heading, Button, Image, HStack, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL1 } from "../constants/config";
import SearchItem from "./SearchItem";
import {
  ABSOLUTE,
  AUTO,
  COLUMN,
  FILL_PARENT,
  POINTER,
  RELATIVE,
  WHITE,
} from "../constants/typography";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";

const Serachbar = () => {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [display, setDisplay] = useState(false);
  const [selectedText, setSelectedText] = useState("WOMAN");
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { isAuth, token } = useSelector((state) => state.authReducer);
  const toast = useToast();

  useEffect(() => {
    if (query) {
      setSearch(query);
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      let res = await axios({
        method: "get",
        url: BASE_URL1 + `/search?q=${searchQuery}&page=0`,
      });
      if (res.data.status === 1) {
        // Преобразуем данные из новой структуры бэкенда
        const transformedData = (res.data.data || []).map(product => {
          const firstVariant = product.variants && product.variants.length > 0 
            ? product.variants[0] 
            : null;
          
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
            _id: product.id || product._id,
            id: product.id || product._id,
            productName: product.name || product.productName,
            name: product.name || product.productName,
            price: firstVariant ? firstVariant.price : (product.price || 0),
            imageURL: allImages.length > 0 ? allImages.join(',') : (product.imageURL || ''),
            description: product.description,
            variants: product.variants || []
          };
        });
        setSearchResults(transformedData);
        setTotalResults(res.data.count || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL1}/cloths?page=0&limit=8`);
        if (res.data.data) {
          // Преобразуем данные из новой структуры бэкенда в формат, ожидаемый фронтендом
          const transformedData = res.data.data.slice(0, 8).map(product => {
            // Берем первый вариант для отображения
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
              _id: product.id,
              id: product.id,
              productName: product.name,
              name: product.name,
              price: firstVariant ? firstVariant.price : 0,
              imageURL: allImages.length > 0 ? allImages.join(',') : '',
              description: product.description,
              variants: product.variants || []
            };
          });
          setRecommendedProducts(transformedData);
        }
      } catch (err) {
        console.error("Error fetching recommended products:", err);
      }
    };
    fetchRecommendedProducts();
  }, []);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      setDisplay(false);
      setSearchData([]);
      nav(`/search?q=${search}`);
      fetchSearchResults(search);
    }
  };

  useEffect(() => {
    if (search === "") {
      setDisplay(false);
      setSearchData([]);
    }
    let getRecomandation = async () => {
      let res = await axios({
        method: "get",
        url: BASE_URL1 + `/search?q=${search}&page=${0}`,
      });

      if (res.data.status === 1) {
        setSearchData(res.data.data);
      }
    };
    const timeoutId = setTimeout(() => {
      if (search !== "" && !query) {
        getRecomandation();
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, query]);

  const handleClick = (text) => {
    setSelectedText(text);
  };

  const handleAddToCart = async (product) => {
    if (!isAuth) {
      toast({
        title: "Требуется регистрация",
        description: "Пожалуйста, войдите в систему, чтобы добавить товар в корзину.",
        status: "warning",
        duration: 3000,
        position: "top",
        isClosable: true,
        borderRadius: "0",
        containerStyle: {
          fontFamily: "'Manrope', sans-serif",
        },
      });
      nav("/login");
      return;
    }
    // Add to cart logic here
  };

  return (
    <>
      <Box mt={{ base: "100px", md: "120px" }} paddingX={{ base: "20px", md: "40px", lg: "60px" }}>
        {/* Search Input Section */}
        <Box mb={{ base: "30px", md: "50px" }}>
          <Box width="150px" margin="auto" mb="20px">
            <Flex justify="space-between">
              <Text
                fontSize="xs"
                onClick={() => handleClick("WOMAN")}
                fontWeight={selectedText === "WOMAN" ? "500" : "400"}
                cursor={POINTER}
              >
                WOMAN
              </Text>
              <Text
                fontSize="xs"
                onClick={() => handleClick("MAN")}
                fontWeight={selectedText === "MAN" ? "500" : "400"}
                cursor={POINTER}
              >
                MAN
              </Text>
              <Text
                fontSize="xs"
                onClick={() => handleClick("KIDS")}
                fontWeight={selectedText === "KIDS" ? "500" : "400"}
                cursor={POINTER}
              >
                KIDS
              </Text>
            </Flex>
          </Box>

          <Box ml="2em" mr=".5em" borderBottom="1px" borderColor="black" pb=".4em" position={RELATIVE}>
            <VStack position={RELATIVE} w={FILL_PARENT}>
              <Input
                variant="unstyled"
                onKeyDown={handleKeyDown}
                placeholder="Что вы ищете?"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDisplay(true);
                }}
                fontSize={{ base: "16px", md: "18px" }}
              />
              <Flex
                overflowY="scroll"
                direction={COLUMN}
                        justifyContent="center"
                bg={WHITE}
                zIndex={500}
                display={display ? "block" : "none"}
                position={ABSOLUTE}
                top={10}
                w={FILL_PARENT}
                borderRadius={8}
                maxH={500}
                boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
              >
                {searchData?.map((el) => (
                  <SearchItem key={el._id} setDisplay={setDisplay} {...el} />
                ))}
              </Flex>
            </VStack>
          </Box>
        </Box>

        {/* Search Results */}
        {query && (
          <Box mb={{ base: "40px", md: "60px" }}>
            {loading ? (
              <Box textAlign="center" py="40px">
                <Text color="gray.500" fontSize="14px">Поиск...</Text>
              </Box>
            ) : searchResults.length > 0 ? (
              <>
                <Heading
                  fontSize={{ base: "18px", md: "22px" }}
                  fontWeight="400"
                  mb={{ base: "20px", md: "30px" }}
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                >
                  Найдено товаров: {totalResults}
                </Heading>
            <SimpleGrid
              columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
              spacing={{ base: "15px", md: "25px" }}
            >
              {searchResults.map((product) => {
                const imageUrl = product.imageURL?.split(",")[0] || product.imageURL || '';
                return (
                  <Link key={product._id || product.id} to={`/products/${product._id || product.id}`}>
                    <Stack
                      backgroundColor="white"
                      cursor={POINTER}
                      _hover={{
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease",
                      }}
                      transition="all 0.3s ease"
                      position="relative"
                      borderRadius="0"
                    >
                      <Box 
                        position="relative" 
                        overflow="hidden" 
                        backgroundColor="#f5f5f5"
                        aspectRatio="3/4"
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.productName || product.name}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                        ) : (
                          <Box
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="#f5f5f5"
                          >
                            <Text fontSize="12px" color="gray.400">Нет изображения</Text>
                          </Box>
                        )}
                      </Box>
                      <Stack p={{ base: 3, md: 4 }} spacing="8px">
                        <Flex justifyContent="space-between" alignItems="flex-start" gap="10px">
                          <Text
                            fontSize={{ base: "12px", md: "14px" }}
                            fontWeight="400"
                            textTransform="uppercase"
                            flex="1"
                            noOfLines={2}
                            lineHeight="1.3"
                            letterSpacing="0.3px"
                          >
                            {product.productName || product.name}
                          </Text>
                          <Flex alignItems="center" gap="8px" flexShrink={0}>
                            <Box 
                              cursor={POINTER}
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                              _hover={{ opacity: 0.7 }}
                            >
                              <FiPlus size={16} strokeWidth={1} color="#000000" />
                            </Box>
                            <Box cursor={POINTER} _hover={{ opacity: 0.7 }}>
                              <AiOutlineHeart size={18} />
                            </Box>
                          </Flex>
                        </Flex>
                        <Text 
                          fontSize={{ base: "13px", md: "15px" }} 
                          fontWeight="500"
                        >
                          {parseInt(product.price || 0).toLocaleString('ru-RU')} UZS
                        </Text>
                      </Stack>
                    </Stack>
                  </Link>
                );
              })}
            </SimpleGrid>
              </>
            ) : (
              <Box textAlign="center" py="60px">
                <Text fontSize="16px" color="gray.600" mb="10px">
                  По запросу "{query}" ничего не найдено
                </Text>
                <Text fontSize="14px" color="gray.500">
                  Попробуйте изменить поисковый запрос
                </Text>
              </Box>
            )}
          </Box>
        )}

        {/* Recommended Products Section - Always show */}
        <Box mt={{ base: "60px", md: "100px" }} mb={{ base: "40px", md: "60px" }}>
          <Heading
            fontSize={{ base: "14px", md: "16px", lg: "18px" }}
            fontWeight="400"
            textAlign="left"
            mb={{ base: "25px", md: "35px" }}
            letterSpacing="0.5px"
            textTransform="none"
          >
            Вам также может понравиться
          </Heading>

          {recommendedProducts.length > 0 ? (
            <SimpleGrid
              columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
              spacing={{ base: "15px", md: "25px" }}
              width="100%"
            >
              {recommendedProducts.map((product) => {
                const imageUrl = product.imageURL?.split(",")[0] || product.imageURL || '';
                return (
                  <Link key={product._id || product.id} to={`/products/${product._id || product.id}`}>
                    <Stack
                      backgroundColor="white"
                      cursor={POINTER}
                      _hover={{
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease",
                      }}
                      transition="all 0.3s ease"
                      position="relative"
                      borderRadius="0"
                    >
                      <Box 
                        position="relative" 
                        overflow="hidden" 
                        backgroundColor="#f5f5f5"
                        aspectRatio="3/4"
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.productName || product.name}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                        ) : (
                          <Box
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="#f5f5f5"
                          >
                            <Text fontSize="12px" color="gray.400">Нет изображения</Text>
                          </Box>
                        )}
                      </Box>
                      <Stack p={{ base: 3, md: 4 }} spacing="8px">
                        <Flex justifyContent="space-between" alignItems="flex-start" gap="10px">
                          <Text
                            fontSize={{ base: "12px", md: "14px" }}
                            fontWeight="400"
                            textTransform="uppercase"
                            letterSpacing="0.3px"
                            noOfLines={2}
                            lineHeight="1.3"
                            flex="1"
                          >
                            {product.productName || product.name}
                          </Text>
                          <Flex alignItems="center" gap="8px" flexShrink={0}>
                            <Box 
                              cursor={POINTER}
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                              _hover={{ opacity: 0.7 }}
                            >
                              <FiPlus size={16} strokeWidth={1} color="#000000" />
                            </Box>
                            <Box 
                              cursor={POINTER}
                              onClick={(e) => {
                                e.preventDefault();
                                // Handle bookmark
                              }}
                              _hover={{ opacity: 0.7 }}
                            >
                              <AiOutlineHeart size={18} />
                            </Box>
                          </Flex>
                        </Flex>
                        <Text 
                          fontSize={{ base: "13px", md: "15px" }} 
                          fontWeight="500"
                        >
                          {parseInt(product.price || 0).toLocaleString('ru-RU')} UZS
                        </Text>
                      </Stack>
                    </Stack>
                  </Link>
                );
              })}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py="40px">
              <Text color="gray.500" fontSize="14px">Загрузка товаров...</Text>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Serachbar;
