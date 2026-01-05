import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  Flex, 
  SimpleGrid,
  Input,
  Textarea,
  Icon,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Switch,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiUpload, FiLink } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const About = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sections, setSections] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [isSectionModal, setIsSectionModal] = useState(true);
  const [showTeamBlock, setShowTeamBlock] = useState(true);
  const [heroTitle, setHeroTitle] = useState({ ru: "О компании", uz: "", en: "", es: "" });
  const [heroDescription, setHeroDescription] = useState({ ru: "Liberty — это больше, чем просто бренд одежды. Это философия стиля, качества и индивидуальности.", uz: "", en: "", es: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sectionsRes, teamRes, teamSettingRes, heroTitleRes, heroDescRes] = await Promise.all([
        axios.get(`${BASE_URL}/pages/about/sections`),
        axios.get(`${BASE_URL}/pages/about/team`),
        axios.get(`${BASE_URL}/site-settings/value/show_team_block`).catch(() => ({ data: { value: "true" } })),
        axios.get(`${BASE_URL}/site-settings/value/about_hero_title`).catch(() => ({ data: { value: null } })),
        axios.get(`${BASE_URL}/site-settings/value/about_hero_description`).catch(() => ({ data: { value: null } }))
      ]);
      setSections(sectionsRes.data);
      setTeamMembers(teamRes.data);
      setShowTeamBlock(teamSettingRes.data.value === "true");
      
      // Загружаем hero переводы
      try {
        if (heroTitleRes.data.value) {
          const heroTitleTranslations = JSON.parse(heroTitleRes.data.value);
          setHeroTitle(heroTitleTranslations);
        }
        if (heroDescRes.data.value) {
          const heroDescTranslations = JSON.parse(heroDescRes.data.value);
          setHeroDescription(heroDescTranslations);
        }
      } catch (e) {
        console.error("Error parsing hero translations:", e);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (section) => {
    try {
      // Убеждаемся, что переводы включены и не пустые
      const sectionToSave = {
        ...section,
        title_translations: section.title_translations && Object.keys(section.title_translations).length > 0 
          ? section.title_translations 
          : { ru: section.title || '', uz: '', en: '', es: '' },
        description_translations: section.description_translations && Object.keys(section.description_translations).length > 0
          ? section.description_translations 
          : { ru: section.description || '', uz: '', en: '', es: '' }
      };
      
      console.log('Saving section:', sectionToSave);
      console.log('Title translations:', JSON.stringify(sectionToSave.title_translations));
      console.log('Description translations:', JSON.stringify(sectionToSave.description_translations));
      
      if (section.id) {
        const response = await axios.put(`${BASE_URL}/pages/about/sections/${section.id}`, sectionToSave);
        console.log('Response:', response.data);
        console.log('Response title_translations:', response.data?.title_translations);
        console.log('Response description_translations:', response.data?.description_translations);
        toast({ title: "Секция обновлена", status: "success", duration: 2000 });
      } else {
        const response = await axios.post(`${BASE_URL}/pages/about/sections`, sectionToSave);
        console.log('Response:', response.data);
        toast({ title: "Секция создана", status: "success", duration: 2000 });
      }
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving section:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      // Детальное сообщение об ошибке
      let errorMessage = error.message;
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }
      
      toast({ 
        title: "Ошибка сохранения", 
        description: errorMessage,
        status: "error", 
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleSaveMember = async (member) => {
    try {
      if (member.id) {
        await axios.put(`${BASE_URL}/pages/about/team/${member.id}`, member);
        toast({ title: "Член команды обновлен", status: "success", duration: 2000 });
      } else {
        await axios.post(`${BASE_URL}/pages/about/team`, member);
        toast({ title: "Член команды создан", status: "success", duration: 2000 });
      }
      fetchData();
      onClose();
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/pages/about/sections/${id}`);
      toast({ title: "Секция удалена", status: "success", duration: 2000 });
      fetchData();
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
    }
  };

  const handleSaveHeroTranslations = async () => {
    try {
      await axios.put(`${BASE_URL}/site-settings/about_hero_title`, {
        value: JSON.stringify(heroTitle),
        description: "Заголовок hero секции на странице О компании (JSON с переводами)"
      });
      await axios.put(`${BASE_URL}/site-settings/about_hero_description`, {
        value: JSON.stringify(heroDescription),
        description: "Описание hero секции на странице О компании (JSON с переводами)"
      });
      toast({ title: "Переводы hero секции сохранены", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
    }
  };

  const handleToggleTeamBlock = async (value) => {
    try {
      await axios.put(`${BASE_URL}/site-settings/show_team_block`, {
        value: value ? "true" : "false",
        description: "Показывать блок команды на странице О компании"
      });
      setShowTeamBlock(value);
      toast({ title: "Настройка сохранена", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/pages/about/team/${id}`);
      toast({ title: "Член команды удален", status: "success", duration: 2000 });
      fetchData();
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" py="40px">
        <Spinner size="lg" thickness="3px" color="black" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading
        fontSize={{ base: "20px", sm: "24px", md: "32px" }}
        fontWeight="300"
        letterSpacing="1px"
        mb={{ base: "20px", md: "30px" }}
        textTransform="uppercase"
      >
        О компании
      </Heading>

      {/* Hero Section Translations */}
      <Box mb="40px" bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="12px" p="20px">
        <Text fontSize="18px" fontWeight="500" letterSpacing="0.5px" mb="20px">
          Hero секция (Заголовок и описание)
        </Text>
        <VStack spacing="20px" align="stretch">
          <Box>
            <Text fontSize="14px" fontWeight="500" mb="10px">Заголовок</Text>
            <TranslationFields
              label="Заголовок"
              fieldName="title"
              value={heroTitle}
              onChange={(translations) => setHeroTitle(translations)}
              isTextarea={false}
            />
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb="10px">Описание</Text>
            <TranslationFields
              label="Описание"
              fieldName="description"
              value={heroDescription}
              onChange={(translations) => setHeroDescription(translations)}
              isTextarea={true}
            />
          </Box>
          <Button bg="black" color="white" onClick={handleSaveHeroTranslations}>
            Сохранить переводы Hero секции
          </Button>
        </VStack>
      </Box>

      {/* Sections */}
      <Box mb="40px">
        <Flex justify="space-between" align="center" mb="20px">
          <Text fontSize="18px" fontWeight="500" letterSpacing="0.5px">
            Секции
          </Text>
          <Button
            leftIcon={<FiPlus />}
            bg="black"
            color="white"
            size="sm"
            onClick={() => {
              setEditingSection({ 
                title: '', 
                description: '', 
                image: '', 
                reverse: false, 
                order: sections.length + 1,
                title_translations: { ru: '', uz: '', en: '', es: '' },
                description_translations: { ru: '', uz: '', en: '', es: '' }
              });
              setIsSectionModal(true);
              onOpen();
            }}
          >
            Добавить секцию
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
          {sections.map((section) => (
            <Box key={section.id} bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="12px" p="20px">
              <VStack spacing="15px" align="stretch">
                <Text fontSize="14px" fontWeight="500">{section.title}</Text>
                <Text fontSize="12px" color="gray.600" noOfLines={3}>{section.description}</Text>
                <Flex gap="10px">
                  <Button
                    size="sm"
                    leftIcon={<FiEdit />}
                    onClick={() => {
                      setEditingSection(section);
                      setIsSectionModal(true);
                      onOpen();
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<FiTrash2 />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    Удалить
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Team Members */}
      <Box>
        <Flex justify="space-between" align="center" mb="20px">
          <Flex align="center" gap="15px">
            <Text fontSize="18px" fontWeight="500" letterSpacing="0.5px">
              Команда
            </Text>
            <Flex align="center" gap="10px">
              <FormLabel fontSize="14px" mb="0" fontWeight="400">Показать на сайте</FormLabel>
              <Switch
                isChecked={showTeamBlock}
                onChange={(e) => handleToggleTeamBlock(e.target.checked)}
                colorScheme="black"
                size="md"
                sx={{
                  '& .chakra-switch__track[data-checked]': {
                    bg: 'black !important',
                  },
                  '& .chakra-switch__thumb[data-checked]': {
                    bg: 'white !important',
                  },
                  '& .chakra-switch__track:not([data-checked])': {
                    bg: 'gray.300 !important',
                  },
                  '& .chakra-switch__thumb:not([data-checked])': {
                    bg: 'white !important',
                  },
                }}
              />
            </Flex>
          </Flex>
          <Button
            leftIcon={<FiPlus />}
            bg="black"
            color="white"
            size="sm"
            onClick={() => {
              setEditingMember({ 
                name: '', 
                role: '', 
                image: '', 
                order: teamMembers.length + 1,
                name_translations: { ru: '', uz: '', en: '', es: '' },
                role_translations: { ru: '', uz: '', en: '', es: '' }
              });
              setIsSectionModal(false);
              onOpen();
            }}
          >
            Добавить члена команды
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px">
          {teamMembers.map((member) => (
            <Box key={member.id} bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="12px" p="20px">
              <VStack spacing="15px" align="stretch">
                <Text fontSize="14px" fontWeight="500">{member.name}</Text>
                <Text fontSize="12px" color="gray.600">{member.role}</Text>
                <Flex gap="10px">
                  <Button
                    size="sm"
                    leftIcon={<FiEdit />}
                    onClick={() => {
                      setEditingMember(member);
                      setIsSectionModal(false);
                      onOpen();
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<FiTrash2 />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    Удалить
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "xl" }}>
        <ModalOverlay />
        <ModalContent borderRadius={{ base: "0", sm: "20px" }} maxW={{ base: "100%", sm: "700px" }} mx={{ base: "0", sm: "auto" }}>
          <ModalHeader>
            {isSectionModal ? 'Редактировать секцию' : 'Редактировать члена команды'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isSectionModal && editingSection ? (
              <EditSectionForm section={editingSection} setSection={setEditingSection} onSave={handleSaveSection} />
            ) : editingMember ? (
              <EditMemberForm member={editingMember} setMember={setEditingMember} onSave={handleSaveMember} />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditSectionForm = ({ section, setSection, onSave }) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(section.image || '');
  // Инициализируем переводы, если их нет
  useEffect(() => {
    const updates = {};
    
    if (!section.title_translations || Object.keys(section.title_translations).length === 0) {
      updates.title_translations = { 
        ru: section.title || '', 
        uz: '', 
        en: '', 
        es: '' 
      };
    }
    
    if (!section.description_translations || Object.keys(section.description_translations).length === 0) {
      updates.description_translations = { 
        ru: section.description || '', 
        uz: '', 
        en: '', 
        es: '' 
      };
    }
    
    if (Object.keys(updates).length > 0) {
      setSection({ ...section, ...updates });
    }
  }, [section.id]); // Обновляем при изменении ID секции

 // Только при монтировании


  const toast = useToast();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Проверка размера (макс 5MB)
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
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${BASE_URL}${response.data.url}`;
      setSection({ ...section, image: imageUrl });
      setImagePreview(imageUrl);
      
      toast({
        title: "Успешно",
        description: "Изображение загружено",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось загрузить изображение",
        status: "error",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    setSection({ ...section, image: url });
    setImagePreview(url);
  };



  return (
    <VStack spacing="20px" align="stretch">
      <Box>
        <Text fontSize="12px" mb="5px">Заголовок (русский)</Text>
        <Input
          value={section.title}
          onChange={(e) => {
            const newTitle = e.target.value;
            setSection({ 
              ...section, 
              title: newTitle,
              title_translations: { ...section.title_translations, ru: newTitle }
            });
          }}
        />
      </Box>
      <TranslationFields
        label="Заголовок"
        fieldName="title"
        value={section.title_translations || { ru: section.title || '', uz: '', en: '', es: '' }}
        onChange={(translations) => {
          console.log('Title translations changed:', translations);
          setSection((prevSection) => ({ ...prevSection, title_translations: translations }));
        }}
        isTextarea={false}
      />
      <Box>
        <Text fontSize="12px" mb="5px">Описание (русский)</Text>
        <Textarea
          value={section.description}
          onChange={(e) => {
            const newDesc = e.target.value;
            setSection({ 
              ...section, 
              description: newDesc,
              description_translations: { ...section.description_translations, ru: newDesc }
            });
          }}
          rows={5}
        />
      </Box>
      <TranslationFields
        label="Описание"
        fieldName="description"
        value={section.description_translations || { ru: section.description || '', uz: '', en: '', es: '' }}
        onChange={(translations) => {
          console.log('Description translations changed:', translations);
          setSection((prevSection) => ({ ...prevSection, description_translations: translations }));
        }}
        isTextarea={true}
      />
      
      <Box>
        <Text fontSize="12px" mb="10px" fontWeight="500">Изображение</Text>
        <Tabs>
          <TabList>
            <Tab><Icon as={FiLink} mr="5px" />URL</Tab>
            <Tab><Icon as={FiUpload} mr="5px" />Загрузить файл</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px="0" pt="15px">
              <Input
                placeholder="Введите URL изображения"
                value={section.image || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </TabPanel>
            <TabPanel px="0" pt="15px">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                display="none"
                id="section-image-upload"
              />
              <Button
                as="label"
                htmlFor="section-image-upload"
                leftIcon={<FiUpload />}
                isLoading={uploading}
                loadingText="Загрузка..."
                cursor="pointer"
                w="100%"
              >
                Выбрать файл
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {imagePreview && (
          <Box mt="15px" border="1px solid" borderColor="#e5e5e5" borderRadius="8px" p="10px">
            <Text fontSize="11px" color="gray.600" mb="8px">Предпросмотр:</Text>
            <Image src={imagePreview} maxH="200px" objectFit="contain" borderRadius="4px" />
          </Box>
        )}
      </Box>

      <Box>
        <FormLabel>
          <Switch
            isChecked={section.reverse}
            onChange={(e) => setSection({ ...section, reverse: e.target.checked })}
          />
          <Text as="span" ml="10px">Обратный порядок</Text>
        </FormLabel>
      </Box>
      <Button bg="black" color="white" onClick={() => {
        // Убеждаемся, что все переводы включены перед сохранением
        const sectionToSave = {
          ...section,
          title_translations: section.title_translations || { ru: section.title || '', uz: '', en: '', es: '' },
          description_translations: section.description_translations || { ru: section.description || '', uz: '', en: '', es: '' }
        };
        console.log('Saving from form, section:', sectionToSave);
        onSave(sectionToSave);
      }}>
        Сохранить
      </Button>
    </VStack>
  );
};

const EditMemberForm = ({ member, setMember, onSave }) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(member.image || '');
  const toast = useToast();

  const handleFileUpload = async (e) => {
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
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${BASE_URL}${response.data.url}`;
      setMember({ ...member, image: imageUrl });
      setImagePreview(imageUrl);
      
      toast({
        title: "Успешно",
        description: "Изображение загружено",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось загрузить изображение",
        status: "error",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    setMember({ ...member, image: url });
    setImagePreview(url);
  };

  // Инициализируем переводы, если их нет
  if (!member.name_translations) {
    member.name_translations = { ru: member.name || '', uz: '', en: '', es: '' };
  }
  if (!member.role_translations) {
    member.role_translations = { ru: member.role || '', uz: '', en: '', es: '' };
  }

  return (
    <VStack spacing="20px" align="stretch">
      <Box>
        <Text fontSize="12px" mb="5px">Имя (русский)</Text>
        <Input
          value={member.name}
          onChange={(e) => {
            const newName = e.target.value;
            setMember({ 
              ...member, 
              name: newName,
              name_translations: { ...member.name_translations, ru: newName }
            });
          }}
        />
      </Box>
      <TranslationFields
        label="Имя"
        fieldName="name"
        value={member.name_translations || { ru: member.name || '', uz: '', en: '', es: '' }}
        onChange={(translations) => setMember({ ...member, name_translations: translations })}
        isTextarea={false}
      />
      <Box>
        <Text fontSize="12px" mb="5px">Роль (русский)</Text>
        <Input
          value={member.role}
          onChange={(e) => {
            const newRole = e.target.value;
            setMember({ 
              ...member, 
              role: newRole,
              role_translations: { ...member.role_translations, ru: newRole }
            });
          }}
        />
      </Box>
      <TranslationFields
        label="Роль"
        fieldName="role"
        value={member.role_translations || { ru: member.role || '', uz: '', en: '', es: '' }}
        onChange={(translations) => setMember({ ...member, role_translations: translations })}
        isTextarea={false}
      />
      
      <Box>
        <Text fontSize="12px" mb="10px" fontWeight="500">Изображение</Text>
        <Tabs>
          <TabList>
            <Tab><Icon as={FiLink} mr="5px" />URL</Tab>
            <Tab><Icon as={FiUpload} mr="5px" />Загрузить файл</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px="0" pt="15px">
              <Input
                placeholder="Введите URL изображения"
                value={member.image || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </TabPanel>
            <TabPanel px="0" pt="15px">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                display="none"
                id="member-image-upload"
              />
              <Button
                as="label"
                htmlFor="member-image-upload"
                leftIcon={<FiUpload />}
                isLoading={uploading}
                loadingText="Загрузка..."
                cursor="pointer"
                w="100%"
              >
                Выбрать файл
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {imagePreview && (
          <Box mt="15px" border="1px solid" borderColor="#e5e5e5" borderRadius="8px" p="10px">
            <Text fontSize="11px" color="gray.600" mb="8px">Предпросмотр:</Text>
            <Image src={imagePreview} maxH="200px" objectFit="contain" borderRadius="4px" />
          </Box>
        )}
      </Box>

      <Button bg="black" color="white" onClick={() => onSave(member)}>
        Сохранить
      </Button>
    </VStack>
  );
};

export default About;

