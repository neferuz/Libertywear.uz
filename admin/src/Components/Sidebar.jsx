import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Flex, 
  Icon,
  Divider,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiSettings,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiMail,
  FiHelpCircle,
  FiMessageSquare,
  FiShare2,
  FiArrowLeft,
  FiArrowRight
} from 'react-icons/fi';

const Sidebar = ({ collapsed, setCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Синхронизируем состояние мобильного меню
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      onOpen();
    }
  }, [isMobileMenuOpen]);
  
  const handleClose = () => {
    onClose();
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };
  
  const sidebarWidth = collapsed ? '80px' : '250px';

  const menuItems = [
    { icon: FiHome, label: 'Главная', path: '/' },
    { icon: FiPackage, label: 'Товары', path: '/products' },
    { icon: FiShoppingCart, label: 'Заказы', path: '/orders' },
    { icon: FiUsers, label: 'Пользователи', path: '/users' },
    { icon: FiMessageSquare, label: 'Сообщения', path: '/contact-messages' },
    { icon: FiSettings, label: 'Настройки', path: '/settings' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const MenuContent = ({ isMobile = false, setCollapsed, collapsed, onClose }) => (
    <>
      {/* Logo */}
      <Box p="30px 20px" borderBottom="1px solid" borderColor="#e5e5e5" position="relative">
        {!collapsed || isMobile ? (
          <>
            <Flex align="flex-start" justify="space-between" mb="5px">
              <Text
                fontSize="24px"
                fontWeight="400"
                letterSpacing="2px"
                textTransform="uppercase"
                color="black"
              >
                Liberty
              </Text>
              {/* Collapse Button - Desktop (near logo) */}
              {!isMobile && (
                <Box
                  w="20px"
                  h="20px"
                  bg="transparent"
                  borderRadius="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  flexShrink={0}
                  onClick={() => setCollapsed(!collapsed)}
                  _hover={{ opacity: 0.7 }}
                  transition="all 0.2s"
                  ml="10px"
                >
                  <svg
                    width="18"
                    height="12"
                    viewBox="0 0 18 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="17"
                      height="11"
                      rx="1.5"
                      stroke="black"
                      strokeWidth="1"
                      fill="none"
                    />
                    <line
                      x1={collapsed ? "9" : "6"}
                      y1="0.5"
                      x2={collapsed ? "9" : "6"}
                      y2="11.5"
                      stroke="black"
                      strokeWidth="1"
                    />
                  </svg>
                </Box>
              )}
            </Flex>
            <Text
              fontSize="11px"
              fontWeight="300"
              letterSpacing="1px"
              color="gray.600"
            >
              Admin Panel
            </Text>
          </>
        ) : (
          <Flex align="center" justify="center" position="relative">
            <Text
              fontSize="20px"
              fontWeight="400"
              letterSpacing="2px"
              textTransform="uppercase"
              color="black"
            >
              L
            </Text>
            {/* Collapse Button - Desktop (when collapsed) */}
            {!isMobile && (
              <Box
                position="absolute"
                top="0"
                right="0"
                w="20px"
                h="20px"
                bg="transparent"
                borderRadius="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={() => setCollapsed(!collapsed)}
                _hover={{ opacity: 0.7 }}
                transition="all 0.2s"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="2"
                    width="12"
                    height="10"
                    rx="1.5"
                    stroke="black"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <line
                    x1={collapsed ? "7" : "4.5"}
                    y1="3"
                    x2={collapsed ? "7" : "4.5"}
                    y2="11"
                    stroke="black"
                    strokeWidth="1.2"
                  />
                </svg>
              </Box>
            )}
          </Flex>
        )}
      </Box>

      {/* Menu Items */}
      <VStack spacing="0" align="stretch" mt="20px" flex="1" overflowY="auto">
        {menuItems.map((item, index) => {
          const active = isActive(item.path);
          const menuItem = (
            <Flex
              align="center"
              justify={collapsed && !isMobile ? "center" : "flex-start"}
              p="15px 20px"
              bg={active ? 'black' : 'transparent'}
              color={active ? 'white' : 'black'}
              _hover={{
                bg: active ? 'black' : '#fafafa',
                color: active ? 'white' : 'black',
              }}
              transition="all 0.2s"
              cursor="pointer"
              borderLeft={active ? '3px solid black' : '3px solid transparent'}
            >
              <Icon as={item.icon} boxSize="20px" mr={collapsed && !isMobile ? "0" : "15px"} />
              {(collapsed && !isMobile) ? null : (
                <Text
                  fontSize="13px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                >
                  {item.label}
                </Text>
              )}
            </Flex>
          );

          return (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => {
                if (isMobile && onClose) {
                  onClose();
                }
              }}
            >
              {collapsed && !isMobile ? (
                <Tooltip label={item.label} placement="right" hasArrow>
                  {menuItem}
                </Tooltip>
              ) : (
                menuItem
              )}
            </NavLink>
          );
        })}
      </VStack>

      <Divider my="15px" borderColor="#e5e5e5" />

      {/* Categories Link */}
      <NavLink to="/categories" onClick={() => isMobile && onClose()}>
        <Flex
          align="center"
          justify={collapsed && !isMobile ? "center" : "flex-start"}
          p="15px 20px"
          bg={location.pathname === '/categories' ? 'black' : 'transparent'}
          color={location.pathname === '/categories' ? 'white' : 'black'}
          _hover={{
            bg: location.pathname === '/categories' ? 'black' : '#fafafa',
            color: location.pathname === '/categories' ? 'white' : 'black',
          }}
          transition="all 0.2s"
          cursor="pointer"
          borderLeft={location.pathname === '/categories' ? '3px solid black' : '3px solid transparent'}
        >
          <Icon as={FiPackage} boxSize="20px" mr={collapsed && !isMobile ? "0" : "15px"} />
          {collapsed && !isMobile ? null : (
            <Text
              fontSize="13px"
              fontWeight="400"
              letterSpacing="0.5px"
              textTransform="uppercase"
            >
              Категории
            </Text>
          )}
        </Flex>
      </NavLink>

      <Divider my="15px" borderColor="#e5e5e5" />

      {/* Additional Pages */}
      <VStack spacing="0" align="stretch" mt="auto" mb="15px">
        {[
          { icon: FiInfo, label: 'О компании', path: '/about' },
          { icon: FiMail, label: 'Контакты', path: '/contacts' },
          { icon: FiHelpCircle, label: 'FAQ', path: '/faq' },
          { icon: FiShare2, label: 'Социальные сети', path: '/social-links' },
        ].map((item) => {
          const active = location.pathname === item.path;
          const menuItem = (
            <Flex
              align="center"
              justify={collapsed && !isMobile ? "center" : "flex-start"}
              p="15px 20px"
              bg={active ? 'black' : 'transparent'}
              color={active ? 'white' : 'black'}
              _hover={{
                bg: active ? 'black' : '#fafafa',
                color: active ? 'white' : 'black',
              }}
              transition="all 0.2s"
              cursor="pointer"
              borderLeft={active ? '3px solid black' : '3px solid transparent'}
            >
              <Icon as={item.icon} boxSize="20px" mr={collapsed && !isMobile ? "0" : "15px"} />
              {collapsed && !isMobile ? null : (
                <Text
                  fontSize="13px"
                  fontWeight="400"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                >
                  {item.label}
                </Text>
              )}
            </Flex>
          );

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && onClose()}
            >
              {collapsed && !isMobile ? (
                <Tooltip label={item.label} placement="right" hasArrow>
                  {menuItem}
                </Tooltip>
              ) : (
                menuItem
              )}
            </NavLink>
          );
        })}
      </VStack>

      {/* Footer */}
      {(!collapsed || isMobile) && (
        <Box p="20px" textAlign="center" borderTop="1px solid" borderColor="#e5e5e5">
          <Text fontSize="10px" color="gray.500" letterSpacing="0.5px">
            Made by PRO AI
          </Text>
        </Box>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={handleClose}
        size="sm"
      >
        <DrawerOverlay bg="rgba(0, 0, 0, 0.5)" />
        <DrawerContent bg="white" borderRadius="0">
          <DrawerCloseButton color="black" _hover={{ bg: '#fafafa' }} />
          <DrawerBody p="0" display="flex" flexDirection="column" height="100%">
            <MenuContent isMobile={true} setCollapsed={setCollapsed} collapsed={collapsed} onClose={handleClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        position="fixed"
        left="0"
        top="0"
        h="100vh"
        w={sidebarWidth}
        bg="white"
        borderRight="1px solid"
        borderColor="#e5e5e5"
        zIndex="1000"
        transition="width 0.3s ease"
        overflow="hidden"
        flexDirection="column"
      >
        <MenuContent setCollapsed={setCollapsed} collapsed={collapsed} />
      </Box>
    </>
  );
};

export default Sidebar;
