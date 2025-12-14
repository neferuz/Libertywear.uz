import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Flex minH="100vh" bg="#fafafa">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content */}
      <Box 
        flex="1" 
        ml={{ base: 0, md: sidebarCollapsed ? '80px' : '250px' }} 
        transition="margin-left 0.3s ease"
      >
        <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <Box p={{ base: "20px", md: "30px" }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;

