import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Image,
  useToast,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { FiEdit2, FiShoppingBag, FiCreditCard, FiDollarSign, FiLogIn } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL1 } from "../../constants/config";
import Loading from "../../Components/Loading/Loading";
import { CART_UPDATE } from "../../Redux/cart.redux/cartTypes";

const Payment = ({ cart, cartTotal, totalSavings, token, email }) => {
  const [value, setValue] = useState("cash");
  const [textArea, setTextArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymeLoading, setPaymeLoading] = useState(false);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const { name, address, city, pincode, phone, state, isAuth } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const handleCashPayment = async () => {
    if (name === "" || address === "" || pincode === "" || phone === "" || city === "" || state === "") {
      toast({
        description: "Заполните все поля",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    let newCartData = cart?.map((el) => {
      el.address = `${name}, ${address},${city}, ${pincode}, ${phone},${state}`;
      el.totalDiscountPrice = 0;
      el.paymentMethod = "cash";
      delete el["_id"];
      return el;
    });

    try {
      const authHeader = token && token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      let res = await axios.post(BASE_URL1 + "/order/add", newCartData, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (res.data.status === 1) {
        setLoading(false);
        dispatch({ type: CART_UPDATE });

        toast({
          title: "Заказ успешно оформлен",
          description: "Спасибо за покупку!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        // Переходим в профиль на страницу заказов
        setTimeout(() => {
          navigate("/profile#orders");
        }, 1000);
      } else {
        setLoading(false);
        toast({
          title: "Ошибка заказа",
          description: "Не удалось оформить заказ. Попробуйте позже.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Ошибка заказа",
        description: "Не удалось оформить заказ. Попробуйте позже.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (value === "payme") {
      toast({
        title: "В разработке",
        description: "Оплата через Payme временно недоступна. Пожалуйста, выберите другой способ оплаты.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    } else {
      await handleCashPayment();
    }
  };

  const handlePaymePayment = async () => {
    if (name === "" || address === "" || pincode === "" || phone === "" || city === "" || state === "") {
      toast({
        description: "Заполните все поля",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setPaymeLoading(true);
    
    try {
      let newCartData = cart?.map((el) => {
        el.address = `${name}, ${address},${city}, ${pincode}, ${phone},${state}`;
        el.totalDiscountPrice = 0;
        el.paymentMethod = "payme";
        delete el["_id"];
        return el;
      });

      const authHeader = token && token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      const orderRes = await axios.post(BASE_URL1 + "/order/add", newCartData, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (orderRes.data.status !== 1) {
        throw new Error("Failed to create order");
      }

      const orderId = orderRes.data.order_id || orderRes.data.id;
      const userId = orderRes.data.user_id;
      
      if (!orderId) {
        throw new Error("Order ID not received");
      }
      
      const amountInTiyin = Math.round(cartTotal * 100);
      const merchantId = process.env.REACT_APP_PAYME_MERCHANT_ID || "308712129";
      
      if (!merchantId || merchantId === "YOUR_MERCHANT_ID") {
        setPaymeLoading(false);
        toast({
          title: "Ошибка конфигурации",
          description: "Merchant ID не настроен. Пожалуйста, обратитесь к администратору.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      
      const params = new URLSearchParams();
      params.append("merchant_id", merchantId);
      params.append("amount", amountInTiyin.toString());
      params.append("account[order_id]", orderId.toString());
      
      if (userId) {
        params.append("account[user_id]", userId.toString());
      }
      
      params.append("callback_url", `${window.location.origin}/payment/callback?order_id=${orderId}`);
      
      const paymeUrl = `https://checkout.paycom.uz/?${params.toString()}`;
      window.location.href = paymeUrl;
      
    } catch (error) {
      setPaymeLoading(false);
      console.error("Payme payment error:", error);
      toast({
        title: "Ошибка оплаты",
        description: "Не удалось инициализировать платеж. Попробуйте позже.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <Box 
      width="100%"
      maxW="1200px"
      margin="0 auto"
      paddingX={{ base: "15px", md: "20px", lg: "40px" }}
      paddingY={{ base: "80px", md: "100px" }}
      fontFamily="'Manrope', sans-serif"
    >
      {/* Header */}
      <Box mb={8}>
        <Text 
          fontSize="11px" 
          fontWeight="400" 
          letterSpacing="1px" 
          textTransform="uppercase"
          color="gray.600"
          mb={2}
        >
          Home » Checkout
        </Text>
        <Heading 
          fontSize={{ base: "24px", md: "32px" }}
          fontWeight="400"
          letterSpacing="3px"
          textTransform="uppercase"
          color="black"
          fontFamily="'Manrope', sans-serif"
        >
          Оформление заказа
        </Heading>
      </Box>

      {/* Two Column Layout */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="flex-start">
        {/* Left Column - Form */}
        <VStack spacing={6} align="stretch">
          {/* Данные получателя */}
          <Box 
            p={6} 
            bg="white" 
            border="1px solid"
            borderColor="#e5e5e5"
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Text 
                fontSize="12px"
                fontWeight="400"
                letterSpacing="2px"
                textTransform="uppercase"
                fontFamily="'Manrope', sans-serif"
              >
                Данные получателя
              </Text>
              {isAuth && (
                <IconButton
                  icon={<FiEdit2 />}
                  size="sm"
                  variant="ghost"
                  aria-label="Редактировать"
                  onClick={onEditOpen}
                  _hover={{ bg: "transparent", color: "black" }}
                  _active={{ bg: "transparent" }}
                />
              )}
            </Flex>
            
            {!isAuth ? (
              <VStack spacing={4} py={8}>
                <Text
                  fontSize="13px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  color="gray.600"
                  fontFamily="'Manrope', sans-serif"
                  textAlign="center"
                >
                  Войдите в аккаунт, чтобы продолжить оформление заказа
                </Text>
                <Button
                  leftIcon={<FiLogIn />}
                  bg="black"
                  color="white"
                  borderRadius="0"
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  fontFamily="'Manrope', sans-serif"
                  px={8}
                  py={6}
                  onClick={() => navigate('/login')}
                  _hover={{ bg: "gray.800" }}
                  _active={{ bg: "gray.900" }}
                  transition="all 0.2s"
                >
                  Войти
                </Button>
              </VStack>
            ) : (
              <>
                <SimpleGrid columns={2} spacing={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={1}>
                      Имя
                    </FormLabel>
                    <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" fontFamily="'Manrope', sans-serif">
                      {name}
                    </Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={1}>
                      Телефон
                    </FormLabel>
                    <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" color="gray.700" fontFamily="'Manrope', sans-serif">
                      {phone}
                    </Text>
                  </FormControl>
                </SimpleGrid>

                <FormControl mb={4}>
                  <FormLabel fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={1}>
                    Адрес
                  </FormLabel>
                  <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" color="gray.700" fontFamily="'Manrope', sans-serif">
                    {address}
                  </Text>
                </FormControl>

                <SimpleGrid columns={3} spacing={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={1}>
                      Город
                    </FormLabel>
                    <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" color="gray.700" fontFamily="'Manrope', sans-serif">
                      {city}
                    </Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={1}>
                      Индекс
                    </FormLabel>
                    <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" color="gray.700" fontFamily="'Manrope', sans-serif">
                      {pincode}
                    </Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={1}>
                      Область
                    </FormLabel>
                    <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" color="gray.700" fontFamily="'Manrope', sans-serif">
                      {state}
                    </Text>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={2}>
                    Примечания к заказу
                  </FormLabel>
                  <Textarea
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    placeholder="Дополнительные примечания к заказу..."
                    borderRadius="0"
                    borderColor="#e5e5e5"
                    _focus={{ borderColor: "black", boxShadow: "0 0 0 1px black" }}
                    fontFamily="'Manrope', sans-serif"
                    fontSize="14px"
                    rows={3}
                  />
                </FormControl>
              </>
            )}
          </Box>
        </VStack>

        {/* Right Column - Order Summary (Sticky) */}
        <Box 
          position={{ base: "static", lg: "sticky" }}
          top={{ lg: "100px" }}
          p={6} 
          bg="white" 
          border="1px solid"
          borderColor="#e5e5e5"
          height="fit-content"
        >
          <Flex align="center" gap="10px" mb={6}>
            <FiShoppingBag size={18} />
            <Text 
              fontSize="12px"
              fontWeight="400"
              letterSpacing="2px"
              textTransform="uppercase"
              fontFamily="'Manrope', sans-serif"
            >
              Ваш заказ
            </Text>
          </Flex>

          <Accordion allowToggle mb={6}>
            <AccordionItem border="none">
              <AccordionButton p={0} _hover={{ bg: "transparent" }} _expanded={{ bg: "transparent" }}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" fontFamily="'Manrope', sans-serif">
                    {cart?.length || 0} товаров
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={0} pt={4}>
                <VStack spacing={3} align="stretch">
                  {cart?.map((product, index) => (
                    <Flex key={index} alignItems="center" gap="12px" pb={3} borderBottom="1px solid" borderColor="#e5e5e5">
                      <Box width="50px" height="65px" bg="#f5f5f5" overflow="hidden" flexShrink="0">
                        <Image 
                          src={product.imageURL || product.image} 
                          alt={product.productName || product.title} 
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      </Box>
                      <Box flex="1" minW="0">
                        <Text fontSize="12px" fontWeight="400" letterSpacing="0.5px" mb={1} fontFamily="'Manrope', sans-serif" noOfLines={2}>
                          {product.productName || product.title}
                        </Text>
                        <Text fontSize="11px" fontWeight="400" color="gray.600" letterSpacing="0.5px">
                          {product.quantity} x {product.price} сум
                        </Text>
                      </Box>
                      <Text fontSize="13px" fontWeight="400" letterSpacing="0.5px" fontFamily="'Manrope', sans-serif" whiteSpace="nowrap">
                        {(product.quantity * product.price).toLocaleString()} сум
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Divider mb={4} />

          <VStack spacing={3} align="stretch" mb={6}>
            <Flex justify="space-between" align="center">
              <Text fontSize="12px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" fontFamily="'Manrope', sans-serif">
                Подытог:
              </Text>
              <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" fontFamily="'Manrope', sans-serif">
                {cartTotal.toLocaleString()} сум
              </Text>
            </Flex>
            {totalSavings > 0 && (
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" fontFamily="'Manrope', sans-serif">
                  Экономия:
                </Text>
                <Text fontSize="14px" fontWeight="400" letterSpacing="0.5px" color="red.500" fontFamily="'Manrope', sans-serif">
                  -{totalSavings.toLocaleString()} сум
                </Text>
              </Flex>
            )}
            <Divider />
            <Flex justify="space-between" align="center" pt={2}>
              <Text fontSize="14px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" fontFamily="'Manrope', sans-serif">
                Итого:
              </Text>
              <Text fontSize="18px" fontWeight="400" letterSpacing="1px" fontFamily="'Manrope', sans-serif">
                {(cartTotal - totalSavings).toLocaleString()} сум
              </Text>
            </Flex>
          </VStack>

          <Divider mb={4} />

          {/* Способ оплаты */}
          <Box mb={6}>
            <Flex align="center" gap="10px" mb={4}>
              <FiCreditCard size={16} />
              <Text 
                fontSize="11px"
                fontWeight="400"
                letterSpacing="1px"
                textTransform="uppercase"
                fontFamily="'Manrope', sans-serif"
              >
                Способ оплаты
              </Text>
            </Flex>
            
            <VStack spacing={3} alignItems="stretch">
              <Box
                as="button"
                onClick={() => {
                  setValue("cash");
                }}
                width="100%"
                p={4}
                border="1px solid"
                borderColor={value === "cash" ? "black" : "#e5e5e5"}
                bg={value === "cash" ? "#fafafa" : "white"}
                transition="all 0.2s"
                _hover={{
                  borderColor: "black",
                  bg: "#fafafa",
                }}
                cursor="pointer"
                position="relative"
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={3}>
                    <Box
                      width="40px"
                      height="40px"
                      borderRadius="50%"
                      bg={value === "cash" ? "black" : "#f5f5f5"}
                      color={value === "cash" ? "white" : "black"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.2s"
                    >
                      <FiDollarSign size={18} />
                    </Box>
                    <Text
                      fontSize="13px"
                      fontWeight="400"
                      letterSpacing="0.5px"
                      fontFamily="'Manrope', sans-serif"
                    >
                      Наличными при получении
                    </Text>
                  </Flex>
                  <Box
                    width="20px"
                    height="20px"
                    borderRadius="50%"
                    border="2px solid"
                    borderColor={value === "cash" ? "black" : "#e5e5e5"}
                    bg={value === "cash" ? "black" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.2s"
                  >
                    {value === "cash" && (
                      <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bg="white"
                      />
                    )}
                  </Box>
                </Flex>
              </Box>
              
              <Box
                as="button"
                onClick={() => {
                  setValue("payme");
                }}
                width="100%"
                p={4}
                border="1px solid"
                borderColor={value === "payme" ? "black" : "#e5e5e5"}
                bg={value === "payme" ? "#fafafa" : "white"}
                transition="all 0.2s"
                _hover={{
                  borderColor: "black",
                  bg: "#fafafa",
                }}
                cursor="pointer"
                position="relative"
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={3}>
                    <Box
                      width="40px"
                      height="40px"
                      borderRadius="50%"
                      bg={value === "payme" ? "black" : "#f5f5f5"}
                      color={value === "payme" ? "white" : "black"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.2s"
                    >
                      <FiCreditCard size={18} />
                    </Box>
                    <Text
                      fontSize="13px"
                      fontWeight="400"
                      letterSpacing="0.5px"
                      fontFamily="'Manrope', sans-serif"
                    >
                      Payme
                    </Text>
                  </Flex>
                  <Box
                    width="20px"
                    height="20px"
                    borderRadius="50%"
                    border="2px solid"
                    borderColor={value === "payme" ? "black" : "#e5e5e5"}
                    bg={value === "payme" ? "black" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.2s"
                  >
                    {value === "payme" && (
                      <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bg="white"
                      />
                    )}
                  </Box>
                </Flex>
              </Box>
            </VStack>
          </Box>

          <Button
            width="100%"
            bg="black"
            color="white"
            borderRadius="0"
            fontSize="12px"
            fontWeight="400"
            letterSpacing="2px"
            textTransform="uppercase"
            fontFamily="'Manrope', sans-serif"
            py={6}
            _hover={{ bg: isAuth ? "gray.800" : "gray.600" }}
            _active={{ bg: isAuth ? "gray.900" : "gray.600" }}
            onClick={handleSubmit}
            isLoading={loading || paymeLoading}
            loadingText={value === "payme" ? "Перенаправление на Payme..." : "Оформление заказа..."}
            transition="all 0.2s"
            mt={6}
            disabled={!isAuth}
            opacity={!isAuth ? 0.5 : 1}
            cursor={!isAuth ? "not-allowed" : "pointer"}
          >
            Оплатить
          </Button>
        </Box>
      </SimpleGrid>
      
      {/* Модальное окно редактирования данных */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="12px" fontWeight="400" letterSpacing="2px" textTransform="uppercase" fontFamily="'Manrope', sans-serif">
            Редактировать данные получателя
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontSize="11px" fontWeight="400" letterSpacing="1px" textTransform="uppercase" color="gray.600" mb={4}>
              Для изменения данных получателя, пожалуйста, обновите информацию в профиле.
            </Text>
            <Button
              bg="black"
              color="white"
              borderRadius="0"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="1px"
              textTransform="uppercase"
              fontFamily="'Manrope', sans-serif"
              onClick={() => {
                onEditClose();
                navigate('/profile');
              }}
              _hover={{ bg: "gray.800" }}
            >
              Перейти в профиль
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Payment;
