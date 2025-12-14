import { 
  SimpleGrid, 
  Box, 
  Text, 
  Image, 
  Heading, 
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import React, { useState } from 'react'

const Help = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedItem, setSelectedItem] = useState(null)

  const helpItems = [
    {
      id: 1,
      title: 'SHOP AT LIBERTY.COM',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-bag.svg?ts=1550654368093',
      description: 'Discover our curated collection of modern fashion. Browse through thousands of styles, from everyday essentials to statement pieces. Enjoy seamless shopping with secure checkout and fast delivery.'
    },
    {
      id: 2,
      title: 'SHIPPING AND ORDER STATUS',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-shipping.svg?ts=1550654368093',
      description: 'Track your order in real-time from confirmation to delivery. We offer express shipping options to get your items quickly. Receive notifications at every step of your order journey.'
    },
    {
      id: 3,
      title: 'EXCHANGES AND RETURNS',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-returns.svg?ts=1550654368093',
      description: 'Not satisfied with your purchase? We offer hassle-free returns and exchanges within 30 days. Simply initiate a return online and drop off at any convenient location. Full refund guaranteed.'
    },
    {
      id: 4,
      title: 'PAYMENT',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-payment.svg?ts=1550654368093',
      description: 'Secure payment options including credit cards, debit cards, and digital wallets. All transactions are encrypted and protected. Save your payment methods for faster checkout next time.'
    },
    {
      id: 5,
      title: 'PRODUCT',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-product.svg?ts=1550654368093',
      description: 'Find detailed product information, size guides, and care instructions. View multiple product images and read customer reviews. Get styling tips and recommendations for each item.'
    },
    {
      id: 6,
      title: 'GIFT CARD',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-gift-card.svg?ts=1591250800807',
      description: 'Perfect gift for fashion lovers. Digital and physical gift cards available. No expiration date and can be used online or in-store. Personalize with a custom message for special occasions.'
    },
    {
      id: 7,
      title: 'SHOPS AND COMPANY',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-stores-and-company.svg?ts=1550654368093',
      description: 'Visit our physical stores worldwide for an immersive shopping experience. Our knowledgeable staff is ready to assist you. Find store locations, hours, and contact information easily.'
    },
    {
      id: 8,
      title: 'CLOTHES COLLECTION PROGRAMME',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-clothes-collection-info.svg?ts=1614071652367',
      description: 'Join our sustainability initiative. Bring your old clothes to any store and receive a discount on your next purchase. Together we can reduce fashion waste and support circular economy.'
    },
    {
      id: 9,
      title: 'LIBERTY QR',
      icon: 'https://static.zara.net/photos///contents/mkt/misc/help/icons//icon-80-help-zara-id.svg?ts=1629805802513',
      description: 'Access exclusive content and offers by scanning QR codes in our stores. Get instant product information, styling tips, and special promotions. Connect your digital and physical shopping experience.'
    }
  ]

  const handleItemClick = (item) => {
    setSelectedItem(item)
    onOpen()
  }

  return (
    <Box 
      mt={{ base: "100px", md: "120px" }} 
      paddingX={{ base: "10px", sm: "15px", md: "40px", lg: "60px" }}
      pb={{ base: "60px", md: "80px" }}
    >
      <Heading
        fontSize={{ base: "18px", md: "22px", lg: "24px" }}
        fontWeight="400"
        textAlign="center"
        letterSpacing="0.5px"
        mb={{ base: "40px", md: "60px" }}
      >
        HELP
      </Heading>
   
      <SimpleGrid
        columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: "12px", sm: "15px", md: "30px", lg: "40px" }}
        maxW="1400px"
        marginX="auto"
      >
        {helpItems.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleItemClick(item)}
            cursor="pointer"
          >
            <Stack
              alignItems="center"
              textAlign="center"
              spacing={4}
              p={{ base: "20px", md: "30px" }}
              backgroundColor="white"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-5px)",
                opacity: 0.8,
              }}
            >
              <Box
                width={{ base: "50px", md: "60px" }}
                height={{ base: "50px", md: "60px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                />
              </Box>
              <Text
                fontSize={{ base: "10px", md: "11px" }}
                fontWeight="400"
                letterSpacing="0.5px"
                textTransform="uppercase"
                textAlign="center"
                lineHeight="1.4"
                maxW="150px"
              >
                {item.title}
              </Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
        size={{ base: "sm", md: "md", lg: "lg" }}
      >
        <ModalOverlay 
          bg="blackAlpha.600"
          backdropFilter="blur(2px)"
        />
        <ModalContent
          borderRadius="0"
          maxW={{ base: "90%", md: "600px" }}
          mx="auto"
          animation="fadeIn 0.3s ease-in-out"
          sx={{
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <ModalHeader
            fontSize={{ base: "14px", md: "16px" }}
            fontWeight="400"
            letterSpacing="0.5px"
            textTransform="uppercase"
            textAlign="center"
            pb="10px"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            {selectedItem?.title}
          </ModalHeader>
          <ModalCloseButton
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
            _active={{ backgroundColor: "transparent" }}
          />
          <ModalBody
            py={{ base: "30px", md: "40px" }}
            px={{ base: "25px", md: "35px" }}
          >
            <VStack spacing={4} align="stretch">
              {selectedItem && (
                <>
                  <Box
                    display="flex"
                    justifyContent="center"
                    mb="20px"
                  >
                    <Image
                      src={selectedItem.icon}
                      alt={selectedItem.title}
                      width="60px"
                      height="60px"
                      objectFit="contain"
                    />
                  </Box>
                  <Text
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="300"
                    letterSpacing="0.3px"
                    lineHeight="1.8"
                    textAlign="center"
                    color="gray.700"
                  >
                    {selectedItem.description}
                  </Text>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Help