import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  Input,
  useToast,
  Text,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const SocialLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/social-links/`);
      setLinks(res.data.links || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить ссылки',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setLinks([...links, { name: '', url: '' }]);
  };

  const handleRemove = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSave = async () => {
    // Валидация
    for (let i = 0; i < links.length; i++) {
      if (!links[i].name || !links[i].name.trim()) {
        toast({
          title: 'Ошибка',
          description: `Пожалуйста, укажите название для социальной сети #${i + 1}`,
          status: 'error',
          duration: 3000,
        });
        return;
      }
      if (!links[i].url || !links[i].url.trim()) {
        toast({
          title: 'Ошибка',
          description: `Пожалуйста, укажите ссылку для "${links[i].name || `социальной сети #${i + 1}`}"`,
          status: 'error',
          duration: 3000,
        });
        return;
      }
    }

    try {
      setSaving(true);
      const cleanedLinks = links
        .map(link => ({
          name: link.name.trim(),
          url: link.url.trim(),
        }))
        .filter(link => link.name && link.url);
      
      await axios.put(`${BASE_URL}/social-links/`, { links: cleanedLinks });
      toast({
        title: 'Успешно',
        description: 'Ссылки сохранены',
        status: 'success',
        duration: 2000,
      });
      fetchLinks();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось сохранить ссылки',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Text>Загрузка...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex 
        justify="space-between" 
        align="center" 
        mb={{ base: "20px", md: "30px" }}
        flexDirection={{ base: "column", sm: "row" }}
        gap={{ base: "15px", sm: "0" }}
      >
        <Heading
          fontSize={{ base: "20px", sm: "24px", md: "32px" }}
          fontWeight="400"
          letterSpacing="1px"
          textTransform="uppercase"
        >
          Социальные сети
        </Heading>
        <HStack spacing={{ base: "8px", md: "10px" }} w={{ base: "100%", sm: "auto" }}>
          <Button
            leftIcon={<FiPlus />}
            bg="black"
            color="white"
            borderRadius="20px"
            fontSize={{ base: "11px", md: "12px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            _hover={{ bg: "gray.800" }}
            onClick={handleAdd}
            flex={{ base: "1", sm: "none" }}
            px={{ base: "15px", md: "20px" }}
            py={{ base: "12px", md: "15px" }}
          >
            Добавить
          </Button>
          <Button
            leftIcon={<FiSave />}
            bg="black"
            color="white"
            borderRadius="20px"
            fontSize={{ base: "11px", md: "12px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            _hover={{ bg: "gray.800" }}
            onClick={handleSave}
            isLoading={saving}
            loadingText="Сохранение..."
            flex={{ base: "1", sm: "none" }}
            px={{ base: "15px", md: "20px" }}
            py={{ base: "12px", md: "15px" }}
          >
            Сохранить
          </Button>
        </HStack>
      </Flex>

      {links.length === 0 ? (
        <Box textAlign="center" py={{ base: "40px", md: "60px" }}>
          <Text mb={{ base: "15px", md: "20px" }} color="gray.600" fontSize={{ base: "13px", md: "14px" }}>
            Социальные сети не добавлены
          </Text>
          <Button
            leftIcon={<FiPlus />}
            bg="black"
            color="white"
            borderRadius="20px"
            onClick={handleAdd}
            fontSize={{ base: "11px", md: "12px" }}
            px={{ base: "20px", md: "30px" }}
            py={{ base: "15px", md: "20px" }}
          >
            Добавить первую социальную сеть
          </Button>
        </Box>
      ) : (
        <VStack spacing="0" align="stretch" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" overflow="hidden">
          {links.map((link, index) => (
            <Box
              key={index}
              p={{ base: "15px", md: "20px" }}
              borderBottom={index < links.length - 1 ? "1px solid" : "none"}
              borderColor="#e5e5e5"
              _hover={{ bg: "#fafafa" }}
              transition="background-color 0.2s"
            >
              <Flex gap={{ base: "10px", md: "15px" }} align="center" flexDirection={{ base: "column", sm: "row" }}>
                <Box flex="1" w="100%">
                  <Input
                    value={link.name || ''}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Название (например: Instagram)"
                    borderRadius="20px"
                    borderColor="#e5e5e5"
                    _focus={{ borderColor: "black", boxShadow: "none" }}
                    fontSize={{ base: "13px", md: "14px" }}
                    mb={{ base: "8px", md: "10px" }}
                  />
                  <Input
                    value={link.url || ''}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    placeholder="Ссылка (например: https://instagram.com/your-profile)"
                    borderRadius="20px"
                    borderColor="#e5e5e5"
                    _focus={{ borderColor: "black", boxShadow: "none" }}
                    fontSize={{ base: "13px", md: "14px" }}
                  />
                </Box>
                <IconButton
                  icon={<FiTrash2 />}
                  size={{ base: "sm", md: "md" }}
                  variant="ghost"
                  color="red.500"
                  onClick={() => handleRemove(index)}
                  aria-label="Удалить"
                  _hover={{ bg: "red.50", color: "red.600" }}
                  alignSelf={{ base: "flex-end", sm: "auto" }}
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default SocialLinks;
