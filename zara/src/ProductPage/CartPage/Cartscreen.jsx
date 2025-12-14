import React, { useEffect, useState } from "react";
import "./Cartscreen.css";
import CartPage from "./CartPage";
import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Text,
  Toast,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, BASE_URL1 } from "../../constants/config";
import  Loading  from "../../Components/Loading/Loading";
import { RUPEES_SYMBOL } from "../../constants/constants";
import {
  AUTO,
  FILL_PARENT,
  GREEN,
  LINE_THROUGH,
  ORANGE,
  RED,
  UNDERLINE,
} from "../../constants/typography";
import getFutureDate from "./futureDate";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Payment from "../Checkout/Payment";
import { Link, useNavigate } from "react-router-dom";
import { CART_UPDATE } from "../../Redux/cart.redux/cartTypes";
import { useCart } from "../../Context/CartContext";
import CartDrawer from "../../Components/CartDrawer";

const Cartscreen = () => {
  const { token, email } = useSelector((state) => state.authReducer);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refesh, setRefresh] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [totalSavings, setTotalSaving] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { openCart, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();
  
  // Автоматически открываем drawer при переходе на /cart
  useEffect(() => {
    openCart();
  }, [openCart]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let getCartData = async () => {
      setLoading(true);
      try {
        let res = await axios({
          method: "get",
          url: BASE_URL1 + `/cart`,
          headers: {
            Authorization: token,
          },
        });

        if (res.data.status == 1 && res.data.items) {
          // Преобразуем данные из API в формат, который ожидает фронтенд
          const transformedCart = res.data.items.map((item) => {
            // Получаем изображение из ответа API или из варианта/продукта
            const imageURL = item.image_url || 
                           item.variant?.images?.[0]?.image_url || 
                           item.variant?.color_image || 
                           item.product?.image || 
                           '';
            
            return {
              _id: item.id,
              id: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
              productName: item.product?.name || 'Product',
              imageURL: imageURL,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              strikedPrice: item.price, // Если есть скидка, можно добавить отдельное поле
            };
          });
          setCart(transformedCart);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCart([]);
      } finally {
        setLoading(false);
        dispatch({type:CART_UPDATE});
      }
    };

    if (token) {
      getCartData();
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [refesh, token, dispatch]);

  

  useEffect(() => {
    if (!cart || cart.length === 0) {
      setCartTotal(0);
      setTotalSaving(0);
      return;
    }

    let total = cart.reduce((acc, el) => {
      return acc + (el.price || 0) * (el.quantity || 0);
    }, 0);

    setCartTotal(total);

    let totalsavings = cart.reduce((acc, el) => {
      return acc + (el.strikedPrice || el.price || 0) * (el.quantity || 0);
    }, 0);

    setTotalSaving(Math.max(0, totalsavings - total));
  }, [cart]);

  // Обработчик закрытия drawer - не редиректим, просто закрываем
  const handleDrawerClose = () => {
    closeCart();
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Полная страница корзины с товарами */}
      <VStack w={FILL_PARENT} bg="white">
        <div style={{ marginTop: "100px" }} className="cartscreen">
          <div className="cartscreen_left">
            <Text 
              mb={50} 
              fontSize={{ base: "24px", md: "32px" }}
              fontWeight="400"
              letterSpacing="3px"
              textTransform="uppercase"
              fontFamily="'Manrope', sans-serif"
            >
              Корзина
            </Text>
            {cart && cart.length > 0 ? (
              cart.map((el) => <CartPage key={el._id || el.id} setRefresh={setRefresh} {...el} />)
            ) : (
              <VStack spacing={6}>
                <Image
                  w={"300px"}
                  m={AUTO}
                  src={
                    "https://img.freepik.com/free-vector/shopping-cart-realistic_1284-6011.jpg?w=740&t=st=1677333680~exp=1677334280~hmac=e654070bc4ba550586903ee7739ffd1597315f1e89338b7d1730be4f788a5900"
                  }
                />
                <Heading
                  fontSize={{ base: "18px", md: "24px" }}
                  fontWeight="400"
                  letterSpacing="1px"
                  textTransform="uppercase"
                  fontFamily="'Manrope', sans-serif"
                  textAlign="center"
                >
                  Ваша корзина пуста!{" "}
                  <Link 
                    to={"/"}
                    style={{ 
                      color: "black",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px"
                    }}
                  >
                    Продолжить покупки
                  </Link>
                </Heading>
              </VStack>
            )}
          </div>
          <div className="cartscreen_right">
            <div
              style={{ display: cart?.length > 0 ? "block" : "none" }}
              className="cartscreen_info"
            >
              <VStack spacing={3} align="stretch">
                <HStack gap={2} justify="space-between">
                  <Text
                    fontSize="12px"
                    fontWeight="400"
                    letterSpacing="1px"
                    textTransform="uppercase"
                    fontFamily="'Manrope', sans-serif"
                  >
                    Подытог ({cart && cart.length ? cart.length : 0} товаров)
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                    fontFamily="'Manrope', sans-serif"
                    color="black"
                  >
                    {cartTotal.toLocaleString()} сум
                  </Text>
                </HStack>
                {totalSavings > 0 && (
                  <HStack gap={2} justify="space-between">
                    <Text
                      fontSize="12px"
                      fontWeight="400"
                      letterSpacing="1px"
                      textTransform="uppercase"
                      fontFamily="'Manrope', sans-serif"
                    >
                      Экономия
                    </Text>
                    <Text
                      fontSize="14px"
                      fontWeight="400"
                      letterSpacing="0.5px"
                      fontFamily="'Manrope', sans-serif"
                      color="red.500"
                    >
                      -{totalSavings.toLocaleString()} сум
                    </Text>
                  </HStack>
                )}
                <HStack gap={2} justify="space-between">
                  <Text
                    fontSize="11px"
                    fontWeight="400"
                    letterSpacing="1px"
                    textTransform="uppercase"
                    fontFamily="'Manrope', sans-serif"
                    color="gray.600"
                  >
                    Доставка
                  </Text>
                  <Text
                    fontSize="12px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                    fontFamily="'Manrope', sans-serif"
                    color="green.500"
                  >
                    {getFutureDate(Date.now(), 3)}
                  </Text>
                </HStack>
              </VStack>

              <Button
                onClick={onOpen}
                width="100%"
                mt={6}
                bg="black"
                color="white"
                borderRadius="0"
                fontSize="12px"
                fontWeight="400"
                letterSpacing="2px"
                textTransform="uppercase"
                fontFamily="'Manrope', sans-serif"
                _hover={{
                  bg: "gray.800",
                }}
                _active={{
                  bg: "gray.900",
                }}
                transition="all 0.2s"
              >
                Оформить заказ
              </Button>

              <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader
                    fontSize="14px"
                    fontWeight="400"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    fontFamily="'Manrope', sans-serif"
                  >
                    Оформление заказа
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Payment
                      cart={cart}
                      cartTotal={cartTotal}
                      token={token}
                      email={email}
                      totalSavings={totalSavings}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      bg="black"
                      color="white"
                      borderRadius="0"
                      fontSize="12px"
                      fontWeight="400"
                      letterSpacing="1px"
                      textTransform="uppercase"
                      fontFamily="'Manrope', sans-serif"
                      _hover={{
                        bg: "gray.800",
                      }}
                      onClick={onClose}
                    >
                      Отмена
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>

        <Box h={100} w={FILL_PARENT}></Box>
      </VStack>

      {/* Модальное окно корзины - открывается автоматически */}
      <CartDrawer isOpen={isCartOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default Cartscreen;