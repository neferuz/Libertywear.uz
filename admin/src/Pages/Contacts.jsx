import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Divider,
  Button,
  Flex,
  SimpleGrid,
  Input,
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
  Select,
} from '@chakra-ui/react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const iconMap = {
  map: FiMapPin,
  phone: FiPhone,
  email: FiMail,
  clock: FiClock,
};

const Contacts = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/pages/contacts`);
      console.log('Fetched contacts:', res.data);
      // Убеждаемся, что переводы присутствуют в данных
      const contactsWithTranslations = res.data.map(contact => ({
        ...contact,
        title_translations: contact.title_translations || null,
        content_translations: contact.content_translations || null
      }));
      console.log('Contacts with translations:', contactsWithTranslations);
      setContacts(contactsWithTranslations);
    } catch (error) {
      console.error('Error fetching contacts:', error);
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

  const handleSave = async (contact) => {
    try {
      // Убеждаемся, что переводы инициализированы перед отправкой
      // Если переводы пустые, создаем объекты с пустыми строками
      const titleTranslations = contact.title_translations || { 
        ru: contact.title || '', 
        uz: '', 
        en: '', 
        es: '' 
      };
      
      const contentTranslations = contact.content_translations || { 
        ru: contact.content || '', 
        uz: '', 
        en: '', 
        es: '' 
      };

      // Убеждаемся, что все языки присутствуют
      const title_translations = {
        ru: titleTranslations.ru || contact.title || '',
        uz: titleTranslations.uz || '',
        en: titleTranslations.en || '',
        es: titleTranslations.es || ''
      };

      const content_translations = {
        ru: contentTranslations.ru || contact.content || '',
        uz: contentTranslations.uz || '',
        en: contentTranslations.en || '',
        es: contentTranslations.es || ''
      };

      const contactToSave = {
        ...contact,
        title_translations,
        content_translations
      };

      console.log('Saving contact:', JSON.stringify(contactToSave, null, 2)); // Для отладки
      console.log('Title translations:', title_translations);
      console.log('Content translations:', content_translations);

      if (contact.id) {
        const response = await axios.put(`${BASE_URL}/pages/contacts/${contact.id}`, contactToSave);
        console.log('Update response:', response.data);
        toast({ title: "Контакт обновлен", status: "success", duration: 2000 });
      } else {
        const response = await axios.post(`${BASE_URL}/pages/contacts`, contactToSave);
        console.log('Create response:', response.data);
        toast({ title: "Контакт создан", status: "success", duration: 2000 });
      }
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.detail || error.message || "Не удалось сохранить контакт";
      toast({ 
        title: "Ошибка", 
        description: errorMessage, 
        status: "error", 
        duration: 5000 
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/pages/contacts/${id}`);
      toast({ title: "Контакт удален", status: "success", duration: 2000 });
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
      <Flex 
        justify="space-between" 
        align="center" 
        mb={{ base: "20px", md: "30px" }}
        flexDirection={{ base: "column", sm: "row" }}
        gap={{ base: "15px", sm: "0" }}
      >
        <Heading
          fontSize={{ base: "20px", sm: "24px", md: "32px" }}
          fontWeight="300"
          letterSpacing="1px"
          textTransform="uppercase"
        >
          Контакты
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          bg="black"
          color="white"
          borderRadius="20px"
          fontSize={{ base: "11px", md: "12px" }}
          size={{ base: "sm", md: "md" }}
          onClick={() => {
            setEditingContact({ 
              icon_type: 'map', 
              title: '', 
              content: '', 
              details: '', 
              order: contacts.length + 1,
              title_translations: { ru: '', uz: '', en: '', es: '' },
              content_translations: { ru: '', uz: '', en: '', es: '' }
            });
            onOpen();
          }}
          w={{ base: "100%", sm: "auto" }}
        >
          Добавить контакт
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: "15px", md: "20px" }}>
        {contacts.map((contact) => {
          const IconComponent = iconMap[contact.icon_type] || FiMapPin;
          return (
            <Box key={contact.id} bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p={{ base: "20px", md: "25px" }}>
              <VStack spacing="15px" align="stretch">
                <HStack spacing="15px">
                  <Icon as={IconComponent} boxSize="24px" color="black" />
                  <VStack align="start" spacing="4px" flex="1">
                    <Text fontSize="11px" color="gray.500" letterSpacing="0.5px" textTransform="uppercase">
                      {contact.title}
                    </Text>
                    <Text fontSize="15px" fontWeight="500">
                      {contact.content}
                    </Text>
                    {contact.details && (
                      <Text fontSize="13px" color="gray.600">
                        {contact.details}
                      </Text>
                    )}
                  </VStack>
                </HStack>
                <Flex gap="10px">
                  <Button
                    size="sm"
                    leftIcon={<FiEdit />}
                    onClick={() => {
                      // Инициализируем переводы при открытии модального окна
                      const contactWithTranslations = {
                        ...contact,
                        title_translations: contact.title_translations || { 
                          ru: contact.title || '', 
                          uz: '', 
                          en: '', 
                          es: '' 
                        },
                        content_translations: contact.content_translations || { 
                          ru: contact.content || '', 
                          uz: '', 
                          en: '', 
                          es: '' 
                        }
                      };
                      setEditingContact(contactWithTranslations);
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
                    onClick={() => handleDelete(contact.id)}
                  >
                    Удалить
                  </Button>
                </Flex>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "md" }}>
        <ModalOverlay />
        <ModalContent borderRadius={{ base: "0", sm: "20px" }} maxW={{ base: "100%", sm: "500px" }} mx={{ base: "0", sm: "auto" }}>
          <ModalHeader>Редактировать контакт</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingContact && (
                <VStack spacing="20px" align="stretch">
                  <Box>
                    <Text fontSize="12px" mb="5px">Тип иконки</Text>
                    <Select
                      value={editingContact.icon_type}
                      onChange={(e) => setEditingContact({ ...editingContact, icon_type: e.target.value })}
                    >
                      <option value="map">Карта (Адрес)</option>
                      <option value="phone">Телефон</option>
                      <option value="email">Email</option>
                      <option value="clock">Часы</option>
                    </Select>
                  </Box>
                  <Box>
                    <Text fontSize="12px" mb="5px">Заголовок (русский)</Text>
                    <Input
                      value={editingContact.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setEditingContact({ 
                          ...editingContact, 
                          title: newTitle,
                          title_translations: { ...editingContact.title_translations, ru: newTitle }
                        });
                      }}
                    />
                  </Box>
                  <TranslationFields
                    label="Заголовок"
                    fieldName="title"
                    value={editingContact.title_translations || { ru: editingContact.title || '', uz: '', en: '', es: '' }}
                    onChange={(translations) => setEditingContact({ ...editingContact, title_translations: translations })}
                    type="input"
                  />
                  <Box>
                    <Text fontSize="12px" mb="5px">Основной текст (русский)</Text>
                    <Input
                      value={editingContact.content}
                      onChange={(e) => {
                        const newContent = e.target.value;
                        setEditingContact({ 
                          ...editingContact, 
                          content: newContent,
                          content_translations: { ...editingContact.content_translations, ru: newContent }
                        });
                      }}
                    />
                  </Box>
                  <TranslationFields
                    label="Основной текст"
                    fieldName="content"
                    value={editingContact.content_translations || { ru: editingContact.content || '', uz: '', en: '', es: '' }}
                    onChange={(translations) => setEditingContact({ ...editingContact, content_translations: translations })}
                    type="input"
                  />
                  <Box>
                    <Text fontSize="12px" mb="5px">Дополнительная информация</Text>
                    <Input
                      value={editingContact.details || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, details: e.target.value })}
                    />
                    </Box>
                </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Отмена
            </Button>
            <Button bg="black" color="white" onClick={() => handleSave(editingContact)}>
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Contacts;

