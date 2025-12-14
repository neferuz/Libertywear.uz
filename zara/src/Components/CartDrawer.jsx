import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  VStack,
  HStack,
  Image,
  Button,
  Flex,
  Divider,
  IconButton,
  Select,
  useToast,
} from '@chakra-ui/react';
import { FiTrash2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL1 } from '../constants/config';
import { CART_UPDATE } from '../Redux/cart.redux/cartTypes';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const { token, isAuth } = useSelector((state) => state.authReducer);
  const { cartStatus } = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && isAuth) {
      fetchCart();
    }
  }, [isOpen, isAuth, cartStatus, token]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const authHeader = token && token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const res = await axios({
        method: "get",
        url: BASE_URL1 + `/cart`,
        headers: {
          Authorization: authHeader,
        },
      });

      if (res.data.status == 1 && res.data.items) {
        const transformedCart = res.data.items.map((item) => {
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
          };
        });
        setCart(transformedCart);
        
        // Calculate total
        const total = transformedCart.reduce((acc, el) => {
          return acc + (el.price || 0) * (el.quantity || 0);
        }, 0);
        setCartTotal(total);
      } else {
        setCart([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const authHeader = token && token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const res = await axios.patch(
        BASE_URL1 + `/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      if (res.data.status === 1) {
        dispatch({ type: CART_UPDATE });
        fetchCart();
        toast({
          title: 'Количество обновлено',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить количество',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const authHeader = token && token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const res = await axios.delete(BASE_URL1 + `/cart/${itemId}`, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (res.data.status === 1) {
        dispatch({ type: CART_UPDATE });
        fetchCart();
        toast({
          title: 'Товар удален',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton
          fontSize="14px"
          _hover={{ bg: "transparent", opacity: 0.7 }}
          _active={{ bg: "transparent" }}
        />
        <DrawerHeader
          borderBottom="1px solid"
          borderColor="#e5e5e5"
          pb="20px"
          pt="40px"
        >
          <Text
            fontSize="14px"
            fontWeight="400"
            letterSpacing="2px"
            textTransform="uppercase"
            fontFamily="'Manrope', sans-serif"
          >
            Корзина
          </Text>
        </DrawerHeader>

        <DrawerBody p="0" overflowY="auto">
          {loading ? (
            <Box p="40px" textAlign="center">
              <Text fontSize="12px" letterSpacing="1px" textTransform="uppercase">
                Загрузка...
              </Text>
            </Box>
          ) : cart && cart.length > 0 ? (
            <VStack spacing="0" align="stretch">
              {cart.map((item) => (
                <Box
                  key={item._id || item.id}
                  p="20px"
                  borderBottom="1px solid"
                  borderColor="#e5e5e5"
                  _hover={{ bg: "#fafafa" }}
                  transition="background 0.2s"
                >
                  <Flex gap="15px" align="flex-start">
                    {/* Image */}
                    <Box
                      width="80px"
                      height="100px"
                      flexShrink="0"
                      bg="#f5f5f5"
                      overflow="hidden"
                      position="relative"
                    >
                      <Image
                        src={item.imageURL || '/placeholder.jpg'}
                        alt={item.productName}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    </Box>

                    {/* Product Info */}
                    <VStack align="flex-start" flex="1" spacing="8px">
                      <Text
                        fontSize="12px"
                        fontWeight="400"
                        letterSpacing="0.5px"
                        lineHeight="1.4"
                        fontFamily="'Manrope', sans-serif"
                      >
                        {item.productName}
                      </Text>
                      
                      {item.size && (
                        <Text
                          fontSize="11px"
                          fontWeight="400"
                          color="gray.600"
                          letterSpacing="0.5px"
                        >
                          Размер: {item.size}
                        </Text>
                      )}

                      <HStack justify="space-between" width="100%" mt="10px">
                        <Text
                          fontSize="13px"
                          fontWeight="400"
                          letterSpacing="0.5px"
                          fontFamily="'Manrope', sans-serif"
                        >
                          {item.price} сум
                        </Text>
                        
                        <HStack spacing="10px" align="center">
                          <Select
                            value={item.quantity || 1}
                            onChange={(e) => handleQuantityChange(item._id || item.id, parseInt(e.target.value))}
                            size="sm"
                            width="60px"
                            borderRadius="0"
                            borderColor="#e5e5e5"
                            fontSize="12px"
                            _focus={{
                              borderColor: "black",
                              boxShadow: "0 0 0 1px black",
                            }}
                            sx={{
                              '& option': {
                                fontFamily: "'Manrope', sans-serif",
                              }
                            }}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </Select>

                          <IconButton
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item._id || item.id)}
                            _hover={{ bg: "transparent", color: "red.500" }}
                            _active={{ bg: "transparent" }}
                            aria-label="Удалить товар"
                          />
                        </HStack>
                      </HStack>
                    </VStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          ) : (
            <Box p="40px" textAlign="center">
              <Text
                fontSize="12px"
                fontWeight="400"
                letterSpacing="1px"
                textTransform="uppercase"
                color="gray.600"
                fontFamily="'Manrope', sans-serif"
              >
                Корзина пуста
              </Text>
            </Box>
          )}
        </DrawerBody>

        {cart && cart.length > 0 && (
          <DrawerFooter
            borderTop="1px solid"
            borderColor="#e5e5e5"
            flexDirection="column"
            gap="20px"
            pt="25px"
            pb="30px"
          >
            <HStack justify="space-between" width="100%">
              <Text
                fontSize="12px"
                fontWeight="400"
                letterSpacing="1px"
                textTransform="uppercase"
                fontFamily="'Manrope', sans-serif"
              >
                Итого:
              </Text>
              <Text
                fontSize="16px"
                fontWeight="400"
                letterSpacing="1px"
                fontFamily="'Manrope', sans-serif"
              >
                {cartTotal} сум
              </Text>
            </HStack>

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
              _hover={{
                bg: "gray.800",
              }}
              _active={{
                bg: "gray.900",
              }}
              onClick={handleCheckout}
              transition="all 0.2s"
            >
              Оформить заказ
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;

