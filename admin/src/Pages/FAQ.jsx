import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon,
  Text,
  Flex,
  Button,
  Input,
  Textarea,
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
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const FAQ = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/pages/faq`);
      setFaqItems(res.data);
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

  const handleSave = async (item) => {
    try {
      if (item.id) {
        await axios.put(`${BASE_URL}/pages/faq/${item.id}`, item);
        toast({ title: "FAQ обновлен", status: "success", duration: 2000 });
      } else {
        await axios.post(`${BASE_URL}/pages/faq`, item);
        toast({ title: "FAQ создан", status: "success", duration: 2000 });
      }
      fetchData();
      onClose();
    } catch (error) {
      toast({ title: "Ошибка", description: error.message, status: "error", duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/pages/faq/${id}`);
      toast({ title: "FAQ удален", status: "success", duration: 2000 });
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
          FAQ
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          bg="black"
          color="white"
          borderRadius="20px"
          fontSize={{ base: "11px", md: "12px" }}
          size={{ base: "sm", md: "md" }}
          onClick={() => {
            setEditingItem({ question: '', answer: '', order: faqItems.length + 1 });
            onOpen();
          }}
          w={{ base: "100%", sm: "auto" }}
        >
          Добавить вопрос
        </Button>
      </Flex>

      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p={{ base: "20px", md: "30px" }}>
        <VStack spacing="0" align="stretch">
          <Accordion allowToggle>
            {faqItems.map((item) => (
              <AccordionItem key={item.id} border="none" borderBottom="1px solid" borderColor="#e5e5e5" _last={{ borderBottom: "none" }}>
                <AccordionButton
                  py="20px"
                  _hover={{ bg: "transparent" }}
                  _expanded={{ bg: "gray.50" }}
                >
                  <Box flex="1" textAlign="left">
                    <Text
                      fontSize={{ base: "13px", md: "14px" }}
                      fontWeight="500"
                      letterSpacing="0.3px"
                      color="black"
                    >
                      {item.question}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb="20px" pt="0">
                  <VStack spacing="15px" align="stretch">
                    <Text
                      fontSize="13px"
                      color="gray.600"
                      lineHeight="1.8"
                      pl="20px"
                    >
                      {item.answer}
                    </Text>
                    <Flex gap="10px" pl="20px">
                      <Button
                        size="sm"
                        leftIcon={<FiEdit />}
                        onClick={() => {
                          setEditingItem(item);
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
                        onClick={() => handleDelete(item.id)}
                      >
                        Удалить
                      </Button>
                    </Flex>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "xl" }}>
        <ModalOverlay />
        <ModalContent borderRadius={{ base: "0", sm: "20px" }} maxW={{ base: "100%", sm: "700px" }} mx={{ base: "0", sm: "auto" }}>
          <ModalHeader>Редактировать FAQ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingItem && (
              <VStack spacing="20px" align="stretch">
                <Box>
                  <Text fontSize="12px" mb="5px">Вопрос</Text>
                  <Input
                    value={editingItem.question}
                    onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  />
                </Box>
                <Box>
                  <Text fontSize="12px" mb="5px">Ответ</Text>
                  <Textarea
                    value={editingItem.answer}
                    onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                    rows={6}
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Отмена
            </Button>
            <Button bg="black" color="white" onClick={() => handleSave(editingItem)}>
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FAQ;

