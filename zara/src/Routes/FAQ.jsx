import {
  Box,
  Heading,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Spinner,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL1 } from '../constants/config'

const FAQ = () => {
  const [faqItems, setFaqItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL1}/pages/faq`)
        setFaqItems(res.data)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        // Fallback данные
        setFaqItems([
    {
      id: 1,
      question: 'Как оформить заказ?',
            answer: 'Выберите понравившиеся товары, добавьте их в корзину и перейдите к оформлению заказа.',
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
          FAQ
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
          Часто задаваемые вопросы. Если вы не нашли ответ на свой вопрос, свяжитесь с нами.
        </Text>
      </Box>

      {/* FAQ Accordion */}
      <Box maxW="900px" marginX="auto">
        <Accordion
          allowToggle
          defaultIndex={[0]}
          border="none"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              border="none"
              borderTop="1px solid"
              borderColor="gray.200"
              _last={{ borderBottom: "1px solid", borderColor: "gray.200" }}
              mb={index === faqItems.length - 1 ? 0 : 0}
            >
              <AccordionButton
                py={{ base: "20px", md: "25px" }}
                px={0}
                _hover={{ backgroundColor: "transparent" }}
                _focus={{ boxShadow: "none" }}
              >
                <Box
                  flex="1"
                  textAlign="left"
                >
                  <Text
                    fontSize={{ base: "13px", md: "15px" }}
                    fontWeight="400"
                    letterSpacing="0.3px"
                    textTransform="uppercase"
                    color="black"
                  >
                    {item.question}
                  </Text>
                </Box>
                <AccordionIcon
                  color="black"
                  boxSize="20px"
                />
              </AccordionButton>
              <AccordionPanel
                pb={{ base: "20px", md: "25px" }}
                px={0}
              >
                <Text
                  fontSize={{ base: "13px", md: "14px" }}
                  fontWeight="300"
                  letterSpacing="0.3px"
                  lineHeight="1.8"
                  color="gray.700"
                  pl={{ base: "0", md: "20px" }}
                >
                  {item.answer}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>

      {/* Contact Section */}
      <Box
        mt={{ base: "60px", md: "80px" }}
        textAlign="center"
        maxW="700px"
        marginX="auto"
      >
        <Text
          fontSize={{ base: "14px", md: "16px" }}
          fontWeight="300"
          letterSpacing="0.3px"
          lineHeight="1.8"
          color="gray.700"
          mb={{ base: "20px", md: "30px" }}
        >
          Не нашли ответ на свой вопрос?
        </Text>
        <Text
          fontSize={{ base: "13px", md: "14px" }}
          fontWeight="300"
          letterSpacing="0.3px"
          color="gray.600"
        >
          Свяжитесь с нами по телефону{' '}
          <Text as="span" fontWeight="500" color="black">
            +998 94 455 49 47
          </Text>
          {' '}или напишите на{' '}
          <Text as="span" fontWeight="500" color="black">
            info@liberty.uz
          </Text>
        </Text>
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

export default FAQ

