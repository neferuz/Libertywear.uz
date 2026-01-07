import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
} from '@chakra-ui/react';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const PromoBanner = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    tag_translations: {
      ru: 'ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ',
      uz: 'CHEKLANGAN TAKLIF',
      en: 'LIMITED OFFER',
      es: 'OFERTA LIMITADA'
    },
    title_translations: {
      ru: 'ЗИМНЯЯ РАСПРОДАЖА',
      uz: 'QISH SOTILISHI',
      en: 'WINTER SALE',
      es: 'VENTA DE INVIERNO'
    },
    subtitle_translations: {
      ru: 'ДО 70% СКИДКА',
      uz: '70% GACHA CHEGIRMA',
      en: 'UP TO 70% OFF',
      es: 'HASTA 70% DE DESCUENTO'
    },
    description_translations: {
      ru: 'Не упустите нашу самую большую распродажу сезона. Премиальное качество одежды и аксессуаров по непревзойденным ценам.',
      uz: 'Mavsumning eng katta sotilishini o\'tkazib yubormang. Noo\'rin narxlarda premium sifatli kiyim va aksessuarlar.',
      en: 'Don\'t miss our biggest sale of the season. Premium quality clothing and accessories at unbeatable prices.',
      es: 'No te pierdas nuestra mayor venta de la temporada. Ropa y accesorios de calidad premium a precios insuperables.'
    },
    button_text_translations: {
      ru: 'КУПИТЬ СЕЙЧАС',
      uz: 'HOZIR SOTIB OLING',
      en: 'SHOP NOW',
      es: 'COMPRAR AHORA'
    },
    button_link: '/category/women',
    image_url: 'https://images.unsplash.com/photo-1614714053570-6c6b6aa54a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2xvdGhpbmclMjBjYW1wYWlnbiUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzY3MTMxOTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  });
  const toast = useToast();

  useEffect(() => {
    fetchPromoBanner();
  }, []);

  const fetchPromoBanner = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/site-settings/promo_banner_data`);
      
      if (response.data && response.data.value) {
        try {
          const parsed = JSON.parse(response.data.value);
          setFormData({
            tag_translations: parsed.tag_translations || formData.tag_translations,
            title_translations: parsed.title_translations || formData.title_translations,
            subtitle_translations: parsed.subtitle_translations || formData.subtitle_translations,
            description_translations: parsed.description_translations || formData.description_translations,
            button_text_translations: parsed.button_text_translations || formData.button_text_translations,
            button_link: parsed.button_link || formData.button_link,
            image_url: parsed.image_url || formData.image_url,
          });
          setIsActive(parsed.is_active !== false);
        } catch (e) {
          console.error('Error parsing promo banner data:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching promo banner:', error);
      // Use default values if not found
    } finally {
      setLoading(false);
    }
  };

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
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axios.post(`${BASE_URL}/upload/image`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${BASE_URL}${response.data.url}`;
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));

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
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const dataToSave = {
        ...formData,
        is_active: isActive
      };
      
      const dataJson = JSON.stringify(dataToSave);
      await axios.put(`${BASE_URL}/site-settings/promo_banner_data`, {
        value: dataJson,
        description: 'Promo banner data with translations and image'
      });

      toast({
        title: 'Успешно',
        description: 'Промо-баннер обновлен',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving promo banner:', error);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось сохранить промо-баннер',
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
      <Heading
        fontSize={{ base: "20px", sm: "24px", md: "32px" }}
        fontWeight="400"
        letterSpacing="1px"
        textTransform="uppercase"
        mb={{ base: "20px", md: "30px" }}
      >
        Промо-баннер
      </Heading>

      <Box
        bg="white"
        border="1px solid"
        borderColor="#e5e5e5"
        borderRadius="20px"
        p={{ base: "30px", md: "40px" }}
      >
        <VStack spacing="20px" align="stretch">
          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Тег/Метка (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Например: "ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ"
            </Text>
            <TranslationFields
              value={formData.tag_translations}
              onChange={(translations) => setFormData({ ...formData, tag_translations: translations })}
              placeholder="LIMITED OFFER"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Заголовок (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Основной заголовок, например: "ЗИМНЯЯ РАСПРОДАЖА"
            </Text>
            <TranslationFields
              value={formData.title_translations}
              onChange={(translations) => setFormData({ ...formData, title_translations: translations })}
              placeholder="WINTER SALE"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Подзаголовок (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Подзаголовок, например: "ДО 70% СКИДКА"
            </Text>
            <TranslationFields
              value={formData.subtitle_translations}
              onChange={(translations) => setFormData({ ...formData, subtitle_translations: translations })}
              placeholder="UP TO 70% OFF"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Описание (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Описание промо-акции
            </Text>
            <TranslationFields
              value={formData.description_translations}
              onChange={(translations) => setFormData({ ...formData, description_translations: translations })}
              placeholder="Don't miss our biggest sale..."
              isTextarea
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Текст кнопки (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Текст на кнопке, например: "КУПИТЬ СЕЙЧАС"
            </Text>
            <TranslationFields
              value={formData.button_text_translations}
              onChange={(translations) => setFormData({ ...formData, button_text_translations: translations })}
              placeholder="SHOP NOW"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Ссылка кнопки
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              URL, на который будет вести кнопка (например, /category/women)
            </Text>
            <Input
              value={formData.button_link}
              onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
              borderRadius="20px"
              borderColor="#e5e5e5"
              _focus={{ borderColor: "black", boxShadow: "none" }}
              placeholder="/category/women"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Изображение
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Рекомендуемый размер: 1080x600px
            </Text>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab fontSize="11px">URL</Tab>
                <Tab fontSize="11px">Загрузить файл</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p="15px 0">
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
                  {uploading && <Text fontSize="12px" mt="10px">Загрузка...</Text>}
                </TabPanel>
              </TabPanels>
            </Tabs>
            {formData.image_url && (
              <Image
                src={formData.image_url}
                alt="Preview"
                maxH="200px"
                mt="15px"
                objectFit="contain"
              />
            )}
          </FormControl>

          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase" mb="0">
              Показывать баннер
            </FormLabel>
            <Box
              onClick={() => setIsActive(!isActive)}
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="40px"
              h="24px"
              borderRadius="12px"
              border="2px solid"
              borderColor={isActive ? "black" : "#e5e5e5"}
              bg={isActive ? "black" : "white"}
              transition="all 0.2s"
              position="relative"
              _hover={{
                borderColor: "black",
                bg: isActive ? "gray.800" : "gray.50",
              }}
            >
              <Box
                position="absolute"
                left={isActive ? "20px" : "2px"}
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
                {isActive ? (
                  <Box
                    as="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </Box>
                ) : (
                  <Box
                    as="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </Box>
                )}
              </Box>
            </Box>
          </FormControl>

          <HStack spacing="15px" justify="flex-end" pt="10px">
            <Button
              bg="black"
              color="white"
              borderRadius="20px"
              onClick={handleSave}
              isLoading={saving}
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
      </Box>
    </Box>
  );
};

export default PromoBanner;

