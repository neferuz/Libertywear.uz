import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useToast,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus, FiArrowUp, FiArrowDown, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const Settings = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/slider/?active_only=false`);
      console.log('📥 Получены слайды:', res.data);
      const sortedSlides = (res.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setSlides(sortedSlides);
    } catch (error) {
      console.error('Error fetching slides:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || error.message || 'Не удалось загрузить слайды',
        status: 'error',
        duration: 3000,
      });
      // Устанавливаем пустой массив при ошибке
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот слайд?')) return;

    try {
      await axios.delete(`${BASE_URL}/slider/${id}`);
      toast({
        title: 'Успешно',
        description: 'Слайд удален',
        status: 'success',
        duration: 2000,
      });
      fetchSlides();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить слайд',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (slide) => {
    // Helper function to normalize translations
    const normalizeTranslations = (translations) => {
      if (!translations) return { ru: '', uz: '', en: '', es: '' };
      if (typeof translations === 'string') {
        try {
          const parsed = JSON.parse(translations || '{}');
          return {
            ru: parsed.ru || '',
            uz: parsed.uz || '',
            en: parsed.en || '',
            es: parsed.es || '',
          };
        } catch {
          return { ru: '', uz: '', en: '', es: '' };
        }
      }
      if (typeof translations === 'object') {
        return {
          ru: translations.ru || '',
          uz: translations.uz || '',
          en: translations.en || '',
          es: translations.es || '',
        };
      }
      return { ru: '', uz: '', en: '', es: '' };
    };

    // Ensure translations are objects, not strings
    const normalizedSlide = {
      ...slide,
      title_translations: normalizeTranslations(slide.title_translations),
      tag_translations: normalizeTranslations(slide.tag_translations),
      headline_translations: normalizeTranslations(slide.headline_translations),
      description_translations: normalizeTranslations(slide.description_translations),
      cta_text_translations: normalizeTranslations(slide.cta_text_translations),
    };
    setEditingSlide(normalizedSlide);
    onOpen();
  };

  const handleAdd = () => {
    setEditingSlide({
      title: '',
      image_url_desktop: '',
      image_url_mobile: '',
      title_translations: { ru: '', uz: '', en: '', es: '' },
      tag_translations: { ru: '', uz: '', en: '', es: '' },
      headline_translations: { ru: '', uz: '', en: '', es: '' },
      description_translations: { ru: '', uz: '', en: '', es: '' },
      cta_text_translations: { ru: '', uz: '', en: '', es: '' },
      cta_link: '',
      order: slides.length,
      is_active: true,
    });
    onOpen();
  };

  const handleOrderChange = async (id, direction) => {
    const slideIndex = slides.findIndex(s => s.id === id);
    if (slideIndex === -1) return;

    const newOrder = direction === 'up' ? slideIndex - 1 : slideIndex + 1;
    if (newOrder < 0 || newOrder >= slides.length) return;

    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(slideIndex, 1);
    updatedSlides.splice(newOrder, 0, movedSlide);

    // Обновляем порядок всех слайдов
    try {
      for (let i = 0; i < updatedSlides.length; i++) {
        await axios.put(`${BASE_URL}/slider/${updatedSlides[i].id}`, {
          ...updatedSlides[i],
          order: i,
        });
      }
      toast({
        title: 'Успешно',
        description: 'Порядок изменен',
        status: 'success',
        duration: 2000,
      });
      fetchSlides();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить порядок',
        status: 'error',
        duration: 3000,
      });
    }
  };

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
          Настройки слайдера
        </Heading>
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
          w={{ base: "100%", sm: "auto" }}
        >
          Добавить слайд
        </Button>
      </Flex>

      {loading ? (
        <Text>Загрузка...</Text>
      ) : slides.length === 0 ? (
        <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p={{ base: "30px", md: "40px" }} textAlign="center">
          <Text mb={{ base: "15px", md: "20px" }} fontSize={{ base: "14px", md: "16px" }}>Слайды не добавлены</Text>
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
            Добавить первый слайд
          </Button>
        </Box>
      ) : (
        <Box 
          bg="white" 
          border="1px solid" 
          borderColor="#e5e5e5" 
          overflowX="auto"
          borderRadius="20px"
        >
          <Table 
            variant="simple"
            sx={{
              '& thead tr th': {
                bg: '#fafafa',
                borderBottom: '2px solid #e5e5e5',
                py: '15px',
                px: '20px',
              },
              '& tbody tr': {
                borderBottom: '1px solid #f5f5f5',
                transition: 'all 0.2s',
                _hover: {
                  bg: '#fafafa',
                },
              },
              '& tbody tr td': {
                py: '20px',
                px: '20px',
                borderBottom: '1px solid #f5f5f5',
              },
            }}
          >
            <Thead>
              <Tr>
                <Th fontSize="11px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black">Порядок</Th>
                <Th fontSize="11px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black">Изображение</Th>
                <Th fontSize="11px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black">Название</Th>
                <Th fontSize="11px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black">Статус</Th>
                <Th fontSize="11px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" color="black">Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {slides.map((slide, index) => (
                <Tr key={slide.id}>
                  <Td>
                    <VStack spacing="5px">
                      <IconButton
                        icon={<FiArrowUp />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOrderChange(slide.id, 'up')}
                        isDisabled={index === 0}
                        aria-label="Вверх"
                        color="black"
                        _hover={{ bg: 'black', color: 'white' }}
                        _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
                      />
                      <Text fontSize="13px" fontWeight="500">{slide.order + 1}</Text>
                      <IconButton
                        icon={<FiArrowDown />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOrderChange(slide.id, 'down')}
                        isDisabled={index === slides.length - 1}
                        aria-label="Вниз"
                        color="black"
                        _hover={{ bg: 'black', color: 'white' }}
                        _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
                      />
                    </VStack>
                  </Td>
                  <Td>
                    <Box
                      w="120px"
                      h="70px"
                      borderRadius="4px"
                      overflow="hidden"
                      border="1px solid"
                      borderColor="#e5e5e5"
                      bg="#f5f5f5"
                    >
                      <Image
                        src={slide.image_url_desktop}
                        alt={slide.title || 'Slide'}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>
                  </Td>
                  <Td>
                    <Text fontSize="13px" fontWeight="400" color="black">
                      {slide.title || 'Без названия'}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={slide.is_active ? 'green' : 'gray'}
                      fontSize="11px"
                      px="12px"
                      py="4px"
                      borderRadius="0"
                      textTransform="uppercase"
                      letterSpacing="0.5px"
                      fontWeight="400"
                    >
                      {slide.is_active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing="8px">
                      <IconButton
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(slide)}
                        aria-label="Редактировать"
                        color="black"
                        _hover={{ bg: 'black', color: 'white' }}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(slide.id)}
                        aria-label="Удалить"
                        color="red.500"
                        _hover={{ bg: 'red.500', color: 'white' }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {editingSlide && (
        <SlideModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setEditingSlide(null);
          }}
          slide={editingSlide}
          onSave={() => {
            fetchSlides();
            onClose();
            setEditingSlide(null);
          }}
        />
      )}
    </Box>
  );
};

const SlideModal = ({ isOpen, onClose, slide, onSave }) => {
  const [formData, setFormData] = useState(slide);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  useEffect(() => {
    setFormData(slide);
  }, [slide]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите изображение',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Ошибка',
        description: 'Размер файла не должен превышать 5MB',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setUploadingDesktop(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${BASE_URL}${response.data.url}`;
      setFormData({ ...formData, image_url_desktop: imageUrl });

      toast({
        title: 'Успешно',
        description: 'Изображение загружено',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось загрузить изображение',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploadingDesktop(false);
    }
  };

  const handleSubmit = async () => {
    // Валидация
    if (!formData.image_url_desktop || !formData.image_url_desktop.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Изображение для десктопа обязательно',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      // Убираем пустые поля и формируем данные для отправки
      const dataToSend = {
        image_url_desktop: formData.image_url_desktop.trim(),
        order: formData.order || 0,
        is_active: formData.is_active,
      };

      // Добавляем мобильное изображение только если оно есть
      if (formData.image_url_mobile && formData.image_url_mobile.trim()) {
        dataToSend.image_url_mobile = formData.image_url_mobile.trim();
      }

      // Добавляем legacy title если есть
      if (formData.title && formData.title.trim()) {
        dataToSend.title = formData.title.trim();
      }

      // Добавляем переводы названия
      if (formData.title_translations) {
        const titleTranslations = Object.fromEntries(
          Object.entries(formData.title_translations).filter(([_, v]) => v && v.trim())
        );
        if (Object.keys(titleTranslations).length > 0) {
          dataToSend.title_translations = titleTranslations;
        }
      }

      // Добавляем переводы
      if (formData.tag_translations) {
        // Удаляем пустые значения
        const tagTranslations = Object.fromEntries(
          Object.entries(formData.tag_translations).filter(([_, v]) => v && v.trim())
        );
        if (Object.keys(tagTranslations).length > 0) {
          dataToSend.tag_translations = tagTranslations;
        }
      }

      if (formData.headline_translations) {
        const headlineTranslations = Object.fromEntries(
          Object.entries(formData.headline_translations).filter(([_, v]) => v && v.trim())
        );
        if (Object.keys(headlineTranslations).length > 0) {
          dataToSend.headline_translations = headlineTranslations;
        }
      }

      if (formData.description_translations) {
        const descriptionTranslations = Object.fromEntries(
          Object.entries(formData.description_translations).filter(([_, v]) => v && v.trim())
        );
        if (Object.keys(descriptionTranslations).length > 0) {
          dataToSend.description_translations = descriptionTranslations;
        }
      }

      if (formData.cta_text_translations) {
        const ctaTextTranslations = Object.fromEntries(
          Object.entries(formData.cta_text_translations).filter(([_, v]) => v && v.trim())
        );
        if (Object.keys(ctaTextTranslations).length > 0) {
          dataToSend.cta_text_translations = ctaTextTranslations;
        }
      }

      // Добавляем ссылку для кнопки
      if (formData.cta_link && formData.cta_link.trim()) {
        dataToSend.cta_link = formData.cta_link.trim();
      } else if (formData.link && formData.link.trim()) {
        dataToSend.link = formData.link.trim();
      }

      console.log('📤 Отправка данных:', JSON.stringify(dataToSend, null, 2));
      
      let response;
      if (slide.id) {
        response = await axios.put(`${BASE_URL}/slider/${slide.id}`, dataToSend);
        console.log('✅ Ответ от сервера (PUT):', response.data);
        console.log('🔍 Проверка переводов в ответе:');
        console.log('   - title_translations:', response.data.title_translations);
        console.log('   - tag_translations:', response.data.tag_translations);
        console.log('   - headline_translations:', response.data.headline_translations);
        toast({
          title: 'Успешно',
          description: 'Слайд обновлен',
          status: 'success',
          duration: 2000,
        });
      } else {
        response = await axios.post(`${BASE_URL}/slider/`, dataToSend);
        console.log('✅ Ответ от сервера (POST):', response.data);
        toast({
          title: 'Успешно',
          description: 'Слайд создан',
          status: 'success',
          duration: 2000,
        });
      }
      
      // Небольшая задержка перед обновлением списка
      setTimeout(() => {
        onSave();
      }, 500);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось сохранить слайд',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "xl" }}>
      <ModalOverlay />
      <ModalContent borderRadius={{ base: "0", sm: "20px" }} maxW={{ base: "100%", sm: "90%", md: "800px" }} mx={{ base: "0", sm: "auto" }}>
        <ModalHeader
          fontSize="16px"
          fontWeight="400"
          letterSpacing="0.5px"
          textTransform="uppercase"
        >
          {slide.id ? 'Редактировать слайд' : 'Добавить слайд'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="30px">
          <VStack spacing="20px" align="stretch">
            {/* Title Translations */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Название (переводы на 4 языка)
              </FormLabel>
              <TranslationFields
                fieldName="title"
                label="Название"
                value={formData.title_translations || { ru: '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData({ ...formData, title_translations: translations })}
                placeholder="Название слайда"
              />
            </FormControl>

            {/* Legacy Title Field */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Название (legacy, необязательно)
              </FormLabel>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                borderRadius="20px"
                borderColor="#e5e5e5"
                _focus={{ borderColor: "black", boxShadow: "none" }}
                placeholder="Введите название слайда (для обратной совместимости)"
              />
            </FormControl>

            {/* Tag Translations */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Тег/Метка (переводы на 4 языка)
              </FormLabel>
              <TranslationFields
                fieldName="tag"
                label="Тег/Метка"
                value={formData.tag_translations || { ru: '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData({ ...formData, tag_translations: translations })}
                placeholder="NEW COLLECTION"
              />
            </FormControl>

            {/* Headline Translations */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Заголовок (переводы на 4 языка)
              </FormLabel>
              <TranslationFields
                fieldName="headline"
                label="Заголовок"
                value={formData.headline_translations || { ru: '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData({ ...formData, headline_translations: translations })}
                placeholder="Новая коллекция"
              />
            </FormControl>

            {/* Description Translations */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Описание (переводы на 4 языка)
              </FormLabel>
              <TranslationFields
                fieldName="description"
                label="Описание"
                value={formData.description_translations || { ru: '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData({ ...formData, description_translations: translations })}
                placeholder="Откройте для себя нашу коллекцию"
                isTextarea
              />
            </FormControl>

            {/* CTA Text Translations */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Текст кнопки (переводы на 4 языка)
              </FormLabel>
              <TranslationFields
                fieldName="cta_text"
                label="Текст кнопки"
                value={formData.cta_text_translations || { ru: '', uz: '', en: '', es: '' }}
                onChange={(translations) => setFormData({ ...formData, cta_text_translations: translations })}
                placeholder="КУПИТЬ СЕЙЧАС"
              />
            </FormControl>

            {/* CTA Link */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Ссылка для кнопки
              </FormLabel>
              <Input
                value={formData.cta_link || formData.link || ''}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value, link: e.target.value })}
                borderRadius="20px"
                borderColor="#e5e5e5"
                _focus={{ borderColor: "black", boxShadow: "none" }}
                placeholder="/category/women или https://example.com"
              />
            </FormControl>

            {/* Desktop Image */}
            <FormControl isRequired>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Изображение для десктопа * (1920x600px)
              </FormLabel>
              <Tabs index={activeTab} onChange={setActiveTab}>
                <TabList>
                  <Tab fontSize="11px">URL</Tab>
                  <Tab fontSize="11px">Загрузить файл</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p="15px 0">
                    <Input
                      value={formData.image_url_desktop || ''}
                      onChange={(e) => setFormData({ ...formData, image_url_desktop: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      borderRadius="20px"
                      borderColor="#e5e5e5"
                      _focus={{ borderColor: "black", boxShadow: "none" }}
                    />
                  </TabPanel>
                  <TabPanel p="15px 0">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      borderRadius="20px"
                      borderColor="#e5e5e5"
                      _focus={{ borderColor: "black", boxShadow: "none" }}
                    />
                    {uploadingDesktop && <Text fontSize="12px" mt="10px">Загрузка...</Text>}
                  </TabPanel>
                </TabPanels>
              </Tabs>
              {formData.image_url_desktop && (
                <Image
                  src={formData.image_url_desktop}
                  alt="Preview"
                  maxH="200px"
                  mt="15px"
                  objectFit="contain"
                />
              )}
            </FormControl>

            {/* Mobile Image */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
                Изображение для мобильной версии (768x500px, необязательно)
              </FormLabel>
              <Input
                value={formData.image_url_mobile || ''}
                onChange={(e) => setFormData({ ...formData, image_url_mobile: e.target.value })}
                placeholder="https://example.com/image-mobile.jpg"
                borderRadius="20px"
                borderColor="#e5e5e5"
                _focus={{ borderColor: "black", boxShadow: "none" }}
              />
              {formData.image_url_mobile && (
                <Image
                  src={formData.image_url_mobile}
                  alt="Preview"
                  maxH="200px"
                  mt="15px"
                  objectFit="contain"
                />
              )}
            </FormControl>

            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" mb="0">
                Активен
              </FormLabel>
              <Box
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="40px"
                h="24px"
                borderRadius="12px"
                border="2px solid"
                borderColor={formData.is_active ? "black" : "#e5e5e5"}
                bg={formData.is_active ? "black" : "white"}
                transition="all 0.2s"
                position="relative"
                _hover={{
                  borderColor: "black",
                  bg: formData.is_active ? "gray.800" : "gray.50",
                }}
              >
                <Box
                  position="absolute"
                  left={formData.is_active ? "20px" : "2px"}
                  transition="left 0.2s"
                  w="18px"
                  h="18px"
                  borderRadius="50%"
                  bg="white"
                  border="1px solid"
                  borderColor="#e5e5e5"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {formData.is_active ? (
                    <Box
                      as={FiCheck}
                      fontSize="12px"
                      color="black"
                    />
                  ) : (
                    <Box
                      as={FiX}
                      fontSize="10px"
                      color="#999"
                    />
                  )}
                </Box>
              </Box>
            </FormControl>

            <HStack spacing="15px" justify="flex-end" pt="10px">
              <Button
                variant="outline"
                borderRadius="20px"
                borderColor="#e5e5e5"
                onClick={onClose}
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                _hover={{ borderColor: "black", bg: "#fafafa" }}
              >
                Отмена
              </Button>
              <Button
                bg="black"
                color="white"
                borderRadius="20px"
                onClick={handleSubmit}
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                _hover={{ bg: "gray.800" }}
              >
                Сохранить
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Settings;
