import {
    Box,
    Button,
    filter,
    Heading,
    HStack,
    Image,
    Input,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    Flex,
    Divider,
  } from "@chakra-ui/react";
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { Link, useLocation, useSearchParams } from "react-router-dom";
  import Paginantion from "./Pagination";
  import { BASE_URL,BASE_URL1 } from "../constants/config";
  import { NONE } from "../constants/typography";
  import { FiPlus } from "react-icons/fi";
  import { AiOutlineHeart } from "react-icons/ai";
  
  const ProductPage1 = () => {
  
    let [productlist, setproductlist] = useState([]);
    let [fulldata,setfullData]= useState([]);
    let [isError, setisError] = useState(false);
    let [isloading, setisloading] = useState(false);
    let [griddata, setgriddata] = useState("4");
    let [count, setcount] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    let [query,setQuery]= useState("");
  
  let [searchParam,setSearchParam] = useSearchParams()
  
  
  
  useEffect(() => {
          window.scrollTo(0, 0);
        }, [page]);
  
    const [filter, setFilter] = useState({
      price: {
        max: false,
        min: false,
      },
   
    
     
      category: {
        Shirts: false,
        TShirts: false,
        Trousers: false,
        Sneakers: false
       
      },
    });
  
    const search = useLocation().search;
    const catg = new URLSearchParams(search).get("itemGender")
    const catg1 = new URLSearchParams(search).get("itemCategory");
    
    
  
    
    //filtered object of object
    function findTrueValues(data) {
      const trueValues = {};
      for (const key in data) {
        for (const subKey in data[key]) {
          if (data[key][subKey]) {
            trueValues[key] = subKey;
          }
        }
      }
      return trueValues;
    }
  
    
   let finalFilter= findTrueValues(filter)
  
  const searchParams = new URLSearchParams(finalFilter);
  const queryString = searchParams.toString();
  
  
  
  //search box.....
  const handleInputChange = (event) => {
    const query = event.target.value.toUpperCase();
    setQuery(query);
  
  if(!query){
    setproductlist(fulldata)
  }else{
  
    const filteredData = productlist.filter(item => item.productName.includes(query));
    setproductlist(filteredData);
  
  }
  
    
  }
  
  
    let getdata = async (page) => {
      try {
        setisloading(true);
        let res = await axios.get(
          `${BASE_URL1}/cloths?itemGender=${catg}&itemCategory=${catg1}&page=${page}&${queryString}`
        );
        //?gender=female ya kuch bhi filter krna ha too]
        setisError(true);

        setproductlist(res.data.data);
        setfullData(res.data.data)
        setTotalPage(res.data.count);
        setisloading(false);
      } catch (err) {
        setisError(true);
      }
    };
  
    useEffect(() => {
      getdata(page);
    }, [page, filter,searchParam]);
  
    useEffect(() => {}, [griddata]);
  
  
  
    let handleHigh = () => {
      setcount(count + 1);
      let highdata = productlist.sort((a, b) => {
        return Number(b.price) - Number(a.price);
      });
  
      setproductlist(highdata);
    };
  
    let handleLow = () => {
      setcount(count + 1);
      let lowdata = productlist.sort((a, b) => {
        return Number(a.price) - Number(b.price);
      });
  
      setproductlist(lowdata);
    };
  
    
    useEffect(() =>{
      setSearchParam({itemGender: `${catg}`,itemCategory:`${catg1}` ,page:page+1 , ...finalFilter })
    
    },[page, filter])
  
  
  
    if (isloading) {
      return (
        <Box mt={{ base: "80px", sm: "100px", md: "120px" }} paddingX={{ base: "10px", sm: "15px", md: "40px", lg: "60px" }}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
            gap={{ base: "15px", sm: "20px", md: "25px", lg: "30px" }}
            width="100%"
          >
            {[...Array(9)].map((_, i) => (
              <Stack key={i}>
                <Skeleton height={{ base: "300px", md: "400px" }} />
                <Skeleton height="60px" mt={3} />
              </Stack>
            ))}
        </SimpleGrid>
        </Box>
      );
    }
  
    // Function to format category name
    const getCategoryName = () => {
      if (catg1) {
        return catg1
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      if (catg) {
        return catg.charAt(0).toUpperCase() + catg.slice(1).toLowerCase();
    }
      return "Products";
    };
  
    return (
      <Box mt={{ base: "100px", md: "120px" }} paddingX={{ base: "20px", md: "40px", lg: "60px" }}>
        {isError !== "" && <h1>{isError}</h1>}
  
        {/* Category Title */}
        <Heading
          fontSize={{ base: "18px", sm: "20px", md: "22px", lg: "24px" }}
          fontWeight="400"
          textAlign="center"
          letterSpacing="0.5px"
          mb={{ base: "20px", sm: "25px", md: "35px", lg: "40px" }}
        >
          {getCategoryName()}
        </Heading>
        
          <Box>
          {/* Sort and Filter Controls */}
          <Flex
              direction={{ base: "column", md: "row" }}
            gap={{ base: "12px", sm: "15px", md: "20px" }}
            mb={{ base: "25px", sm: "30px", md: "40px" }}
            justifyContent="space-between"
            alignItems={{ base: "flex-start", md: "center" }}
            >
            <HStack gap={{ base: "10px", md: "15px" }}>
              <Button 
                onClick={handleHigh}
                variant="outline"
                size="sm"
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.5px"
                borderRadius="0"
                borderColor="black"
                _hover={{ backgroundColor: "black", color: "white" }}
              >
                High to Low
              </Button>
              <Button 
                onClick={handleLow}
                variant="outline"
                size="sm"
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.5px"
                borderRadius="0"
                borderColor="black"
                _hover={{ backgroundColor: "black", color: "white" }}
              >
                Low to High
              </Button>
              </HStack>
  
            <HStack gap={4} display={{ base: NONE, md: "flex" }}>
              <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="400" letterSpacing="0.5px">Shows</Text>
              <Button 
                onClick={() => setgriddata(2)}
                variant="outline"
                size="sm"
                fontSize="12px"
                borderRadius="0"
                borderColor="black"
                backgroundColor={griddata === "2" ? "black" : "transparent"}
                color={griddata === "2" ? "white" : "black"}
                _hover={{ backgroundColor: "black", color: "white" }}
              >
                2
              </Button>
              <Button 
                onClick={() => setgriddata(3)}
                variant="outline"
                size="sm"
                fontSize="12px"
                borderRadius="0"
                borderColor="black"
                backgroundColor={griddata === "3" ? "black" : "transparent"}
                color={griddata === "3" ? "white" : "black"}
                _hover={{ backgroundColor: "black", color: "white" }}
              >
                3
              </Button>
              <Button 
                onClick={() => setgriddata(4)}
                variant="outline"
                size="sm"
                fontSize="12px"
                borderRadius="0"
                borderColor="black"
                backgroundColor={griddata === "4" ? "black" : "transparent"}
                color={griddata === "4" ? "white" : "black"}
                _hover={{ backgroundColor: "black", color: "white" }}
              >
                4
              </Button>
              </HStack>
          </Flex>
  
          {/* Search Input */}
          <Box mb={{ base: "30px", md: "40px" }}>
            <Input 
              w="100%"
              maxW="500px"
              m="auto"
              type="text" 
              value={query} 
              onChange={handleInputChange} 
              placeholder="Поиск товаров..."
              borderRadius="0"
              borderColor="black"
              borderBottom="1px solid"
              borderTop="none"
              borderLeft="none"
              borderRight="none"
              _focus={{ borderBottom: "1px solid black", boxShadow: "none" }}
              fontSize={{ base: "14px", md: "16px" }}
            />
          </Box>
  
          {/* Products Grid */}
            <SimpleGrid
              columns={
                griddata !== ""
                  ? { base: 1, sm: 2, md: 3, lg: griddata }
                  : { base: 1, sm: 2, md: 3, lg: 3 }
              }
            gap={{ base: "15px", sm: "20px", md: "25px", lg: "30px" }}
            width="100%"
            mb={{ base: "40px", md: "60px" }}
            >
            {productlist.map((el) => {
              const images = el.imageURL?.split(",") || [el.imageURL];
              const firstImage = images[0];
              const secondImage = images[1] || images[0];
              const hasMultipleImages = images.length > 1;
              
              return (
              <Link 
                key={el._id} 
                to={`/products/${el._id}`} 
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'inherit';
                }}
              >
                <Stack
                  backgroundColor="white"
                  cursor="pointer"
                  position="relative"
                  border="none"
                  outline="none"
                  _focus={{ outline: 'none', border: 'none' }}
                  _active={{ outline: 'none', border: 'none' }}
                  _hover={{ border: 'none', outline: 'none' }}
                  sx={{
                    '&:focus': {
                      outline: 'none',
                      border: 'none',
                    },
                    '&:active': {
                      outline: 'none',
                      border: 'none',
                    },
                    '&:hover': {
                      border: 'none',
                      outline: 'none',
                    },
                  }}
                >
                  <Box 
                    position="relative" 
                    overflow="hidden" 
                    backgroundColor="white"
                    className="product-image-container"
                  >
                    <Box
                      position="relative"
                      width="100%"
                      height={{ base: "250px", sm: "300px", md: "400px", lg: "450px" }}
                      sx={{
                        '& .image-main': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 1,
                          transition: 'opacity 0.5s ease-in-out',
                        },
                        '& .image-hover': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          transition: 'opacity 0.5s ease-in-out',
                        },
                        '&:hover .image-main': {
                          opacity: hasMultipleImages ? 0 : 1,
                        },
                        '&:hover .image-hover': {
                          opacity: hasMultipleImages ? 1 : 0,
                        },
                      }}
                >
                      <Image 
                        className="image-main"
                        src={firstImage} 
                        alt={el.productName}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                      {hasMultipleImages && (
                        <Image 
                          className="image-hover"
                          src={secondImage} 
                          alt={el.productName}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      )}
                    </Box>
                  </Box>
  
                  <Stack 
                    p={{ base: "12px", md: "16px" }} 
                    spacing="8px" 
                    textAlign="left"
                    backgroundColor="white"
                    border="none"
                    outline="none"
                    sx={{
                      '&:focus': {
                        outline: 'none',
                        border: 'none',
                        backgroundColor: 'white',
                      },
                      '&:active': {
                        outline: 'none',
                        border: 'none',
                        backgroundColor: 'white',
                      },
                      '&:hover': {
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'white',
                      },
                    }}
                  >
                    <Text
                      fontSize={{ base: "11px", md: "12px" }}
                      fontWeight="400"
                      textTransform="uppercase"
                      letterSpacing="0.3px"
                      noOfLines={2}
                      lineHeight="1.3"
                      textAlign="left"
                      color="black"
                    >
                      {el.productName?.charAt(0).toUpperCase() + el.productName?.slice(1) || "Product"}
                    </Text>
                    <Flex alignItems="center" justifyContent="space-between" mt="4px">
                      <Text 
                        fontSize={{ base: "11px", md: "12px" }} 
                        fontWeight="500" 
                        textAlign="left"
                        color="black"
                      >
                        {parseInt(el.price || 0).toLocaleString('ru-RU')} UZS
                      </Text>
                      <Flex alignItems="center" gap="12px">
                        <Box 
                          cursor="pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle add to cart
                          }}
                          _hover={{ opacity: 0.7 }}
                          transition="opacity 0.2s"
                        >
                          <FiPlus size={16} strokeWidth={1} color="#000000" />
                        </Box>
                        <Box 
                          cursor="pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle bookmark
                          }}
                          _hover={{ opacity: 0.7 }}
                          transition="opacity 0.2s"
                        >
                          <AiOutlineHeart size={14} color="#000000" />
                        </Box>
                      </Flex>
                    </Flex>
                  </Stack>
                </Stack>
              </Link>
            );
            })}
            </SimpleGrid>
          </Box>
  
        {/* Pagination */}
        <Paginantion
          page={page}
          setPage={setPage}
          divide={10}
          totalPage={totalPage}
        />

        {/* Bottom Divider */}
        <Box mt={{ base: "60px", md: "80px" }} mb={{ base: "40px", md: "60px" }}>
          <Divider 
            borderColor="black" 
            borderWidth="1px"
            opacity={0.2}
          />
        </Box>
      </Box>
    );
  };
  
  export default ProductPage1;