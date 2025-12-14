import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL1 } from "../constants/config";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import "./moredetails.css";

function Dbody({ onClose, isAuth, name, navigate }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL1}/categories/`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedLink(category.id);
    // Переключаем раскрытие категории
    setExpandedCategories(prev => ({
      ...prev,
      [category.id]: !prev[category.id]
    }));
  };

  const handleItemClick = (link) => {
    setSelectedLink(link);
    if (onClose) {
      onClose();
    }
  };

  const getCategoryLink = (category) => {
    const gender = category.gender || (category.title?.toLowerCase().includes("kid") ? "kids" : category.title?.toLowerCase().includes("men") ? "male" : "female");
    return `/products?itemGender=${gender}`;
  };

  const getSubcategoryLink = (subcategory, parentCategory) => {
    const gender = subcategory.gender || parentCategory.gender || "female";
    const slug = subcategory.slug || subcategory.title?.toLowerCase().replace(/\s+/g, '-') || '';
    return `/products?itemGender=${gender}&category=${slug}`;
  };

  if (loading) {
    return (
      <Box className="scrolldetails">
        <Text fontSize="xs" color="gray.500">Загрузка...</Text>
      </Box>
    );
  }

  return (
    <Box className="scrolldetails" display="flex" flexDirection="column" height="100%" minHeight="100%">
      {/* Категории как список */}
      <Box flex="1">
        {categories.map((category, index) => {
          const categoryTitle = category.title || category.name || 'Category';
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          const isExpanded = expandedCategories[category.id];
          const isLastCategory = index === categories.length - 1;
          
          return (
            <Box key={category.id} borderBottom={isLastCategory ? "none" : "1px solid #e5e5e5"}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                paddingY="15px"
                cursor="pointer"
              onClick={() => handleCategoryClick(category)}
                _hover={{ backgroundColor: "#fafafa" }}
                transition="background-color 0.2s"
              >
                <Text
                  fontSize="14px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  color="black"
                >
                  {categoryTitle.toUpperCase()}
                </Text>
                {hasSubcategories && (
                  <Box
                    transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
                    transition="transform 0.3s ease"
            >
                    <FiChevronDown size={18} color="black" />
            </Box>
                )}
      </Flex>
              
              {/* Подкатегории - показываем если категория раскрыта */}
              {isExpanded && hasSubcategories && (
                <Box paddingLeft="20px" paddingBottom="10px" backgroundColor="#fafafa">
                  {category.subcategories.map((subcategory) => {
            const subcategoryTitle = subcategory.title || subcategory.name || 'Subcategory';
                    const link = getSubcategoryLink(subcategory, category);
            return (
                      <Box
                        key={subcategory.id}
                        paddingY="10px"
                        cursor="pointer"
                        _hover={{ opacity: 0.7 }}
                        transition="opacity 0.2s"
                      >
                <Link 
                  to={link} 
                  onClick={() => handleItemClick(link)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Text
                            fontSize="13px"
                            fontWeight="400"
                            letterSpacing="0.3px"
                            color="#666"
                >
                  {subcategoryTitle}
                          </Text>
                </Link>
                      </Box>
            );
                  })}
                </Box>
              )}
              
              {/* Если нет подкатегорий, показываем ссылку на все товары при клике */}
              {isExpanded && !hasSubcategories && (
                <Box paddingLeft="20px" paddingBottom="10px" backgroundColor="#fafafa">
                  <Box
                    paddingY="10px"
                    cursor="pointer"
                    _hover={{ opacity: 0.7 }}
                    transition="opacity 0.2s"
                  >
            <Link 
                      to={getCategoryLink(category)} 
                      onClick={() => handleItemClick(getCategoryLink(category))}
              style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Text
                        fontSize="13px"
                        fontWeight="400"
                        letterSpacing="0.3px"
                        color="#666"
            >
              Все товары
                      </Text>
            </Link>
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      
      {/* Дополнительные ссылки внизу */}
      <Box mt="auto" borderTop="1px solid #e5e5e5" paddingTop="20px" paddingBottom="20px">
        {/* Поиск */}
        <Flex
          paddingY="12px"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ 
            backgroundColor: "black",
            '& svg': {
              color: 'white'
            },
            '& p': {
              color: 'white'
            }
          }}
          transition="all 0.2s"
          onClick={() => {
            if (navigate) {
              navigate('/search');
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          <Text
            fontSize="14px"
            fontWeight="400"
            letterSpacing="0.5px"
            color="black"
            transition="color 0.2s"
          >
            Поиск
          </Text>
          <Box transition="color 0.2s">
            <FiChevronRight size={18} color="#ccc" />
          </Box>
        </Flex>
        
        {/* Профиль */}
        <Flex
          paddingY="12px"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ 
            backgroundColor: "black",
            '& svg': {
              color: 'white'
            },
            '& p': {
              color: 'white'
            }
          }}
          transition="all 0.2s"
          onClick={() => {
            if (navigate) {
              if (!isAuth) {
                navigate('/login');
              } else {
                navigate('/profile');
              }
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          <Text
            fontSize="14px"
            fontWeight="400"
            letterSpacing="0.5px"
            color="black"
            transition="color 0.2s"
          >
            Профиль
          </Text>
          <Box transition="color 0.2s">
            <FiChevronRight size={18} color="#ccc" />
      </Box>
        </Flex>
        
        {/* О компании */}
        <Flex
          paddingY="12px"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ 
            backgroundColor: "black",
            '& svg': {
              color: 'white'
            },
            '& p': {
              color: 'white'
            }
          }}
          transition="all 0.2s"
        >
          <Link 
            to="/about" 
            style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
            onClick={() => onClose && onClose()}
          >
            <Text
              fontSize="14px"
              fontWeight="400"
              letterSpacing="0.5px"
              color="black"
              transition="color 0.2s"
          >
            О компании
            </Text>
          </Link>
          <Box transition="color 0.2s">
            <FiChevronRight size={18} color="#ccc" />
          </Box>
        </Flex>
        
        {/* Контакты */}
        <Flex
          paddingY="12px"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ 
            backgroundColor: "black",
            '& svg': {
              color: 'white'
            },
            '& p': {
              color: 'white'
            }
          }}
          transition="all 0.2s"
        >
          <Link 
            to="/contacts" 
            style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
            onClick={() => onClose && onClose()}
          >
            <Text
              fontSize="14px"
              fontWeight="400"
              letterSpacing="0.5px"
              color="black"
              transition="color 0.2s"
          >
            Контакты
            </Text>
          </Link>
          <Box transition="color 0.2s">
            <FiChevronRight size={18} color="#ccc" />
          </Box>
        </Flex>
        
        {/* FAQ */}
        <Flex
          paddingY="12px"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ 
            backgroundColor: "black",
            '& svg': {
              color: 'white'
            },
            '& p': {
              color: 'white'
            }
          }}
          transition="all 0.2s"
        >
          <Link 
            to="/faq" 
            style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
            onClick={() => onClose && onClose()}
          >
            <Text
              fontSize="14px"
              fontWeight="400"
              letterSpacing="0.5px"
              color="black"
              transition="color 0.2s"
            >
            FAQ
            </Text>
          </Link>
          <Box transition="color 0.2s">
            <FiChevronRight size={18} color="#ccc" />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Dbody;
