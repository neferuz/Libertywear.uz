import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  Flex,
  Divider,
  Spinner,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL1 } from '../constants/config'

const About = () => {
  const [aboutSections, setAboutSections] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [sectionsRes, teamRes] = await Promise.all([
          axios.get(`${BASE_URL1}/pages/about/sections`),
          axios.get(`${BASE_URL1}/pages/about/team`)
        ])
        setAboutSections(sectionsRes.data)
        setTeamMembers(teamRes.data)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        // Fallback данные
        setAboutSections([
    {
      id: 1,
      title: 'НАША ИСТОРИЯ',
      description: 'Liberty — это современный бренд модной одежды, созданный для тех, кто ценит качество, стиль и индивидуальность. Мы начали свой путь с простой идеи: создавать одежду, которая сочетает в себе элегантность и комфорт.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      reverse: false,
    },
        ])
        setTeamMembers([
    {
      id: 1,
      name: 'Команда дизайнеров',
      role: 'Творческое видение',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop',
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
      <Box mb={{ base: "60px", md: "80px" }} textAlign="center">
        <Heading
          fontSize={{ base: "24px", md: "32px", lg: "40px" }}
          fontWeight="300"
          letterSpacing="1px"
          mb={{ base: "20px", md: "30px" }}
          textTransform="uppercase"
        >
          О компании
        </Heading>
        <Text
          fontSize={{ base: "14px", md: "16px" }}
          fontWeight="300"
          letterSpacing="0.3px"
          lineHeight="1.8"
          maxW="800px"
          marginX="auto"
          color="gray.700"
        >
          Liberty — это больше, чем просто бренд одежды. Это философия стиля, качества и индивидуальности.
        </Text>
      </Box>

      {/* Main Sections */}
      <VStack spacing={{ base: "60px", md: "80px" }} mb={{ base: "60px", md: "80px" }}>
        {aboutSections.map((section) => (
          <Box key={section.id} width="100%" maxW="1200px" marginX="auto">
            <Flex
              direction={{ base: "column", lg: section.reverse ? "row-reverse" : "row" }}
              gap={{ base: "30px", md: "50px" }}
              alignItems="center"
            >
              <Box
                flex="1"
                width="100%"
                height={{ base: "250px", md: "400px", lg: "500px" }}
                overflow="hidden"
                position="relative"
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  transition="transform 0.5s ease"
                  _hover={{
                    transform: "scale(1.05)",
                  }}
                />
              </Box>
              <VStack
                flex="1"
                align={{ base: "center", lg: "flex-start" }}
                spacing={4}
                textAlign={{ base: "center", lg: "left" }}
              >
                <Heading
                  fontSize={{ base: "18px", md: "22px", lg: "26px" }}
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                >
                  {section.title}
                </Heading>
                <Divider 
                  borderColor="black" 
                  borderWidth="1px"
                  width={{ base: "60px", md: "80px" }}
                  opacity={0.3}
                />
                <Text
                  fontSize={{ base: "13px", md: "15px" }}
                  fontWeight="300"
                  letterSpacing="0.3px"
                  lineHeight="1.8"
                  color="gray.700"
                >
                  {section.description}
                </Text>
              </VStack>
            </Flex>
          </Box>
        ))}
      </VStack>

      {/* Team Section */}
      <Box mb={{ base: "60px", md: "80px" }}>
        <Heading
          fontSize={{ base: "20px", md: "26px", lg: "30px" }}
          fontWeight="400"
          textAlign="center"
          letterSpacing="0.5px"
          mb={{ base: "40px", md: "60px" }}
          textTransform="uppercase"
        >
          Наша команда
        </Heading>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: "25px", sm: "30px", md: "35px", lg: "40px" }}
          maxW="1200px"
          marginX="auto"
        >
          {teamMembers.map((member) => (
            <VStack
              key={member.id}
              spacing={4}
              textAlign="center"
              p={{ base: "20px", md: "30px" }}
              backgroundColor="white"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-5px)",
              }}
            >
              <Box
                width={{ base: "200px", md: "250px" }}
                height={{ base: "200px", md: "250px" }}
                borderRadius="50%"
                overflow="hidden"
                position="relative"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  transition="transform 0.5s ease"
                  _hover={{
                    transform: "scale(1.1)",
                  }}
                />
              </Box>
              <VStack spacing={2}>
                <Text
                  fontSize={{ base: "14px", md: "16px" }}
                  fontWeight="500"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                >
                  {member.name}
                </Text>
                <Text
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="300"
                  letterSpacing="0.3px"
                  color="gray.600"
                >
                  {member.role}
                </Text>
              </VStack>
            </VStack>
          ))}
        </SimpleGrid>
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

export default About

