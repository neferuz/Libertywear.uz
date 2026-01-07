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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

// Функция для получения правильного URL изображения
const getImageUrl = (url) => {
  if (!url) return '';
  
  try {
    // Если URL уже полный (начинается с http:// или https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url);
      // Если это IP адрес, заменяем на правильный домен
      if (urlObj.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        // Это IP адрес, заменяем на правильный домен
        const path = urlObj.pathname;
        const port = urlObj.port;
        // Определяем правильный домен на основе текущего местоположения
        const hostname = window.location.hostname;
        
        // Если админка на admin.libertywear.uz, используем libertywear.uz
        if (hostname === 'admin.libertywear.uz') {
          return `https://libertywear.uz${path}`;
        }
        
        // Если админка на localhost, используем localhost:8000
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return `http://localhost:8000${path}`;
        }
        
        // Иначе используем тот же протокол и хост с портом из исходного URL
        const protocol = window.location.protocol;
        if (port) {
          return `${protocol}//${hostname}:${port}${path}`;
        }
        return `${protocol}//${hostname}${path}`;
      }
      return url;
    }
    
    // Если URL относительный, добавляем правильный базовый URL
    if (url.startsWith('/')) {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      if (hostname === 'admin.libertywear.uz') {
        return `https://libertywear.uz${url}`;
      }
      
      // Для localhost используем localhost:8000
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:8000${url}`;
      }
      
      return `${protocol}//${hostname}${url}`;
    }
    
    // Иначе добавляем /uploads/ если нужно
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname === 'admin.libertywear.uz') {
      return `https://libertywear.uz/${url}`;
    }
    
    // Для localhost используем localhost:8000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:8000/${url}`;
    }
    
    return `${protocol}//${hostname}/${url}`;
  } catch (error) {
    console.error('Error processing image URL:', error, url);
    return url; // Возвращаем исходный URL при ошибке
  }
};

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [showPartnersBlock, setShowPartnersBlock] = useState(true);
  const [loadingBlockSetting, setLoadingBlockSetting] = useState(true);
  const [savingBlockSetting, setSavingBlockSetting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchPartners();
    fetchPartnersBlockSetting();
  }, []);

  const fetchPartnersBlockSetting = async () => {
    try {
      setLoadingBlockSetting(true);
      const res = await axios.get(`${BASE_URL}/site-settings/value/show_partners_block`);
      if (res.data && res.data.value) {
        const value = res.data.value.toLowerCase();
        setShowPartnersBlock(value === "true" || value === "1");
      } else {
        setShowPartnersBlock(true); // По умолчанию включено
      }
    } catch (error) {
      console.error('Error fetching partners block setting:', error);
      // Если 404, значит настройка еще не создана, используем значение по умолчанию
      if (error.response?.status === 404) {
        console.log('Setting not found, using default: true');
        setShowPartnersBlock(true);
      } else {
        setShowPartnersBlock(true); // По умолчанию включено при ошибке
      }
    } finally {
      setLoadingBlockSetting(false);
    }
  };

  const handleTogglePartnersBlock = async (e) => {
    const newValue = e.target.checked;
    const oldValue = showPartnersBlock;
    setShowPartnersBlock(newValue);
    
    try {
      setSavingBlockSetting(true);
      // Используем PUT для обновления или создания настройки
      await axios.put(`${BASE_URL}/site-settings/show_partners_block`, {
        value: newValue ? "true" : "false"
      });
      toast({
        title: 'Успешно',
        description: newValue 
          ? 'Блок партнеров включен на главной странице' 
          : 'Блок партнеров выключен на главной странице',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error updating partners block setting:', error);
      console.error('Error details:', error.response?.data);
      // Откатываем изменение при ошибке
      setShowPartnersBlock(oldValue);
      const errorMessage = error.response?.data?.detail || error.message || 'Не удалось обновить настройку';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSavingBlockSetting(false);
    }
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/partners/`);
      setPartners(res.data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Не удалось загрузить партнеров';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      order: partners.length,
      is_active: true,
    });
    setEditingId(null);
    onOpen();
  };

  const handleEdit = (partner) => {
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url || '',
      order: partner.order || 0,
      is_active: partner.is_active !== false,
    });
    setEditingId(partner.id);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого партнера?')) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/partners/${id}`);
      toast({
        title: 'Успешно',
        description: 'Партнер удален',
        status: 'success',
        duration: 2000,
      });
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить партнера',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.logo_url) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и URL логотипа',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${BASE_URL}/partners/${editingId}`, formData);
        toast({
          title: 'Успешно',
          description: 'Партнер обновлен',
          status: 'success',
          duration: 2000,
        });
      } else {
        await axios.post(`${BASE_URL}/partners/`, formData);
        toast({
          title: 'Успешно',
          description: 'Партнер добавлен',
          status: 'success',
          duration: 2000,
        });
      }
      onClose();
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось сохранить партнера',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, partnerId = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      if (partnerId) {
        setUploadingId(partnerId);
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const uploadRes = await axios.post(`${BASE_URL}/upload/image`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let imageUrl = uploadRes.data.url || uploadRes.data.file_url;
      // Если URL относительный, добавляем BASE_URL
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = imageUrl.startsWith('/') ? `${BASE_URL}${imageUrl}` : `${BASE_URL}/${imageUrl}`;
      }

      if (partnerId) {
        // Обновляем существующего партнера
        await axios.put(`${BASE_URL}/partners/${partnerId}`, {
          logo_url: imageUrl,
        });
        toast({
          title: 'Успешно',
          description: 'Логотип обновлен',
          status: 'success',
          duration: 2000,
        });
        fetchPartners();
      } else {
        // Обновляем форму
        setFormData({ ...formData, logo_url: imageUrl });
        toast({
          title: 'Успешно',
          description: 'Изображение загружено',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображение',
        status: 'error',
        duration: 3000,
      });
    } finally {
      if (partnerId) {
        setUploadingId(null);
      }
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" padding="40px">
        <Spinner size="xl" color="black" />
        <Text mt="20px" color="gray.600">Загрузка партнеров...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="30px">
        <Heading
          fontSize={{ base: "20px", md: "26px" }}
          fontWeight="400"
          letterSpacing="0.5px"
        >
          Наши партнёры
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          bg="black"
          color="white"
          borderRadius="0"
          fontSize="12px"
          fontWeight="400"
          letterSpacing="1px"
          textTransform="uppercase"
          _hover={{ bg: "gray.800" }}
          onClick={handleAdd}
        >
          Добавить партнера
        </Button>
      </Flex>

      {/* Настройка показа блока партнеров на главной странице */}
      <Box 
        bg="white" 
        border="1px solid" 
        borderColor="#e5e5e5" 
        borderRadius="20px" 
        p="20px" 
        mb="30px"
      >
        <HStack justify="space-between" align="center" spacing="20px" width="100%">
          <VStack align="flex-start" spacing="5px" flex="1">
            <Text 
              fontSize="13px" 
              fontWeight="500" 
              letterSpacing="0.5px" 
              textTransform="uppercase"
            >
              Показывать блок партнеров на главной странице
            </Text>
            <Text 
              fontSize="11px" 
              color="gray.600"
            >
              {showPartnersBlock 
                ? 'Блок партнеров отображается на главной странице' 
                : 'Блок партнеров скрыт на главной странице'}
            </Text>
          </VStack>
          <Box flexShrink={0} minW="60px" display="flex" justifyContent="flex-end" alignItems="center">
            {loadingBlockSetting ? (
              <Spinner size="md" color="black" />
            ) : (
              <Switch
                isChecked={showPartnersBlock}
                onChange={handleTogglePartnersBlock}
                colorScheme="black"
                size="lg"
                isDisabled={savingBlockSetting}
                sx={{
                  '& .chakra-switch__track': {
                    bg: showPartnersBlock ? 'black !important' : 'gray.300 !important',
                    border: '2px solid',
                    borderColor: showPartnersBlock ? 'black' : 'gray.400',
                  },
                  '& .chakra-switch__thumb': {
                    bg: 'white !important',
                    border: '2px solid',
                    borderColor: showPartnersBlock ? 'black' : 'gray.400',
                  },
                  '&:hover .chakra-switch__track': {
                    bg: showPartnersBlock ? 'gray.800 !important' : 'gray.400 !important',
                  },
                }}
              />
            )}
          </Box>
        </HStack>
      </Box>

      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Логотип</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Название</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>Ссылка</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Порядок</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Статус</Th>
              <Th fontSize={{ base: "10px", md: "11px" }} fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {partners.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center" py="40px" color="gray.500">
                  Нет партнеров. Добавьте первого партнера.
                </Td>
              </Tr>
            ) : (
              partners.map((partner) => (
                <Tr key={partner.id}>
                  <Td borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>
                    <Box position="relative" display="inline-block">
                      {partner.logo_url ? (
                        <Image
                          src={getImageUrl(partner.logo_url)}
                          alt={partner.name}
                          maxH="50px"
                          maxW="100px"
                          objectFit="contain"
                          borderRadius="4px"
                          onError={(e) => {
                            console.error('Error loading image:', getImageUrl(partner.logo_url));
                            e.target.style.display = 'none';
                            // Показываем fallback
                            const fallback = e.target.nextSibling;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                          fallback={
                            <Box
                              width="100px"
                              height="50px"
                              bg="gray.100"
                              borderRadius="4px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="10px"
                              color="gray.400"
                            >
                              Нет изображения
                            </Box>
                          }
                        />
                      ) : (
                        <Box
                          width="100px"
                          height="50px"
                          bg="gray.100"
                          borderRadius="4px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="10px"
                          color="gray.400"
                        >
                          Нет изображения
                        </Box>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`upload-${partner.id}`}
                        onChange={(e) => handleImageUpload(e, partner.id)}
                      />
                      <IconButton
                        icon={<FiUpload />}
                        size="xs"
                        aria-label="Загрузить логотип"
                        position="absolute"
                        top="-5px"
                        right="-5px"
                        bg="black"
                        color="white"
                        borderRadius="50%"
                        _hover={{ bg: "gray.800" }}
                        onClick={() => document.getElementById(`upload-${partner.id}`).click()}
                        isLoading={uploadingId === partner.id}
                      />
                    </Box>
                  </Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} fontWeight="500" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>
                    {partner.name}
                  </Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }} display={{ base: "none", md: "table-cell" }}>
                    {partner.website_url ? (
                      <a href={partner.website_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                        {partner.website_url}
                      </a>
                    ) : (
                      <Text color="gray.400">—</Text>
                    )}
                  </Td>
                  <Td borderColor="#e5e5e5" fontSize={{ base: "12px", md: "13px" }} py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>
                    {partner.order}
                  </Td>
                  <Td borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>
                    <Badge colorScheme={partner.is_active ? 'green' : 'gray'}>
                      {partner.is_active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </Td>
                  <Td borderColor="#e5e5e5" py={{ base: "10px", md: "15px" }} px={{ base: "10px", md: "20px" }}>
                    <HStack spacing="10px">
                      <IconButton
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                        aria-label="Редактировать"
                        onClick={() => handleEdit(partner)}
                        _hover={{ bg: "gray.100" }}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        aria-label="Удалить"
                        onClick={() => handleDelete(partner.id)}
                        _hover={{ bg: "red.50", color: "red.500" }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Modal для добавления/редактирования */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="20px">
          <ModalHeader fontSize="13px" fontWeight="500" letterSpacing="0.3px" textTransform="uppercase">
            {editingId ? 'Редактировать партнера' : 'Добавить партнера'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing="20px" align="stretch">
              <FormControl>
                <FormLabel fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" mb="8px">
                  Название партнера
                </FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  paddingY="12px"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" mb="8px">
                  URL логотипа
                </FormLabel>
                <HStack spacing="10px">
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    borderRadius="0"
                    borderColor="black"
                    borderBottom="1px solid"
                    borderTop="none"
                    borderLeft="none"
                    borderRight="none"
                    _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                    paddingY="12px"
                    flex="1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-logo"
                    onChange={(e) => handleImageUpload(e)}
                  />
                  <Button
                    leftIcon={<FiUpload />}
                    onClick={() => document.getElementById('upload-logo').click()}
                    borderRadius="0"
                    fontSize="11px"
                    fontWeight="400"
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    border="1px solid"
                    borderColor="black"
                    bg="white"
                    _hover={{ bg: "gray.50" }}
                  >
                    Загрузить
                  </Button>
                </HStack>
                {formData.logo_url && (
                  <Box mt="10px">
                    <Image
                      src={getImageUrl(formData.logo_url)}
                      alt="Preview"
                      maxH="100px"
                      maxW="200px"
                      objectFit="contain"
                      borderRadius="4px"
                      border="1px solid"
                      borderColor="#e5e5e5"
                      p="10px"
                      fallback={
                        <Box
                          width="200px"
                          height="100px"
                          bg="gray.100"
                          borderRadius="4px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="10px"
                          color="gray.400"
                        >
                          Не удалось загрузить изображение
                        </Box>
                      }
                      onError={(e) => {
                        console.error('Error loading preview image:', getImageUrl(formData.logo_url));
                      }}
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" mb="8px">
                  Ссылка на сайт (опционально)
                </FormLabel>
                <Input
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                  borderRadius="0"
                  borderColor="black"
                  borderBottom="1px solid"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                  paddingY="12px"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" mb="8px">
                  Порядок отображения
                </FormLabel>
                <NumberInput
                  value={formData.order}
                  onChange={(valueString) => setFormData({ ...formData, order: parseInt(valueString) || 0 })}
                  min={0}
                >
                  <NumberInputField
                    borderRadius="0"
                    borderColor="black"
                    borderBottom="1px solid"
                    borderTop="none"
                    borderLeft="none"
                    borderRight="none"
                    _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                    paddingY="12px"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel fontSize="11px" fontWeight="500" letterSpacing="0.5px" textTransform="uppercase" mb="0" mr="10px">
                  Активен
                </FormLabel>
                <Switch
                  isChecked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  colorScheme="black"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTop="1px solid #e5e5e5" paddingY="20px">
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              borderRadius="0"
              fontSize="11px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
            >
              Отмена
            </Button>
            <Button
              leftIcon={<FiSave />}
              bg="black"
              color="white"
              borderRadius="0"
              fontSize="11px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              _hover={{ bg: "gray.800" }}
              onClick={handleSave}
              isLoading={saving}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Partners;

