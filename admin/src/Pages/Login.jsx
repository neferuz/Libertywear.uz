import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    
    const result = login(email, password);
    
    setLoading(false);
    
    if (result.success) {
      toast({
        title: 'Успешно',
        description: 'Вы успешно вошли в систему',
        status: 'success',
        duration: 2000,
      });
      navigate('/');
    } else {
      toast({
        title: 'Ошибка',
        description: result.error || 'Неверный email или пароль',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      direction="column"
      align="center"
      justify="center"
      bg="#fafafa"
      px={{ base: "20px", md: "0" }}
      pb="80px"
      position="relative"
    >
      <Box
        bg="white"
        borderRadius="20px"
        border="1px solid"
        borderColor="#e5e5e5"
        p={{ base: "30px", md: "50px" }}
        w={{ base: "100%", sm: "400px", md: "450px" }}
        boxShadow="sm"
      >
        <VStack spacing="30px" align="stretch">
          <Box textAlign="center">
            <Heading
              fontSize={{ base: "24px", md: "32px" }}
              fontWeight="400"
              letterSpacing="1px"
              textTransform="uppercase"
              mb="10px"
            >
              Вход в админ-панель
            </Heading>
            <Text fontSize="14px" color="gray.600">
              Введите ваши учетные данные
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing="20px" align="stretch">
              <FormControl isRequired>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="8px"
                >
                  Email
                </FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  borderRadius="20px"
                  borderColor="#e5e5e5"
                  _focus={{ borderColor: "black", boxShadow: "none" }}
                  fontSize="14px"
                  py="12px"
                  px="20px"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel
                  fontSize="12px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  mb="8px"
                >
                  Пароль
                </FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  borderRadius="20px"
                  borderColor="#e5e5e5"
                  _focus={{ borderColor: "black", boxShadow: "none" }}
                  fontSize="14px"
                  py="12px"
                  px="20px"
                />
              </FormControl>

              <Button
                type="submit"
                bg="black"
                color="white"
                borderRadius="20px"
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                _hover={{ bg: "gray.800" }}
                py="15px"
                isLoading={loading}
                loadingText="Вход..."
                w="100%"
              >
                Войти
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>

      {/* Footer */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        textAlign="center"
        py="30px"
      >
        <Text fontSize="10px" mb="5px">
          Made by{' '}
          <a
            href="https://pro-ai.uz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: 'inherit' }}
          >
            PRO AI
          </a>
        </Text>
        <Text fontSize="10px" mb="5px">Tashkent, Uzbekistan</Text>
      </Box>
    </Flex>
  );
};

export default Login;

