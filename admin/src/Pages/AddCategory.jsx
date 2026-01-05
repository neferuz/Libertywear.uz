import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  VStack, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea,
  Select,
  HStack,
  Icon,
  Text,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import TranslationFields from '../Components/TranslationFields';

const AddCategory = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [categoryName, setCategoryName] = useState('');
  const [categoryNameTranslations, setCategoryNameTranslations] = useState({ ru: '', uz: '', en: '', es: '' });
  const [categoryGender, setCategoryGender] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [subcategories, setSubcategories] = useState([
    { id: 1, name: '', name_translations: { ru: '', uz: '', en: '', es: '' }, subSubcategories: [{ id: Date.now(), name: '', name_translations: { ru: '', uz: '', en: '', es: '' } }] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubcategory = () => {
    setSubcategories([
      ...subcategories,
      { id: Date.now(), name: '', subSubcategories: [] }
    ]);
  };

  const handleRemoveSubcategory = (id) => {
    setSubcategories(subcategories.filter(sub => sub.id !== id));
  };

  const handleSubcategoryChange = (id, value) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === id ? { ...sub, name: value } : sub
    ));
  };

  const handleSubcategoryTranslationChange = (id, translations) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === id ? { ...sub, name_translations: translations } : sub
    ));
  };

  const handleAddSubSubcategory = (subcategoryId) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === subcategoryId 
        ? { ...sub, subSubcategories: [...sub.subSubcategories, { id: Date.now(), name: '', name_translations: { ru: '', uz: '', en: '', es: '' } }] }
        : sub
    ));
  };

  const handleRemoveSubSubcategory = (subcategoryId, subSubcategoryId) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === subcategoryId 
        ? { ...sub, subSubcategories: sub.subSubcategories.filter(ss => ss.id !== subSubcategoryId) }
        : sub
    ));
  };

  const handleSubSubcategoryChange = (subcategoryId, subSubcategoryId, value) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === subcategoryId 
        ? { 
            ...sub, 
            subSubcategories: sub.subSubcategories.map(ss => 
              ss.id === subSubcategoryId ? { ...ss, name: value } : ss
            )
          }
        : sub
    ));
  };

  const handleSubSubcategoryTranslationChange = (subcategoryId, subSubcategoryId, translations) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === subcategoryId 
        ? { 
            ...sub, 
            subSubcategories: sub.subSubcategories.map(ss => 
              ss.id === subSubcategoryId ? { ...ss, name_translations: translations } : ss
            )
          }
        : sub
    ));
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите название категории",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Определяем gender на основе названия или выбранного значения
      let gender = categoryGender;
      if (!gender) {
        const nameLower = categoryName.toLowerCase();
        if (nameLower.includes('жен') || nameLower.includes('women') || nameLower.includes('woman')) {
          gender = 'female';
        } else if (nameLower.includes('муж') || nameLower.includes('men') || nameLower.includes('man')) {
          gender = 'male';
        } else if (nameLower.includes('дет') || nameLower.includes('kids') || nameLower.includes('kid')) {
          gender = 'kids';
        }
      }

      // Создаем главную категорию (без parent_id, так как это главная категория)
      const mainCategoryData = {
        title: categoryName.trim(),
        title_translations: categoryNameTranslations,
        gender: gender || null,
        image: categoryImage.trim() || null,
        parent_id: null,
        order: 0
      };

      const mainCategoryResponse = await axios.post(`${BASE_URL}/categories/`, mainCategoryData);
      const mainCategoryId = mainCategoryResponse.data.id;

      // Создаем подкатегории, если они есть
      if (subcategories.length > 0 && subcategories[0].name.trim()) {
        for (let i = 0; i < subcategories.length; i++) {
          const subcategory = subcategories[i];
          if (subcategory.name.trim()) {
            // Создаем подкатегорию
            const subcategoryData = {
              title: subcategory.name.trim(),
              title_translations: subcategory.name_translations || {},
              gender: gender || null,
              parent_id: mainCategoryId,
              order: i + 1
            };

            const subcategoryResponse = await axios.post(`${BASE_URL}/categories/`, subcategoryData);
            const subcategoryId = subcategoryResponse.data.id;

            // Создаем под-подкатегории, если они есть
            if (subcategory.subSubcategories && subcategory.subSubcategories.length > 0) {
              for (let j = 0; j < subcategory.subSubcategories.length; j++) {
                const subSubcategory = subcategory.subSubcategories[j];
                // Пропускаем пустые под-подкатегории (если только русское название не заполнено)
                if (subSubcategory.name && subSubcategory.name.trim()) {
                  const subSubcategoryData = {
                    title: subSubcategory.name.trim(),
                    title_translations: subSubcategory.name_translations || {},
                    gender: gender || null,
                    parent_id: subcategoryId,
                    order: j + 1
                  };
                  await axios.post(`${BASE_URL}/categories/`, subSubcategoryData);
                }
              }
            }
          }
        }
      }

      toast({
        title: "Успешно",
        description: "Категория успешно добавлена",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/categories');
    } catch (err) {
      console.error('Error creating category:', err);
      toast({
        title: "Ошибка",
        description: err.response?.data?.detail || "Не удалось добавить категорию",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Flex align="center" mb="30px">
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/categories')}
          mr="20px"
          _hover={{ bg: "gray.100" }}
        >
          Назад
        </Button>
        <Heading
          fontSize={{ base: "24px", md: "32px" }}
          fontWeight="300"
          letterSpacing="1px"
          textTransform="uppercase"
        >
          Добавить категорию
        </Heading>
      </Flex>

      <Box bg="white" border="1px solid" borderColor="#e5e5e5" borderRadius="20px" p="40px" maxW="800px">
        <VStack spacing="30px" align="stretch">
          {/* Main Category Name */}
          <FormControl>
            <FormLabel
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="10px"
            >
              Название категории (русский)
            </FormLabel>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Например: Женская"
              borderRadius="0"
              borderColor="black"
              borderBottom="1px solid"
              borderTop="none"
              borderLeft="none"
              borderRight="none"
              _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
              fontSize="14px"
              paddingY="15px"
            />
          </FormControl>

          {/* Main Category Name Translations */}
          <TranslationFields
            label="Название категории"
            fieldName="name"
            value={categoryNameTranslations}
            onChange={(translations) => setCategoryNameTranslations(translations)}
            type="input"
          />

          {/* Gender Selection */}
          <FormControl>
            <FormLabel
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="10px"
            >
              Пол (необязательно)
            </FormLabel>
            <Select
              value={categoryGender}
              onChange={(e) => setCategoryGender(e.target.value)}
              borderRadius="0"
              borderColor="black"
              borderBottom="1px solid"
              borderTop="none"
              borderLeft="none"
              borderRight="none"
              _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
              fontSize="14px"
              paddingY="15px"
            >
              <option value="">Автоматически (определится по названию)</option>
              <option value="female">Женский</option>
              <option value="male">Мужской</option>
              <option value="kids">Детский</option>
            </Select>
          </FormControl>

          {/* Category Image URL */}
          <FormControl>
            <FormLabel
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="10px"
            >
              URL изображения категории (необязательно)
            </FormLabel>
            <Input
              value={categoryImage}
              onChange={(e) => setCategoryImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              borderRadius="0"
              borderColor="black"
              borderBottom="1px solid"
              borderTop="none"
              borderLeft="none"
              borderRight="none"
              _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
              fontSize="14px"
              paddingY="15px"
            />
          </FormControl>

          <Box>
            <Flex justify="space-between" align="center" mb="20px">
              <Text
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
              >
                Подкатегории
              </Text>
              <Button
                leftIcon={<FiPlus />}
                size="sm"
                variant="outline"
                borderRadius="20px"
                fontSize="11px"
                borderColor="black"
                color="black"
                _hover={{ bg: "black", color: "white" }}
                onClick={handleAddSubcategory}
              >
                Добавить подкатегорию
              </Button>
            </Flex>

            <VStack spacing="20px" align="stretch">
              {subcategories.map((subcategory, index) => (
                <Box
                  key={subcategory.id}
                  p="20px"
                  border="1px solid"
                  borderColor="#e5e5e5"
                  borderRadius="15px"
                  bg="gray.50"
                >
                  <Flex align="center" justify="space-between" mb="15px">
                    <Text fontSize="11px" fontWeight="500" color="gray.600" letterSpacing="0.5px">
                      Подкатегория {index + 1}
                    </Text>
                    {subcategories.length > 1 && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleRemoveSubcategory(subcategory.id)}
                        color="red.500"
                        _hover={{ bg: "red.50" }}
                      >
                        <FiX />
                      </Button>
                    )}
                  </Flex>

                  <FormControl mb="15px">
                    <FormLabel fontSize="11px" mb="5px">Название подкатегории (русский)</FormLabel>
                    <Input
                      value={subcategory.name}
                      onChange={(e) => handleSubcategoryChange(subcategory.id, e.target.value)}
                      placeholder="Например: Зимняя коллекция"
                      borderRadius="0"
                      borderColor="black"
                      borderBottom="1px solid"
                      borderTop="none"
                      borderLeft="none"
                      borderRight="none"
                      _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                      fontSize="13px"
                      paddingY="12px"
                      bg="white"
                    />
                  </FormControl>

                  <TranslationFields
                    label="Название подкатегории"
                    fieldName="name"
                    value={subcategory.name_translations || { ru: '', uz: '', en: '', es: '' }}
                    onChange={(translations) => handleSubcategoryTranslationChange(subcategory.id, translations)}
                    type="input"
                  />

                  {/* Sub-Subcategories */}
                  <Box>
                    <Flex justify="space-between" align="center" mb="10px">
                      <Text fontSize="10px" fontWeight="400" color="gray.500" letterSpacing="0.5px">
                        Под-подкатегории
                      </Text>
                      <Button
                        leftIcon={<FiPlus />}
                        size="xs"
                        variant="ghost"
                        fontSize="10px"
                        onClick={() => handleAddSubSubcategory(subcategory.id)}
                        _hover={{ bg: "gray.200" }}
                      >
                        Добавить
                      </Button>
                    </Flex>

                    <VStack spacing="8px" align="stretch">
                      {subcategory.subSubcategories.map((subSubcategory) => (
                        <Box key={subSubcategory.id} mb="15px">
                          <Flex align="center" gap="10px" mb="10px">
                            <Input
                              value={subSubcategory.name}
                              onChange={(e) => handleSubSubcategoryChange(subcategory.id, subSubcategory.id, e.target.value)}
                              placeholder="Например: Пальто (русский)"
                              borderRadius="0"
                              borderColor="gray.400"
                              borderBottom="1px solid"
                              borderTop="none"
                              borderLeft="none"
                              borderRight="none"
                              _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
                              fontSize="12px"
                              paddingY="10px"
                              bg="white"
                              flex="1"
                            />
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => handleRemoveSubSubcategory(subcategory.id, subSubcategory.id)}
                              color="red.500"
                              _hover={{ bg: "red.50" }}
                            >
                              <FiX />
                            </Button>
                          </Flex>
                          <TranslationFields
                            label="Название под-подкатегории"
                            fieldName="name"
                            value={subSubcategory.name_translations || { ru: '', uz: '', en: '', es: '' }}
                            onChange={(translations) => handleSubSubcategoryTranslationChange(subcategory.id, subSubcategory.id, translations)}
                            type="input"
                          />
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Submit Button */}
          <Flex justify="flex-end" gap="15px" mt="20px">
            <Button
              variant="outline"
              borderRadius="20px"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              borderColor="black"
              color="black"
              _hover={{ bg: "gray.100" }}
              px="30px"
              py="20px"
              onClick={() => navigate('/categories')}
            >
              Отмена
            </Button>
            <Button
              bg="black"
              color="white"
              borderRadius="20px"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              _hover={{ bg: "gray.800" }}
              px="30px"
              py="20px"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Сохранение..."
            >
              Сохранить
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default AddCategory;

