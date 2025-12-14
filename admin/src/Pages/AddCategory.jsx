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

const AddCategory = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [subcategories, setSubcategories] = useState([
    { id: 1, name: '', subSubcategories: [] }
  ]);

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

  const handleAddSubSubcategory = (subcategoryId) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === subcategoryId 
        ? { ...sub, subSubcategories: [...sub.subSubcategories, { id: Date.now(), name: '' }] }
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

  const handleSubmit = () => {
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

    // Здесь будет логика сохранения категории
    toast({
      title: "Успешно",
      description: "Категория успешно добавлена",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    navigate('/categories');
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
              Название категории
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

          {/* Parent Category (Optional) */}
          <FormControl>
            <FormLabel
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
              mb="10px"
            >
              Родительская категория (необязательно)
            </FormLabel>
            <Select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
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
              <option value="">Нет (основная категория)</option>
              <option value="women">Женская</option>
              <option value="men">Мужская</option>
              <option value="kids">Детская</option>
            </Select>
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
                        <Flex key={subSubcategory.id} align="center" gap="10px">
                          <Input
                            value={subSubcategory.name}
                            onChange={(e) => handleSubSubcategoryChange(subcategory.id, subSubcategory.id, e.target.value)}
                            placeholder="Например: Пальто"
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

