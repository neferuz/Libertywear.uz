import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useDisclosure,
  Flex,
  Box,
  Text,
  Image,
  Divider,
} from '@chakra-ui/react'
import React from 'react'
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dbody from './Dbody';

function DrawerExample({ isScrolled = false, isHomePage = false }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const navigate = useNavigate();
  const { isAuth, name } = useSelector((state) => state.authReducer);

  return (
    <>
      <Button 
        background="none" 
        ref={btnRef}  
        onClick={onOpen}
        padding="0"
        minWidth="auto"
        height="auto"
        _hover={{ backgroundColor: "transparent" }}
        _active={{ backgroundColor: "transparent" }}
      >
        <Box
          as="span"
          display="inline-flex"
          sx={{
            '& svg': {
              strokeWidth: 1,
              color: isHomePage && !isScrolled ? 'white' : 'black',
              transition: 'color 0.2s',
            }
          }}
        >
          <FiMenu size={24} />
        </Box>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
        size="sm"
        motionPreset="slide"
      >
        <DrawerOverlay 
          bg="rgba(255, 255, 255, 0.8)"
          backdropFilter="blur(10px)"
          sx={{
            animation: 'fadeIn 0.3s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        />
        <DrawerContent 
          backgroundColor="white"
          sx={{
            animation: 'slideInBlur 0.4s ease-out',
            '@keyframes slideInBlur': {
              '0%': {
                transform: 'translateX(-100%)',
                filter: 'blur(20px)',
                opacity: 0
              },
              '100%': {
                transform: 'translateX(0)',
                filter: 'blur(0px)',
                opacity: 1
              }
            }
          }}
        >
          <DrawerCloseButton />
          <DrawerHeader>
            <Image 
              maxHeight="60px" 
              src="/logo.svg" 
              alt='Zara Logo' 
            />
          </DrawerHeader>

          <DrawerBody mt="10px" display="flex" flexDirection="column" height="100%">
            {/* Categories */}
            <Dbody onClose={onClose} isAuth={isAuth} name={name} navigate={navigate} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerExample;
