import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import Payment from '../ProductPage/Checkout/Payment';
import axios from 'axios';
import { BASE_URL1 } from '../constants/config';
import Loading from '../Components/Loading/Loading';

const Checkout = () => {
  const { token, email } = useSelector((state) => state.authReducer);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
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
          
          const total = transformedCart.reduce((acc, el) => {
            return acc + (el.price || 0) * (el.quantity || 0);
          }, 0);
          setCartTotal(total);
          setTotalSavings(0);
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

    if (token) {
      fetchCart();
    } else {
      setLoading(false);
      // Не редиректим, показываем кнопку "Войти" на странице
    }
  }, [token, navigate]);

  if (loading) return <Loading />;

  // Если пользователь не авторизован, показываем страницу с кнопкой "Войти"
  if (!token) {
    return (
      <Box
        minHeight="calc(100vh - 100px)"
        paddingX="0"
        paddingY="0"
      >
        <Payment
          cart={[]}
          cartTotal={0}
          token={null}
          email={null}
          totalSavings={0}
        />
      </Box>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <Box
        minHeight="calc(100vh - 100px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingX={{ base: "20px", md: "40px" }}
        paddingY={{ base: "100px", md: "120px" }}
      >
        <VStack spacing={4}>
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
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      minHeight="calc(100vh - 100px)"
      paddingX="0"
      paddingY="0"
    >
      <Payment
        cart={cart}
        cartTotal={cartTotal}
        token={token}
        email={email}
        totalSavings={totalSavings}
      />
    </Box>
  );
};

export default Checkout;

