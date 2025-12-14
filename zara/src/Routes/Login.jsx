import React, { useEffect, useState } from 'react';
import { useToast, Box, Text, Input, Button, VStack, HStack, Heading, FormLabel, InputGroup, InputRightElement } from '@chakra-ui/react';
import { BASE_URL1 } from '../constants/config';
import { FormControl, FormHelperText } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { login } from '../Redux/auth.redux/authAction';
import Loading from '../Components/Loading/Loading';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '']);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, isLoading, isError } = useSelector((store) => store.authReducer);
  const location = useLocation();

  useEffect(() => {
    if (isAuth) {
      // Если пользователь уже авторизован, перенаправляем на главную
      navigate('/', { replace: true });
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Проверяем, нужно ли показать поле подтверждения
    if (location.state?.needVerification && location.state?.email) {
      setShowVerification(true);
      setPendingEmail(location.state.email);
      setEmail(location.state.email);
      
      // Если есть dev_code (режим разработки), показываем его
      if (location.state?.devCode) {
        toast({
          title: "Режим разработки",
          description: `Код подтверждения: ${location.state.devCode}`,
          status: "info",
          duration: 10000,
          isClosable: true,
        });
      }
      
      // Автоматически фокусируем первый инпут кода
      setTimeout(() => {
        const firstInput = document.getElementById('code-input-0');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }, [location, toast]);

  const handleCodeDigitChange = (index, value) => {
    // Разрешаем только цифры
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const newDigits = [...codeDigits];
    newDigits[index] = digit;
    setCodeDigits(newDigits);

    // Автоматически переходим к следующему инпуту
    if (digit && index < 4) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Обновляем общий код
    const fullCode = newDigits.join('');
    setVerificationCode(fullCode);
  };

  const handleCodeKeyDown = (index, e) => {
    // Обработка Backspace
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    const newDigits = pastedData.split('').slice(0, 5);
    while (newDigits.length < 5) {
      newDigits.push('');
    }
    setCodeDigits(newDigits);
    setVerificationCode(pastedData);
    
    // Фокус на последний заполненный инпут или первый пустой
    const lastFilledIndex = newDigits.findIndex(d => !d) - 1;
    const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : newDigits.length - 1;
    const input = document.getElementById(`code-input-${focusIndex}`);
    if (input) {
      input.focus();
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    const fullCode = codeDigits.join('');
    if (!fullCode || fullCode.length !== 5) {
      toast({
        title: 'Ошибка',
        description: 'Введите 5-значный код подтверждения',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL1}/user/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pendingEmail || email,
          code: fullCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Email подтвержден',
          description: data.message || 'Теперь вы можете войти в систему',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setShowVerification(false);
        setVerificationCode('');
        setCodeDigits(['', '', '', '', '']);
      } else {
        toast({
          title: 'Ошибка',
          description: data.detail || 'Неверный код подтверждения',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        // Очищаем код при ошибке
        setCodeDigits(['', '', '', '', '']);
        setVerificationCode('');
        const firstInput = document.getElementById('code-input-0');
        if (firstInput) {
          firstInput.focus();
        }
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    let userData = {
      email,
      password,
    };

    dispatch(login(userData)).then(({ status, msg }) => {
        status == 1
          ? toast({
              title: 'Вход выполнен',
              description: msg,
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
          : toast({
              title: 'Ошибка',
              description: msg,
              status: 'error',
              duration: 9000,
              isClosable: true,
            });

      if (status == 1) {
        // Всегда перенаправляем на главную после успешного входа
        // Небольшая задержка, чтобы toast успел показаться
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 500);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <Box 
      paddingX={{ base: "20px", sm: "30px", md: "40px" }}
      paddingBottom={{ base: "40px", sm: "50px", md: "60px" }}
      backgroundColor="white"
      pt={{ base: "70px", sm: "80px", md: "90px" }}
      sx={{
        paddingTop: "70px !important",
        "@media (min-width: 30em)": {
          paddingTop: "80px !important",
        },
        "@media (min-width: 48em)": {
          paddingTop: "90px !important",
        },
      }}
    >
      <Box
        width="100%"
        maxW="500px"
        marginX="auto"
        sx={{
          "@keyframes fadeInDown": {
            from: {
              opacity: 0,
              transform: "translateY(-20px)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
          "@keyframes slideInLeft": {
            from: {
              opacity: 0,
              transform: "translateX(-30px)",
            },
            to: {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
          "@keyframes fadeIn": {
            from: {
              opacity: 0,
            },
            to: {
              opacity: 1,
            },
          },
        }}
      >
        <Heading
          fontSize={{ base: "28px", md: "32px" }}
          fontWeight="600"
          textAlign="center"
          fontFamily="'Manrope', sans-serif"
          mb="30px"
          color="black"
          sx={{
            animation: "fadeInDown 0.5s ease-out",
          }}
        >
          Войти
        </Heading>

        {showVerification ? (
          <form onSubmit={handleVerifyEmail} style={{ width: '100%' }}>
            <FormControl width="100%">
              <VStack spacing="25px" align="stretch">
                <Box
                  textAlign="center"
                  sx={{
                    animation: "fadeIn 0.4s ease-out",
                  }}
                >
                  <Text
                    fontSize="14px"
                    color="#666"
                    lineHeight="1.6"
                    fontFamily="'Manrope', sans-serif"
                    mb="5px"
                  >
                    Мы отправили код подтверждения на email
                  </Text>
                  <Text
                    fontSize="14px"
                    color="black"
                    fontWeight="500"
                    fontFamily="'Manrope', sans-serif"
                  >
                    {pendingEmail || email}
                  </Text>
                </Box>
                
                <FormControl
                  sx={{
                    animation: "slideInLeft 0.4s ease-out 0.1s both",
                  }}
                >
                  <FormLabel 
                    fontSize="14px" 
                    fontWeight="400" 
                    color="black"
                    fontFamily="'Manrope', sans-serif"
                    mb="15px"
                    textAlign="center"
                  >
                    Код подтверждения
                  </FormLabel>
                  <HStack spacing="10px" justify="center">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Input
                        key={index}
                        id={`code-input-${index}`}
                        fontSize="24px"
                        fontWeight="600"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={codeDigits[index]}
                        onChange={(e) => handleCodeDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        onPaste={index === 0 ? handleCodePaste : undefined}
                        borderRadius="4px"
                        border="none"
                        borderBottom="2px solid #e5e5e5"
                        _focus={{ 
                          borderBottom: "2px solid black", 
                          boxShadow: "none",
                          outline: "none"
                        }}
                        _hover={{ borderBottom: "2px solid #999" }}
                        paddingY="15px"
                        paddingX="0"
                        textAlign="center"
                        fontFamily="'Manrope', sans-serif"
                        bg="transparent"
                        width="50px"
                        height="60px"
                        sx={{
                          "&:focus": {
                            borderBottom: "2px solid black !important",
                          },
                        }}
                      />
                    ))}
                  </HStack>
                </FormControl>

                <Button
                  type="submit"
                  fontSize="12px"
                  borderRadius="0"
                  color="white"
                  bg="black"
                  width="100%"
                  paddingY="28px"
                  _hover={{
                    backgroundColor: "gray.800",
                  }}
                  letterSpacing="2px"
                  textTransform="uppercase"
                  fontWeight="400"
                  fontFamily="'Manrope', sans-serif"
                  transition="all 0.2s"
                  sx={{
                    animation: "slideInLeft 0.4s ease-out 0.2s both",
                  }}
                >
                  Подтвердить
                </Button>

                <Button
                  variant="ghost"
                  fontSize="11px"
                  onClick={() => {
                    setShowVerification(false);
                    setVerificationCode('');
                  }}
                  _hover={{ textDecoration: "underline", opacity: 0.7 }}
                  fontFamily="'Manrope', sans-serif"
                  color="black"
                  fontWeight="400"
                  sx={{
                    animation: "fadeIn 0.4s ease-out 0.3s both",
                  }}
                >
                  Вернуться к входу
                </Button>
              </VStack>
            </FormControl>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing="20px" align="stretch">
              <FormControl
                sx={{
                  animation: "slideInLeft 0.4s ease-out 0.1s both",
                }}
              >
                <FormLabel 
                  fontSize="14px" 
                  fontWeight="400" 
                  color="black"
                  fontFamily="'Manrope', sans-serif"
                  mb="8px"
                >
                  Email
                </FormLabel>
                <Input
                  fontSize="14px"
                  required
                  name="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderRadius="4px"
                  border="none"
                  _focus={{ border: "none", boxShadow: "none" }}
                  _hover={{ border: "none" }}
                  paddingY="12px"
                  paddingX="16px"
                  fontFamily="'Manrope', sans-serif"
                  bg="white"
                  sx={{
                    border: "none !important",
                    "&:focus": {
                      border: "none !important",
                    },
                    "&:hover": {
                      border: "none !important",
                    },
                    "&:invalid": {
                      border: "none !important",
                    }
                  }}
                />
              </FormControl>

              <FormControl
                sx={{
                  animation: "slideInLeft 0.4s ease-out 0.2s both",
                }}
              >
                <FormLabel 
                  fontSize="14px" 
                  fontWeight="400" 
                  color="black"
                  fontFamily="'Manrope', sans-serif"
                  mb="8px"
                >
                  Пароль
                </FormLabel>
                <InputGroup>
                  <Input
                    fontSize="14px"
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    borderRadius="4px"
                    border="none"
                    _focus={{ border: "none", boxShadow: "none" }}
                    _hover={{ border: "none" }}
                    paddingY="12px"
                    paddingX="16px"
                    paddingRight="50px"
                    fontFamily="'Manrope', sans-serif"
                    bg="white"
                    sx={{
                      border: "none !important",
                      "&:focus": {
                        border: "none !important",
                      },
                      "&:hover": {
                        border: "none !important",
                      }
                    }}
                  />
                  <InputRightElement h="full" pr="12px">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((showPassword) => !showPassword)}
                      _hover={{ backgroundColor: "transparent" }}
                      _active={{ backgroundColor: "transparent" }}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText
                  fontSize="11px"
                  color="#666"
                  marginTop="5px"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline", color: "black" }}
                  fontFamily="'Manrope', sans-serif"
                  fontWeight="400"
                  transition="color 0.2s"
                  textAlign="left"
                >
                  Забыли пароль?
                </FormHelperText>
              </FormControl>

              <Button
                type="submit"
                fontSize="12px"
                borderRadius="0"
                color="white"
                bg="black"
                width="100%"
                paddingY="28px"
                _hover={{
                  backgroundColor: "gray.800",
                }}
                letterSpacing="2px"
                textTransform="uppercase"
                fontWeight="400"
                fontFamily="'Manrope', sans-serif"
                transition="all 0.2s"
                mt="10px"
                sx={{
                  animation: "slideInLeft 0.4s ease-out 0.3s both",
                }}
              >
                Войти
              </Button>

              <Box 
                textAlign="center" 
                mt="25px"
                sx={{
                  animation: "fadeIn 0.4s ease-out 0.4s both",
                }}
              >
                <Text 
                  fontSize="12px" 
                  color="black"
                  fontFamily="'Manrope', sans-serif"
                  letterSpacing="1px"
                  textTransform="uppercase"
                  fontWeight="400"
                  display="inline"
                >
                  Нет аккаунта?{" "}
                </Text>
                <Link 
                  to="/registration" 
                  style={{ 
                    color: "black", 
                    textDecoration: "underline",
                    fontWeight: "400",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    fontFamily: "'Manrope', sans-serif"
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Box>
            </VStack>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Login;
