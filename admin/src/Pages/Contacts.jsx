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
      setContacts(res.data);
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

  const handleSave = async (contact) => {
    try {
      if (contact.id) {
        await axios.put(`${BASE_URL}/pages/contacts/${contact.id}`, contact);
        toast({ title: "Контакт обновлен", status: "success", duration: 2000 });
      } else {
        await axios.post(`${BASE_URL}/pages/contacts`, contact);
        toast({ title: "Контакт создан", status: "success", duration: 2000 });
      }
      fetchData();
      onClose();
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
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
            setEditingContact({ icon_type: 'map', title: '', content: '', details: '', order: contacts.length + 1 });
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
                      setEditingContact(contact);
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
                  <Text fontSize="12px" mb="5px">Заголовок</Text>
                  <Input
                    value={editingContact.title}
                    onChange={(e) => setEditingContact({ ...editingContact, title: e.target.value })}
                  />
                </Box>
                <Box>
                  <Text fontSize="12px" mb="5px">Основной текст</Text>
                  <Input
                    value={editingContact.content}
                    onChange={(e) => setEditingContact({ ...editingContact, content: e.target.value })}
                  />
                </Box>
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

