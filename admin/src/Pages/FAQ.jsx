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
  Select,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const FAQ = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Вспомогательная функция для инициализации переводов
  const initTranslations = (item) => {
    return {
      ...item,
      question_translations: item.question_translations && 
        typeof item.question_translations === 'object' && 
        item.question_translations !== null
        ? {
            ru: item.question_translations.ru || item.question || '',
            uz: item.question_translations.uz || '',
            en: item.question_translations.en || '',
            es: item.question_translations.es || ''
          }
        : { ru: item.question || '', uz: '', en: '', es: '' },
      answer_translations: item.answer_translations && 
        typeof item.answer_translations === 'object' && 
        item.answer_translations !== null
        ? {
            ru: item.answer_translations.ru || item.answer || '',
            uz: item.answer_translations.uz || '',
            en: item.answer_translations.en || '',
            es: item.answer_translations.es || ''
          }
        : { ru: item.answer || '', uz: '', en: '', es: '' }
    };
  };


  // Инициализируем переводы при открытии формы редактирования
  useEffect(() => {
    if (editingItem) {
      // Используем вспомогательную функцию
      const initialized = initTranslations(editingItem);
      setEditingItem(initialized);
    }
  }, [editingItem?.id]); // Обновляем при изменении ID элемента

 // Обновляем при изменении ID элемента


  // Инициализируем переводы при открытии формы редактирования
  useEffect(() => {
    if (editingItem) {
      const updates = {};
      
      if (!editingItem.question_translations || Object.keys(editingItem.question_translations).length === 0) {
        updates.question_translations = { 
          ru: editingItem.question || '', 
          uz: '', 
          en: '', 
          es: '' 
        };
      }
      
      if (!editingItem.answer_translations || Object.keys(editingItem.answer_translations).length === 0) {
        updates.answer_translations = { 
          ru: editingItem.answer || '', 
          uz: '', 
          en: '', 
          es: '' 
        };
      }
      
      if (Object.keys(updates).length > 0) {
        setEditingItem({ ...editingItem, ...updates });
      }
    }
  }, [editingItem?.id]);



  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/pages/faq`);
      console.log('Fetched FAQ items:', res.data);
      // Убеждаемся, что переводы присутствуют в данных
      const faqItemsWithTranslations = res.data.map(item => ({
        ...item,
        question_translations: item.question_translations || null,
        answer_translations: item.answer_translations || null
      }));
      console.log('FAQ items with translations:', faqItemsWithTranslations);
      setFaqItems(faqItemsWithTranslations);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
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
      // Убеждаемся, что переводы инициализированы перед отправкой
      const questionTranslations = item.question_translations || { 
        ru: item.question || '', 
        uz: '', 
        en: '', 
        es: '' 
      };
      
      const answerTranslations = item.answer_translations || { 
        ru: item.answer || '', 
        uz: '', 
        en: '', 
        es: '' 
      };

      // Убеждаемся, что все языки присутствуют
      const question_translations = {
        ru: questionTranslations.ru || item.question || '',
        uz: questionTranslations.uz || '',
        en: questionTranslations.en || '',
        es: questionTranslations.es || ''
      };

      const answer_translations = {
        ru: answerTranslations.ru || item.answer || '',
        uz: answerTranslations.uz || '',
        en: answerTranslations.en || '',
        es: answerTranslations.es || ''
      };

      const itemToSave = {
        ...item,
        question_translations,
        answer_translations
      };
      
      console.log('Saving FAQ item:', JSON.stringify(itemToSave, null, 2));
      console.log('Question translations:', question_translations);
      console.log('Answer translations:', answer_translations);
      
      if (item.id) {
        const response = await axios.put(`${BASE_URL}/pages/faq/${item.id}`, itemToSave);
        console.log('Update response:', response.data);
        console.log('Response question_translations:', response.data?.question_translations);
        console.log('Response answer_translations:', response.data?.answer_translations);
        
        toast({ title: "FAQ обновлен", status: "success", duration: 2000 });
      } else {
        const response = await axios.post(`${BASE_URL}/pages/faq`, itemToSave);
        console.log('Create response:', response.data);
        toast({ title: "FAQ создан", status: "success", duration: 2000 });
      }
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.detail || error.message || "Не удалось сохранить FAQ";
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
            setEditingItem({ 
              question: '', 
              answer: '', 
              category: 'All',
              order: faqItems.length + 1,
              question_translations: { ru: '', uz: '', en: '', es: '' },
              answer_translations: { ru: '', uz: '', en: '', es: '' }
            });
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
                    <Flex align="center" gap="10px" mb="5px">
                      <Text
                        fontSize="10px"
                        fontWeight="500"
                        letterSpacing="0.1em"
                        color="gray.500"
                        textTransform="uppercase"
                      >
                        {item.category || 'All'}
                      </Text>
                    </Flex>
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
                          // Инициализируем переводы при открытии модального окна
                          const itemWithTranslations = {
                            ...item,
                            category: item.category || 'All',
                            question_translations: item.question_translations || { 
                              ru: item.question || '', 
                              uz: '', 
                              en: '', 
                              es: '' 
                            },
                            answer_translations: item.answer_translations || { 
                              ru: item.answer || '', 
                              uz: '', 
                              en: '', 
                              es: '' 
                            }
                          };
                          setEditingItem(itemWithTranslations);
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

      <Modal key={editingItem?.id || "new"} isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "xl" }}>
        <ModalOverlay />
        <ModalContent borderRadius={{ base: "0", sm: "20px" }} maxW={{ base: "100%", sm: "700px" }} mx={{ base: "0", sm: "auto" }}>
          <ModalHeader>Редактировать FAQ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingItem && (
                <VStack spacing="20px" align="stretch">
                  <Box>
                    <Text fontSize="12px" mb="5px">Категория</Text>
                    <Select
                      value={editingItem.category || 'All'}
                      onChange={(e) => {
                        setEditingItem((prevItem) => ({ 
                          ...prevItem, 
                          category: e.target.value
                        }));
                      }}
                    >
                      <option value="All">All</option>
                      <option value="Orders">Orders</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Returns">Returns</option>
                      <option value="Products">Products</option>
                      <option value="Account">Account</option>
                    </Select>
                  </Box>
                  <Box>
                    <Text fontSize="12px" mb="5px">Вопрос (русский)</Text>
                    <Input
                      value={editingItem.question}
                      onChange={(e) => {
                        const newQuestion = e.target.value;
                        setEditingItem((prevItem) => ({ 
                          ...prevItem, 
                          question: newQuestion,
                          question_translations: { ...prevItem.question_translations, ru: newQuestion }
                        }));
                      }}
                    />
                  </Box>
                  <TranslationFields
                    label="Вопрос"
                    fieldName="question"
                    value={editingItem.question_translations || { ru: editingItem.question || '', uz: '', en: '', es: '' }}
                    onChange={(translations) => {
          console.log('Question translations changed:', translations);
          setEditingItem((prevItem) => ({ ...prevItem, question_translations: translations }));
        }}
                    isTextarea={false}
                  />
                  <Box>
                    <Text fontSize="12px" mb="5px">Ответ (русский)</Text>
                    <Textarea
                      value={editingItem.answer}
                      onChange={(e) => {
                        const newAnswer = e.target.value;
                        setEditingItem((prevItem) => ({ 
                          ...prevItem, 
                          answer: newAnswer,
                          answer_translations: { ...prevItem.answer_translations, ru: newAnswer }
                        }));
                      }}
                      rows={6}
                    />
                  </Box>
                  <TranslationFields
                    label="Ответ"
                    fieldName="answer"
                    value={editingItem.answer_translations || { ru: editingItem.answer || '', uz: '', en: '', es: '' }}
                    onChange={(translations) => {
          console.log('Answer translations changed:', translations);
          setEditingItem((prevItem) => ({ ...prevItem, answer_translations: translations }));
        }}
                    isTextarea={true}
                  />
                </VStack>
              )
            })
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

