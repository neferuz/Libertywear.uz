import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Divider,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const Profile = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы',
      status: 'success',
      duration: 2000,
    });
    navigate('/login');
  };

  return (
    <Box>
      <Heading
        fontSize={{ base: "20px", sm: "24px", md: "32px" }}
        fontWeight="400"
        letterSpacing="1px"
        mb={{ base: "20px", md: "30px" }}
        textTransform="uppercase"
      >
        Учетная запись
      </Heading>

      <Box
        bg="white"
        border="1px solid"
        borderColor="#e5e5e5"
        borderRadius="20px"
        p={{ base: "25px", md: "40px" }}
        maxW="600px"
      >
        <VStack spacing="30px" align="stretch">
          {/* Имя */}
          <Box>
            <Flex align="center" mb="10px">
              <Icon as={FiUser} boxSize="20px" color="gray.600" mr="12px" />
              <Text
                fontSize="11px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                color="gray.600"
              >
                Имя
              </Text>
            </Flex>
            <Text
              fontSize={{ base: "16px", md: "18px" }}
              fontWeight="500"
              pl="32px"
            >
              {admin?.name || 'Администратор'}
            </Text>
          </Box>

          <Divider borderColor="#e5e5e5" />

          {/* Email */}
          <Box>
            <Flex align="center" mb="10px">
              <Icon as={FiMail} boxSize="20px" color="gray.600" mr="12px" />
              <Text
                fontSize="11px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                color="gray.600"
              >
                Email
              </Text>
            </Flex>
            <Text
              fontSize={{ base: "16px", md: "18px" }}
              fontWeight="500"
              pl="32px"
            >
              {admin?.email || 'admin@gmail.com'}
            </Text>
          </Box>

          <Divider borderColor="#e5e5e5" />

          {/* Кнопка выхода */}
          <Box pt="10px">
            <Button
              leftIcon={<FiLogOut />}
              bg="black"
              color="white"
              borderRadius="20px"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              _hover={{ bg: "gray.800" }}
              onClick={handleLogout}
              w={{ base: "100%", sm: "auto" }}
              px="30px"
              py="15px"
            >
              Выйти
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Profile;

