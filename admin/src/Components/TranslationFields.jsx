import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text
} from '@chakra-ui/react';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const TranslationFields = ({ 
  fieldName, 
  label, 
  value = {}, 
  onChange, 
  isTextarea = false,
  placeholder = ''
}) => {
  const handleChange = (lang, newValue) => {
    const safeValue = value && typeof value === 'object' ? value : {};
    const updated = { ...safeValue, [lang]: newValue };
    onChange(updated);
  };

  return (
    <Box mb={4}>
      {label && (
        <FormLabel mb={2} fontSize="14px" fontWeight="500">
          {label} (Переводы)
        </FormLabel>
      )}
      <Tabs variant="enclosed" colorScheme="black">
        <TabList>
          {languages.map((lang) => (
            <Tab key={lang.code} fontSize="12px">
              {lang.flag} {lang.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {languages.map((lang) => (
            <TabPanel key={lang.code} p={4}>
              <FormControl>
                {isTextarea ? (
                  <Textarea
                    value={(value && value[lang.code]) || ''}
                    onChange={(e) => handleChange(lang.code, e.target.value)}
                    placeholder={placeholder || `Введите ${label.toLowerCase()} на ${lang.name}...`}
                    rows={4}
                    fontSize="14px"
                  />
                ) : (
                  <Input
                    value={(value && value[lang.code]) || ''}
                    onChange={(e) => handleChange(lang.code, e.target.value)}
                    placeholder={placeholder || `Введите ${label.toLowerCase()} на ${lang.name}...`}
                    fontSize="14px"
                  />
                )}
              </FormControl>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Text fontSize="11px" color="gray.500" mt={2}>
        Заполните переводы для всех языков. Если перевод не указан, будет использован русский вариант.
      </Text>
    </Box>
  );
};

export default TranslationFields;

