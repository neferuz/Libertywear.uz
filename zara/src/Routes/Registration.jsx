import React, { useEffect, useState } from "react";
import {
  useToast,
  Button,
  Box,
  Flex,
  FormLabel,
  Checkbox,
  HStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Heading,
  VStack,
} from "@chakra-ui/react";
import {
  Text,
  Input,
  Spacer,
  FormControl,
  Select,
  Stack,
  SimpleGrid,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { BASE_URL1 } from "../constants/config";
import { useNavigate, Link } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import Loading from "../Components/Loading/Loading";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  // Функция для проверки требований к паролю
  const checkPasswordRequirements = (pwd) => {
    return {
      minLength: pwd.length >= 5,
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const passwordRequirements = checkPasswordRequirements(password);

  // Функция для форматирования телефона (только цифры после +998)
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  };

  const handlePhoneChange = (e) => {
    // Убираем все нецифровые символы и ограничиваем 9 цифрами
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhone(value);
  };
  const handleSubmit = () => {
    if (password.length < 5) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 5 символов",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
        borderRadius: "0",
      });
      return;
    } else if (!email.includes("@")) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите корректный email адрес",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
        borderRadius: "0",
      });
      return;
    } else if (phone.length !== 9 || !/^\d{9}$/.test(phone)) {
      toast({
        title: "Ошибка",
        description: "Номер телефона должен содержать 9 цифр (формат: +998XXXXXXXXX)",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
        borderRadius: "0",
      });
      return;
    } else {
      // Формируем полный номер телефона с префиксом +998
      const fullPhone = `+998${phone}`;
      
      // Преобразуем пустые строки в null для опциональных полей
      let payload = {
        name,
        email,
        password,
        phone: fullPhone,
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        pincode: pincode.trim() || null,
      };
      setLoading(true);
      fetch(`${BASE_URL1}/user/register`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok && data.message) {
            setLoading(false);
            
            // Если код пришел в ответе (режим разработки), показываем его
            let description = "Код подтверждения отправлен на ваш email. Введите его на следующей странице.";
            if (data.dev_code) {
              description = `Код подтверждения (для разработки): ${data.dev_code}. Введите его на следующей странице.`;
            }
            
            toast({
              title: "Регистрация успешна",
              description: description,
              status: "success",
              duration: 8000,
              isClosable: true,
            });
            // Сохраняем email для страницы подтверждения
            navigate("/login", { state: { email: email, needVerification: true, devCode: data.dev_code } });
          } else {
            setLoading(false);
            // Обрабатываем разные форматы ошибок
            let errorMsg = "Ошибка регистрации";
            if (data.detail) {
              if (Array.isArray(data.detail)) {
                errorMsg = data.detail.map(err => err.msg || err).join(", ");
              } else {
                errorMsg = data.detail;
              }
            } else if (data.message) {
              errorMsg = data.message;
            }
            toast({
              title: "Ошибка",
              description: errorMsg,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          toast({
            title: "Ошибка",
            description: "Не удалось подключиться к серверу. Попробуйте позже.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


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
        maxW="700px"
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
          "@keyframes slideInRight": {
            from: {
              opacity: 0,
              transform: "translateX(30px)",
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
          mb="20px"
          color="black"
          sx={{
            animation: "fadeInDown 0.5s ease-out",
          }}
        >
          Создать аккаунт
      </Heading>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" align="stretch">
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
                Имя
              </FormLabel>
              <Input
                fontSize="14px"
                required
                name="name"
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                    backgroundColor: "white !important",
                  },
                  "&:hover": {
                    border: "none !important",
                    backgroundColor: "white !important",
                  },
                  "&:active": {
                    border: "none !important",
                  },
                }}
              />
            </FormControl>

            <FormControl
              sx={{
                animation: "slideInRight 0.4s ease-out 0.15s both",
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
                _invalid={{ border: "none" }}
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
              gridColumn={{ base: "1", md: "1 / -1" }}
              sx={{
                animation: "fadeIn 0.4s ease-out 0.2s both",
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
              {password && (
                <Box
                  mt="12px"
                  sx={{
                    animation: "fadeInDown 0.3s ease-out",
                    "@keyframes fadeInDown": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(-10px)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  <VStack spacing="6px" align="flex-start">
                    <HStack 
                      spacing="8px"
                      sx={{
                        animation: "slideInLeft 0.3s ease-out 0.1s both",
                        "@keyframes slideInLeft": {
                          "0%": {
                            opacity: 0,
                            transform: "translateX(-10px)",
                          },
                          "100%": {
                            opacity: 1,
                            transform: "translateX(0)",
                          },
                        },
                      }}
                    >
                      {passwordRequirements.minLength ? (
                        <FiCheck size={14} color="#38a169" />
                      ) : (
                        <FiX size={14} color="#e53e3e" />
                      )}
                      <Text 
                        fontSize="12px" 
                        color={passwordRequirements.minLength ? "#38a169" : "#e53e3e"}
                        fontFamily="'Manrope', sans-serif"
                      >
                        Минимум 5 символов
                      </Text>
                    </HStack>
                    <HStack 
                      spacing="8px"
                      sx={{
                        animation: "slideInLeft 0.3s ease-out 0.2s both",
                        "@keyframes slideInLeft": {
                          "0%": {
                            opacity: 0,
                            transform: "translateX(-10px)",
                          },
                          "100%": {
                            opacity: 1,
                            transform: "translateX(0)",
                          },
                        },
                      }}
                    >
                      {passwordRequirements.hasNumber ? (
                        <FiCheck size={14} color="#38a169" />
                      ) : (
                        <FiX size={14} color="#e53e3e" />
                      )}
                      <Text 
                        fontSize="12px" 
                        color={passwordRequirements.hasNumber ? "#38a169" : "#e53e3e"}
                        fontFamily="'Manrope', sans-serif"
                      >
                        Хотя бы одна цифра
                      </Text>
                    </HStack>
                    <HStack 
                      spacing="8px"
                      sx={{
                        animation: "slideInLeft 0.3s ease-out 0.3s both",
                        "@keyframes slideInLeft": {
                          "0%": {
                            opacity: 0,
                            transform: "translateX(-10px)",
                          },
                          "100%": {
                            opacity: 1,
                            transform: "translateX(0)",
                          },
                        },
                      }}
                    >
                      {passwordRequirements.hasSpecial ? (
                        <FiCheck size={14} color="#38a169" />
                      ) : (
                        <FiX size={14} color="#e53e3e" />
                      )}
                      <Text 
                        fontSize="12px" 
                        color={passwordRequirements.hasSpecial ? "#38a169" : "#e53e3e"}
                        fontFamily="'Manrope', sans-serif"
                      >
                        Хотя бы один специальный символ
                </Text>
              </HStack>
                  </VStack>
                </Box>
              )}
          </FormControl>

            <FormControl
              sx={{
                animation: "slideInLeft 0.4s ease-out 0.25s both",
              }}
            >
              <FormLabel 
                fontSize="14px" 
                fontWeight="400" 
                color="black"
                fontFamily="'Manrope', sans-serif"
                mb="8px"
              >
                Регион
              </FormLabel>
              <Select
                fontSize="14px"
              placeholder="Выберите регион"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
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
                    backgroundColor: "white !important",
                  },
                  "&:hover": {
                    border: "none !important",
                    backgroundColor: "white !important",
                  },
                  "&:active": {
                    border: "none !important",
                    backgroundColor: "white !important",
                  },
                }}
              >
                <option value="tashkent_city">Ташкент (город)</option>
                <option value="tashkent_region">Ташкентская область</option>
                <option value="samarkand">Самаркандская область</option>
                <option value="bukhara">Бухарская область</option>
                <option value="andijan">Андижанская область</option>
                <option value="fergana">Ферганская область</option>
                <option value="namangan">Наманганская область</option>
                <option value="sirdaryo">Сырдарьинская область</option>
                <option value="jizzakh">Джизакская область</option>
                <option value="kashkadarya">Кашкадарьинская область</option>
                <option value="surkhandarya">Сурхандарьинская область</option>
                <option value="navoiy">Навоийская область</option>
                <option value="khorezm">Хорезмская область</option>
                <option value="karakalpakstan">Республика Каракалпакстан</option>
              </Select>
          </FormControl>

            <FormControl
              sx={{
                animation: "slideInRight 0.4s ease-out 0.3s both",
              }}
            >
              <FormLabel 
                fontSize="14px" 
                fontWeight="400" 
                color="black"
                fontFamily="'Manrope', sans-serif"
                mb="8px"
              >
                Телефон
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" pl="12px" width="50px">
                  <Text fontSize="14px" color="black" fontFamily="'Manrope', sans-serif" fontWeight="400">+998</Text>
                </InputLeftElement>
                <Input
                  fontSize="14px"
                  type="tel"
                  name="phone"
                  placeholder="93 565 38 01"
                  value={formatPhone(phone)}
                  onChange={handlePhoneChange}
                  onKeyDown={(e) => {
                    // Предотвращаем удаление курсора в начале
                    if (e.key === 'Backspace' && e.target.selectionStart === 0) {
                      e.preventDefault();
                    }
                  }}
                  borderRadius="4px"
                  border="none"
                  _focus={{ border: "none", boxShadow: "none" }}
                  _hover={{ border: "none" }}
                  paddingY="12px"
                  paddingX="16px"
                  paddingLeft="55px"
                  fontFamily="'Manrope', sans-serif"
                  bg="white"
                  sx={{
                    border: "none !important",
                    "&:focus": {
                      border: "none !important",
                      backgroundColor: "white !important",
                    },
                    "&:hover": {
                      border: "none !important",
                      backgroundColor: "white !important",
                    },
                    "&:active": {
                      border: "none !important",
                      backgroundColor: "white !important",
                    },
                  }}
                />
              </InputGroup>
            </FormControl>

            <FormControl
              sx={{
                animation: "slideInLeft 0.4s ease-out 0.35s both",
              }}
            >
              <FormLabel 
                fontSize="14px" 
                fontWeight="400" 
                color="black"
                fontFamily="'Manrope', sans-serif"
                mb="8px"
              >
                Город
              </FormLabel>
              <Input
                fontSize="14px"
                type="text"
                placeholder=""
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
                    backgroundColor: "white !important",
                  },
                  "&:hover": {
                    border: "none !important",
                    backgroundColor: "white !important",
                  },
                  "&:active": {
                    border: "none !important",
                    backgroundColor: "white !important",
                  },
                }}
              />
            </FormControl>

            <FormControl
              sx={{
                animation: "slideInRight 0.4s ease-out 0.4s both",
              }}
            >
              <FormLabel 
                fontSize="14px" 
                fontWeight="400" 
                color="black"
                fontFamily="'Manrope', sans-serif"
                mb="8px"
              >
                Адрес
              </FormLabel>
              <Input
                fontSize="14px"
                type="text"
                placeholder=""
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                    backgroundColor: "white !important",
                  },
                  "&:hover": {
                    border: "none !important",
                    backgroundColor: "white !important",
                  },
                  "&:active": {
                    border: "none !important",
                    backgroundColor: "white !important",
                  },
                }}
            />
          </FormControl>

            <FormControl
              sx={{
                animation: "slideInLeft 0.4s ease-out 0.45s both",
              }}
            >
              <FormLabel 
                fontSize="14px" 
                fontWeight="400" 
                color="black"
                fontFamily="'Manrope', sans-serif"
                mb="8px"
              >
                Почтовый индекс
              </FormLabel>
              <Input
                fontSize="14px"
                type="text"
                placeholder=""
                name="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                borderRadius="4px"
                border="1px solid #e5e5e5"
                _focus={{ borderColor: "#e5e5e5", boxShadow: "none" }}
                _hover={{ borderColor: "#e5e5e5" }}
                paddingY="12px"
                paddingX="16px"
                fontFamily="'Manrope', sans-serif"
                bg="white"
                sx={{
                  "&:focus": {
                    borderColor: "#e5e5e5 !important",
                    backgroundColor: "white !important",
                  },
                  "&:hover": {
                    borderColor: "#e5e5e5 !important",
                    backgroundColor: "white !important",
                  },
                }}
            />
            </FormControl>
          </SimpleGrid>

          <Button
            borderRadius="0"
            type="submit"
            fontSize="12px"
            fontWeight="400"
            letterSpacing="2px"
            textTransform="uppercase"
            color="white"
            bg="black"
            width="100%"
            paddingY="28px"
            mt="20px"
            _hover={{ backgroundColor: loading ? "black" : "gray.800" }}
            fontFamily="'Manrope', sans-serif"
            transition="all 0.2s"
            disabled={loading}
            opacity={loading ? 0.8 : 1}
            cursor={loading ? "not-allowed" : "pointer"}
            sx={{
              animation: "fadeIn 0.4s ease-out 0.5s both",
            }}
          >
            {loading ? (
              <HStack spacing="10px">
                <Spinner 
                  size="sm" 
                  color="white" 
                  thickness="2px"
                  speed="0.65s"
                />
                <Text 
                  fontSize="12px" 
                  fontWeight="400" 
                  letterSpacing="2px" 
                  textTransform="uppercase"
                  fontFamily="'Manrope', sans-serif"
                >
                  Регистрация...
                </Text>
              </HStack>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>

            <Box
              textAlign="center"
              mt="25px"
            sx={{
                animation: "fadeIn 0.4s ease-out 0.55s both",
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
                Уже зарегистрированы?{" "}
              </Text>
              <Link 
                to="/login" 
                style={{ 
                  color: "black", 
                  textDecoration: "underline",
                  fontWeight: "400",
                  letterSpacing: "1px",
                  textTransform: "uppercase"
                }}
              >
                Войти
              </Link>
            </Box>

            <Text 
              fontSize="11px" 
              textAlign="center" 
              color="#999"
              fontFamily="'Manrope', sans-serif"
              mt="30px"
              lineHeight="1.6"
            >
              Продолжая, вы соглашаетесь с нашими{" "}
              <Link to="/terms" style={{ textDecoration: "underline" }}>Условиями использования</Link>{" "}
              и{" "}
              <Link to="/privacy" style={{ textDecoration: "underline" }}>Политикой конфиденциальности</Link>.
            </Text>
      </form>
      </Box>
      </Box>
  );
};

export default Registration;
