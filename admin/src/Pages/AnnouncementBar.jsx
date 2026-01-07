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
} from '@chakra-ui/react';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const AnnouncementBar = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [translations, setTranslations] = useState({
    ru: 'ПОЛУЧИТЕ 50% СКИДКУ ТОЛЬКО СЕГОДНЯ!',
    uz: 'BUGUN 50% CHEGIRMA OLING!',
    en: 'GET 50% OFF TODAY ONLY!',
    es: '¡OBTÉN 50% DE DESCUENTO SOLO HOY!'
  });
  const toast = useToast();

  useEffect(() => {
    fetchAnnouncementBar();
  }, []);

  const fetchAnnouncementBar = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/site-settings/announcement_bar_text`);
      
      if (response.data && response.data.value) {
        try {
          const parsed = JSON.parse(response.data.value);
          setTranslations(parsed);
        } catch (e) {
          // If not JSON, use as is
          setTranslations({
            ru: response.data.value,
            uz: response.data.value,
            en: response.data.value,
            es: response.data.value
          });
        }
      }

      // Check if announcement bar is active
      const activeResponse = await axios.get(`${BASE_URL}/site-settings/announcement_bar_active`).catch(() => null);
      if (activeResponse && activeResponse.data) {
        setIsActive(activeResponse.data.value === 'true');
      }
    } catch (error) {
      console.error('Error fetching announcement bar:', error);
      // Use default values if not found
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save translations as JSON
      const translationsJson = JSON.stringify(translations);
      await axios.put(`${BASE_URL}/site-settings/announcement_bar_text`, {
        value: translationsJson,
        description: 'Announcement bar text with translations'
      });

      // Save active status
      await axios.put(`${BASE_URL}/site-settings/announcement_bar_active`, {
        value: isActive ? 'true' : 'false',
        description: 'Announcement bar visibility'
      });

      toast({
        title: 'Успешно',
        description: 'Баннер обновлен',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving announcement bar:', error);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось сохранить баннер',
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
        Баннер объявления
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
              Текст баннера (переводы на 4 языка)
            </FormLabel>
            <Text fontSize="11px" color="gray.500" mb="10px">
              Текст, который будет отображаться в баннере наверху сайта.
            </Text>
            <TranslationFields
              value={translations}
              onChange={(newTranslations) => setTranslations(newTranslations)}
              placeholder="GET 50% OFF TODAY ONLY!"
            />
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

export default AnnouncementBar;

