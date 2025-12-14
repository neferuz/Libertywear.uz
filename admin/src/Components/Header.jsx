import React from 'react';
import { Box, Flex, Text, HStack, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiMenu } from 'react-icons/fi';

const Header = ({ onMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="#e5e5e5"
      p={{ base: "15px 20px", md: "20px 30px" }}
      position="sticky"
      top="0"
      zIndex="100"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing="15px">
          {/* Mobile Menu Button */}
          <Box
            display={{ base: 'block', md: 'none' }}
            onClick={onMenuOpen}
            cursor="pointer"
            p="8px"
            borderRadius="0"
            _hover={{ bg: '#fafafa' }}
            transition="all 0.2s"
          >
            <Icon as={FiMenu} boxSize="20px" color="black" />
          </Box>
          <Text
            fontSize={{ base: "16px", md: "18px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
          >
            Панель управления
          </Text>
        </HStack>
        
        <HStack spacing="20px">
          <Box
            cursor="pointer"
            p="8px"
            borderRadius="0"
            _hover={{ bg: "gray.100" }}
            transition="all 0.2s"
          >
            <Icon as={FiBell} boxSize="20px" />
          </Box>
          
          <Box
            cursor="pointer"
            p="8px"
            borderRadius="0"
            _hover={{ bg: "gray.100" }}
            transition="all 0.2s"
            onClick={() => navigate('/profile')}
          >
            <Icon as={FiUser} boxSize="20px" />
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;

