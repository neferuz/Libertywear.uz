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

const About = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sections, setSections] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [isSectionModal, setIsSectionModal] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sectionsRes, teamRes] = await Promise.all([
        axios.get(`${BASE_URL}/pages/about/sections`),
        axios.get(`${BASE_URL}/pages/about/team`)
      ]);
      setSections(sectionsRes.data);
      setTeamMembers(teamRes.data);
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
      if (section.id) {
        await axios.put(`${BASE_URL}/pages/about/sections/${section.id}`, section);
        toast({ title: "Секция обновлена", status: "success", duration: 2000 });
      } else {
        await axios.post(`${BASE_URL}/pages/about/sections`, section);
        toast({ title: "Секция создана", status: "success", duration: 2000 });
      }
      fetchData();
      onClose();
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
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
              setEditingSection({ title: '', description: '', image: '', reverse: false, order: sections.length + 1 });
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
          <Text fontSize="18px" fontWeight="500" letterSpacing="0.5px">
            Команда
          </Text>
          <Button
            leftIcon={<FiPlus />}
            bg="black"
            color="white"
            size="sm"
            onClick={() => {
              setEditingMember({ name: '', role: '', image: '', order: teamMembers.length + 1 });
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
        <Text fontSize="12px" mb="5px">Заголовок</Text>
        <Input
          value={section.title}
          onChange={(e) => setSection({ ...section, title: e.target.value })}
        />
      </Box>
      <Box>
        <Text fontSize="12px" mb="5px">Описание</Text>
        <Textarea
          value={section.description}
          onChange={(e) => setSection({ ...section, description: e.target.value })}
          rows={5}
        />
      </Box>
      
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
      <Button bg="black" color="white" onClick={() => onSave(section)}>
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

  return (
    <VStack spacing="20px" align="stretch">
      <Box>
        <Text fontSize="12px" mb="5px">Имя</Text>
        <Input
          value={member.name}
          onChange={(e) => setMember({ ...member, name: e.target.value })}
        />
      </Box>
      <Box>
        <Text fontSize="12px" mb="5px">Роль</Text>
        <Input
          value={member.role}
          onChange={(e) => setMember({ ...member, role: e.target.value })}
        />
      </Box>
      
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

