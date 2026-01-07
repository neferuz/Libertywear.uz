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
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const StoreLocation = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address_translations: {
      ru: '123 Fashion Avenue\nNew York, NY 10001\nUnited States',
      uz: '123 Fashion Avenue\nNew York, NY 10001\nUnited States',
      en: '123 Fashion Avenue\nNew York, NY 10001\nUnited States',
      es: '123 Fashion Avenue\nNew York, NY 10001\nUnited States'
    },
    hours_translations: {
      ru: 'Понедельник - Пятница: 9:00 - 20:00\nСуббота: 10:00 - 18:00\nВоскресенье: 12:00 - 17:00',
      uz: 'Dushanba - Juma: 9:00 - 20:00\nShanba: 10:00 - 18:00\nYakshanba: 12:00 - 17:00',
      en: 'Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 12:00 PM - 5:00 PM',
      es: 'Lunes - Viernes: 9:00 AM - 8:00 PM\nSábado: 10:00 AM - 6:00 PM\nDomingo: 12:00 PM - 5:00 PM'
    },
    map_latitude: '40.75889597932681',
    map_longitude: '-73.98811768459398',
    map_zoom: '15'
  });
  const toast = useToast();

  useEffect(() => {
    fetchStoreLocation();
  }, []);

  const fetchStoreLocation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/site-settings/value/store_location_data`);
      
      if (response.data && response.data.value) {
        try {
          const parsed = JSON.parse(response.data.value);
          setFormData({
            address_translations: parsed.address_translations || formData.address_translations,
            hours_translations: parsed.hours_translations || formData.hours_translations,
            map_latitude: parsed.map_latitude || formData.map_latitude,
            map_longitude: parsed.map_longitude || formData.map_longitude,
            map_zoom: parsed.map_zoom || formData.map_zoom,
          });
        } catch (e) {
          console.error('Error parsing store location data:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching store location:', error);
      // Use default values if not found
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const dataToSave = {
        ...formData
      };
      
      const dataJson = JSON.stringify(dataToSave);
      await axios.put(`${BASE_URL}/site-settings/store_location_data`, {
        value: dataJson,
        description: 'Store location data with address, hours, and map coordinates'
      });

      toast({
        title: 'Успешно',
        description: 'Данные магазина обновлены',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving store location:', error);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось сохранить данные магазина',
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
        Местоположение магазина
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
              Адрес магазина (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Введите адрес магазина. Каждая строка должна быть на новой строке (используйте Enter для переноса).
            </Text>
            <Box mb={4}>
              <TranslationFields
                value={formData.address_translations}
                onChange={(translations) => setFormData({ ...formData, address_translations: translations })}
                placeholder="123 Fashion Avenue\nNew York, NY 10001\nUnited States"
                isTextarea={true}
                label=""
              />
            </Box>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Часы работы (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Введите часы работы магазина. Каждый день должен быть на новой строке (используйте Enter для переноса).
            </Text>
            <Box mb={4}>
              <TranslationFields
                value={formData.hours_translations}
                onChange={(translations) => setFormData({ ...formData, hours_translations: translations })}
                placeholder="Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 12:00 PM - 5:00 PM"
                isTextarea={true}
                label=""
              />
            </Box>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Широта карты (Latitude)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Координата широты для точки на карте (например: 40.75889597932681)
            </Text>
            <Input
              value={formData.map_latitude}
              onChange={(e) => setFormData({ ...formData, map_latitude: e.target.value })}
              borderRadius="20px"
              borderColor="#e5e5e5"
              _focus={{ borderColor: "black", boxShadow: "none" }}
              placeholder="40.75889597932681"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Долгота карты (Longitude)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Координата долготы для точки на карте (например: -73.98811768459398)
            </Text>
            <Input
              value={formData.map_longitude}
              onChange={(e) => setFormData({ ...formData, map_longitude: e.target.value })}
              borderRadius="20px"
              borderColor="#e5e5e5"
              _focus={{ borderColor: "black", boxShadow: "none" }}
              placeholder="-73.98811768459398"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="12px" fontWeight="400" letterSpacing="0.5px" textTransform="uppercase">
              Масштаб карты (Zoom)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Уровень масштабирования карты (от 1 до 20, рекомендуется 15)
            </Text>
            <Input
              type="number"
              min="1"
              max="20"
              value={formData.map_zoom}
              onChange={(e) => setFormData({ ...formData, map_zoom: e.target.value })}
              borderRadius="20px"
              borderColor="#e5e5e5"
              _focus={{ borderColor: "black", boxShadow: "none" }}
              placeholder="15"
            />
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

export default StoreLocation;

