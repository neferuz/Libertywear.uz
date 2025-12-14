import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL1 } from '../constants/config'

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const res = await axios.get(`${BASE_URL1}/social-links/`);
      setSocialLinks(res.data.links || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  return (
    <>
    <Box width="350px" margin={"auto"} pt="50px">
        <Flex justify={"space-between"} flexWrap="wrap" gap="10px">
        {socialLinks.length > 0 ? (
          socialLinks.map((link, index) => (
            <Text
              key={index}
              fontSize={"10px"}
              as="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ opacity: 0.7 }}
              transition="opacity 0.2s"
              cursor="pointer"
              textTransform="uppercase"
            >
              {link.name}
            </Text>
          ))
        ) : (
          <Text fontSize={"10px"} opacity={0.5}>
            Социальные сети не добавлены
          </Text>
        )}
        </Flex>
    </Box>
    <Box mt="50px" mb="55px" textAlign="center">
        <Text fontSize={"10px"} mb="5px">
          Made by{' '}
          <a href="https://pro-ai.uz/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>
            PRO AI
          </a>
        </Text>
        <Text fontSize={"10px"} mb="5px">Tashkent, Uzbekistan</Text>
    </Box>
    </>
  )
}

export default Footer