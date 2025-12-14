import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Divider,
  Icon,
  Spinner,
  Input,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi'
import axios from 'axios'
import { BASE_URL1 } from '../constants/config'

const iconMap = {
  map: FiMapPin,
  phone: FiPhone,
  email: FiMail,
  clock: FiClock,
}

const Contacts = () => {
  const [contactInfo, setContactInfo] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL1}/pages/contacts`)
        const contacts = res.data.map(item => ({
          ...item,
          icon: iconMap[item.icon_type] || FiMapPin
        }))
        setContactInfo(contacts)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        // Fallback данные
        setContactInfo([
          {
            id: 1,
            icon: FiMapPin,
            title: 'Адрес',
            content: 'Ташкент, Узбекистан',
            details: 'Центральный район, ул. Навруз, 15',
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Box 
        mt={{ base: "100px", md: "120px" }} 
        paddingX={{ base: "10px", sm: "15px", md: "40px", lg: "60px" }}
        pb={{ base: "60px", md: "80px" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="50vh"
      >
        <Spinner size="xl" thickness="3px" color="black" />
      </Box>
    )
  }

  return (
    <Box 
      mt={{ base: "100px", md: "120px" }} 
      paddingX={{ base: "10px", sm: "15px", md: "40px", lg: "60px" }}
      pb={{ base: "60px", md: "80px" }}
    >
      {/* Hero Section */}
      <Box mb={{ base: "50px", md: "70px" }} textAlign="center">
        <Heading
          fontSize={{ base: "24px", md: "32px", lg: "40px" }}
          fontWeight="300"
          letterSpacing="1px"
          mb={{ base: "20px", md: "30px" }}
          textTransform="uppercase"
        >
          Контакты
        </Heading>
        <Text
          fontSize={{ base: "14px", md: "16px" }}
          fontWeight="300"
          letterSpacing="0.3px"
          lineHeight="1.8"
          maxW="700px"
          marginX="auto"
          color="gray.700"
        >
          Свяжитесь с нами любым удобным способом. Мы всегда рады помочь и ответить на ваши вопросы.
        </Text>
      </Box>

      {/* Contact Info Cards */}
      <Box mb={{ base: "50px", md: "70px" }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
          gap={{ base: "20px", md: "30px" }}
          justifyContent="center"
          maxW="1200px"
          marginX="auto"
        >
          {contactInfo.map((item) => (
            <Box
              key={item.id}
              flex={{ base: "1 1 100%", md: "1 1 calc(50% - 15px)", lg: "1 1 calc(25% - 23px)" }}
              minW={{ base: "100%", md: "280px" }}
              p={{ base: "25px", md: "30px" }}
              backgroundColor="white"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-5px)",
                borderColor: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <VStack spacing={4} align="flex-start">
                <Icon
                  as={item.icon}
                  boxSize={{ base: "24px", md: "28px" }}
                  color="black"
                />
                <VStack spacing={2} align="flex-start">
                  <Text
                    fontSize={{ base: "11px", md: "12px" }}
                    fontWeight="400"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    color="gray.600"
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize={{ base: "14px", md: "16px" }}
                    fontWeight="500"
                    letterSpacing="0.3px"
                    color="black"
                  >
                    {item.content}
                  </Text>
                  <Text
                    fontSize={{ base: "12px", md: "13px" }}
                    fontWeight="300"
                    letterSpacing="0.3px"
                    color="gray.600"
                  >
                    {item.details}
                  </Text>
                </VStack>
              </VStack>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Map Section */}
      <Box mb={{ base: "50px", md: "70px" }}>
        <Heading
          fontSize={{ base: "18px", md: "22px", lg: "26px" }}
          fontWeight="400"
          textAlign="center"
          letterSpacing="0.5px"
          mb={{ base: "30px", md: "40px" }}
          textTransform="uppercase"
        >
          Как нас найти
        </Heading>
        <Box
          width="100%"
          maxW="1200px"
          marginX="auto"
          height={{ base: "300px", sm: "350px", md: "400px", lg: "500px" }}
          position="relative"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.0!2d69.2401!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Liberty Store Location"
          />
        </Box>
      </Box>

      {/* Contact Form Section */}
      <Box mb={{ base: "50px", md: "70px" }}>
        <Heading
          fontSize={{ base: "18px", md: "22px", lg: "26px" }}
          fontWeight="400"
          textAlign="center"
          letterSpacing="0.5px"
          mb={{ base: "30px", md: "40px" }}
          textTransform="uppercase"
        >
          Напишите нам
        </Heading>
        <Box
          maxW="700px"
          marginX="auto"
          p={{ base: "30px", md: "40px", lg: "50px" }}
          backgroundColor="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="8px"
        >
          <ContactForm />
        </Box>
      </Box>

      {/* Bottom Divider */}
      <Box mt={{ base: "60px", md: "80px" }}>
        <Divider 
          borderColor="black" 
          borderWidth="1px"
          opacity={0.2}
        />
      </Box>
    </Box>
  )
}

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Валидация
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите корректный email адрес",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(`${BASE_URL1}/contact-messages/`, formData)
      
      toast({
        title: "Спасибо!",
        description: "Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      // Очистка формы
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось отправить сообщение. Попробуйте позже.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Text
          fontSize={{ base: "13px", md: "14px" }}
          fontWeight="300"
          letterSpacing="0.3px"
          lineHeight="1.8"
          textAlign="center"
          color="gray.700"
          mb={2}
        >
          Заполните форму ниже, и мы свяжемся с вами в ближайшее время.
        </Text>

        {/* Имя и Email в одну строку на больших экранах */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Box flex="1">
            <Text
              fontSize={{ base: "11px", md: "12px" }}
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              color="gray.600"
              mb={2}
            >
              Имя <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              size={{ base: "md", md: "lg" }}
              borderRadius="4px"
              borderColor="gray.300"
              _focus={{
                borderColor: "black",
                boxShadow: "0 0 0 1px black",
              }}
              _hover={{
                borderColor: "gray.400",
              }}
              required
            />
          </Box>

          <Box flex="1">
            <Text
              fontSize={{ base: "11px", md: "12px" }}
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              color="gray.600"
              mb={2}
            >
              Email <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              size={{ base: "md", md: "lg" }}
              borderRadius="4px"
              borderColor="gray.300"
              _focus={{
                borderColor: "black",
                boxShadow: "0 0 0 1px black",
              }}
              _hover={{
                borderColor: "gray.400",
              }}
              required
            />
          </Box>
        </Flex>

        {/* Телефон и Тема в одну строку на больших экранах */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Box flex="1">
            <Text
              fontSize={{ base: "11px", md: "12px" }}
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              color="gray.600"
              mb={2}
            >
              Телефон
            </Text>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998 XX XXX XX XX"
              size={{ base: "md", md: "lg" }}
              borderRadius="4px"
              borderColor="gray.300"
              _focus={{
                borderColor: "black",
                boxShadow: "0 0 0 1px black",
              }}
              _hover={{
                borderColor: "gray.400",
              }}
            />
          </Box>

          <Box flex="1">
            <Text
              fontSize={{ base: "11px", md: "12px" }}
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              color="gray.600"
              mb={2}
            >
              Тема
            </Text>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Тема сообщения"
              size={{ base: "md", md: "lg" }}
              borderRadius="4px"
              borderColor="gray.300"
              _focus={{
                borderColor: "black",
                boxShadow: "0 0 0 1px black",
              }}
              _hover={{
                borderColor: "gray.400",
              }}
            />
          </Box>
        </Flex>

        {/* Сообщение */}
        <Box>
          <Text
            fontSize={{ base: "11px", md: "12px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            color="gray.600"
            mb={2}
          >
            Сообщение <Text as="span" color="red.500">*</Text>
          </Text>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Напишите ваше сообщение..."
            size={{ base: "md", md: "lg" }}
            rows={6}
            borderRadius="4px"
            borderColor="gray.300"
            _focus={{
              borderColor: "black",
              boxShadow: "0 0 0 1px black",
            }}
            _hover={{
              borderColor: "gray.400",
            }}
            resize="vertical"
            required
          />
        </Box>

        {/* Кнопка отправки */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Отправка..."
          leftIcon={<FiSend />}
          bg="black"
          color="white"
          size={{ base: "md", md: "lg" }}
          borderRadius="4px"
          fontWeight="400"
          letterSpacing="0.5px"
          textTransform="uppercase"
          fontSize={{ base: "12px", md: "13px" }}
          _hover={{
            bg: "gray.800",
          }}
          _active={{
            bg: "gray.900",
          }}
          transition="all 0.2s"
        >
          Отправить сообщение
        </Button>
      </VStack>
    </form>
  )
}

export default Contacts

