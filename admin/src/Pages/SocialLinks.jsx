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
  Select,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import * as FiIcons from 'react-icons/fi';
import { FiSave, FiPlus, FiTrash2, FiLink, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import { getSocialIcon, availableIcons } from '../utils/socialIcons';

const SocialLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState(null);
  const { isOpen: isIconPreviewOpen, onOpen: onIconPreviewOpen, onClose: onIconPreviewClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/social-links/`);
      const loadedLinks = (res.data.links || []).map(link => ({
        ...link,
        // Автоматически определяем иконку, если не указана
        icon: link.icon || getSocialIcon(link.name, link.url),
        iconType: link.iconType || (link.iconUrl ? 'custom' : 'default'),
        iconUrl: link.iconUrl || ''
      }));
      setLinks(loadedLinks);
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
    setLinks([...links, { name: '', url: '', icon: 'FiLink', iconUrl: '', iconType: 'default' }]);
  };

  const handleIconFileUpload = async (e, index) => {
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

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 2MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${BASE_URL}${response.data.url}`;
      const newLinks = [...links];
      newLinks[index].iconUrl = imageUrl;
      newLinks[index].iconType = 'custom';
      setLinks(newLinks);
      
      toast({
        title: "Успешно",
        description: "Иконка загружена",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось загрузить иконку",
        status: "error",
        duration: 3000,
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleIconUrlChange = (index, url) => {
    const newLinks = [...links];
    newLinks[index].iconUrl = url;
    newLinks[index].iconType = url ? 'custom' : 'default';
    setLinks(newLinks);
  };

  const handleIconSelect = (index, iconName) => {
    const newLinks = [...links];
    newLinks[index].icon = iconName;
    newLinks[index].iconType = 'default';
    newLinks[index].iconUrl = '';
    setLinks(newLinks);
  };
  
  const getIconComponent = (iconName) => {
    const IconComponent = FiIcons[iconName] || FiLink;
    return IconComponent;
  };

  const handleRemove = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    
    // Автоматически определяем иконку при изменении названия или URL, если иконка не была выбрана вручную
    if ((field === 'name' || field === 'url') && !newLinks[index].icon) {
      const autoIcon = getSocialIcon(newLinks[index].name, newLinks[index].url);
      newLinks[index].icon = autoIcon;
    }
    
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
        .map(link => {
          // Автоматически определяем иконку, если не указана и не используется кастомная
          let icon = link.icon || getSocialIcon(link.name, link.url);
          const result = {
            name: link.name.trim(),
            url: link.url.trim(),
            icon: icon,
          };
          
          // Если используется кастомная иконка (URL или загруженный файл)
          if (link.iconType === 'custom' && link.iconUrl) {
            result.iconUrl = link.iconUrl.trim();
            result.iconType = 'custom';
          } else {
            result.iconType = 'default';
          }
          
          return result;
        })
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
                {/* Иконка */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="50px"
                  height="50px"
                  borderRadius="50%"
                  bg={link.iconType === 'custom' && link.iconUrl ? "transparent" : "black"}
                  color="white"
                  flexShrink={0}
                  overflow="hidden"
                  cursor={link.iconType === 'custom' && link.iconUrl ? "pointer" : "default"}
                  onClick={() => {
                    if (link.iconType === 'custom' && link.iconUrl) {
                      setIconPreviewUrl(link.iconUrl);
                      onIconPreviewOpen();
                    }
                  }}
                >
                  {link.iconType === 'custom' && link.iconUrl ? (
                    <Image
                      src={link.iconUrl}
                      alt={link.name || 'Icon'}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  ) : (
                    <Icon
                      as={getIconComponent(link.icon || getSocialIcon(link.name, link.url))}
                      boxSize="24px"
                    />
                  )}
                </Box>
                
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
                    mb={{ base: "8px", md: "10px" }}
                  />
                  
                  {/* Выбор типа иконки */}
                  <Tabs
                    index={link.iconType === 'custom' ? 1 : 0}
                    onChange={(idx) => {
                      const newLinks = [...links];
                      if (idx === 0) {
                        newLinks[index].iconType = 'default';
                        newLinks[index].iconUrl = '';
                        newLinks[index].icon = newLinks[index].icon || getSocialIcon(newLinks[index].name, newLinks[index].url);
                      } else {
                        newLinks[index].iconType = 'custom';
                      }
                      setLinks(newLinks);
                    }}
                    mb={{ base: "8px", md: "10px" }}
                  >
                    <TabList>
                      <Tab fontSize="11px" px="12px" py="6px">Иконка из списка</Tab>
                      <Tab fontSize="11px" px="12px" py="6px">Своя иконка</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel px="0" pt="10px">
                        <Select
                          value={link.icon || getSocialIcon(link.name, link.url)}
                          onChange={(e) => handleIconSelect(index, e.target.value)}
                          borderRadius="20px"
                          borderColor="#e5e5e5"
                          _focus={{ borderColor: "black", boxShadow: "none" }}
                          fontSize={{ base: "13px", md: "14px" }}
                        >
                          {availableIcons.map((iconOption) => (
                            <option key={iconOption.value} value={iconOption.value}>
                              {iconOption.name}
                            </option>
                          ))}
                        </Select>
                      </TabPanel>
                      <TabPanel px="0" pt="10px">
                        <Tabs>
                          <TabList>
                            <Tab fontSize="10px" px="10px" py="4px"><Icon as={FiLink} mr="5px" />URL</Tab>
                            <Tab fontSize="10px" px="10px" py="4px"><Icon as={FiUpload} mr="5px" />Файл</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel px="0" pt="10px">
                              <Input
                                placeholder="Введите URL иконки"
                                value={link.iconUrl || ''}
                                onChange={(e) => handleIconUrlChange(index, e.target.value)}
                                borderRadius="20px"
                                borderColor="#e5e5e5"
                                _focus={{ borderColor: "black", boxShadow: "none" }}
                                fontSize={{ base: "13px", md: "14px" }}
                              />
                            </TabPanel>
                            <TabPanel px="0" pt="10px">
                              <Input
                                type="file"
                                accept="image/*"
                                display="none"
                                id={`icon-upload-${index}`}
                                onChange={(e) => handleIconFileUpload(e, index)}
                              />
                              <Button
                                as="label"
                                htmlFor={`icon-upload-${index}`}
                                leftIcon={<FiUpload />}
                                isLoading={uploadingIndex === index}
                                loadingText="Загрузка..."
                                cursor="pointer"
                                w="100%"
                                borderRadius="20px"
                                fontSize={{ base: "12px", md: "13px" }}
                                bg="black"
                                color="white"
                                _hover={{ bg: "gray.800" }}
                              >
                                Выбрать файл
                              </Button>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
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

      {/* Модальное окно для просмотра иконки в полном размере */}
      <Modal isOpen={isIconPreviewOpen} onClose={onIconPreviewClose} isCentered size="md">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="20px" maxW="500px">
          <ModalCloseButton />
          <ModalBody p="20px" textAlign="center">
            {iconPreviewUrl && (
              <Image
                src={iconPreviewUrl}
                alt="Icon preview"
                maxH="400px"
                mx="auto"
                borderRadius="10px"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SocialLinks;
