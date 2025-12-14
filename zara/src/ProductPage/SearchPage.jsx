import { Box, Grid, Heading, HStack, Image, Stack, Text, SimpleGrid, Flex, Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Paginantion from "./Pagination";
import Loading from "../Components/Loading/Loading";
import { BASE_URL1 } from "../constants/config";
import { AUTO, FILL_90PARENT, R1, R2, R3, R4 } from "../constants/typography";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  let query = searchParams.get("q")
    ? searchParams.get("q").toLocaleLowerCase()
    : "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  
  useEffect(() => {
    let getSearch = async () => {
      setLoading(true);
      try {
      let res = await axios({
        method: "get",
          url: BASE_URL1 + `/search?q=${query}&page=${page}`,
      });

      if (res.data.status == 1) {
          setLoading(false);
          setData(res.data.data || []);
          setTotalPages(res.data.count || 0);
      } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (query != "") {
      getSearch();
  }
  }, [searchParams, page]);

  useEffect(() => {
    let getRecommended = async () => {
      setRecommendedLoading(true);
      try {
        let res = await axios.get(`${BASE_URL1}/cloths?page=0&limit=5`);
        if (res.data.data) {
          setRecommendedProducts(res.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setRecommendedLoading(false);
      }
    };
    getRecommended();
  }, []);

  if (loading) return <Loading />;
  
  return (
    <Box width="100%" paddingX={{ base: "20px", md: "40px", lg: "60px" }} mt={{ base: "100px", md: "120px" }}>
      {/* Search Results Header */}
      <Box mb={{ base: "30px", md: "50px" }}>
        <Heading
          fontSize={{ base: "20px", md: "28px", lg: "32px" }}
          fontWeight="300"
          letterSpacing="1px"
        >
          {totalPages > 0 ? `${totalPages} Matching Results` : "No Results Found"}
            </Heading>
        {query && (
          <Text fontSize={{ base: "14px", md: "16px" }} color="#666" mt="10px">
            Search results for: <strong>"{query}"</strong>
            </Text>
        )}
      </Box>

      {/* Search Results Grid */}
      {data.length > 0 ? (
        <>
          <Grid
            mt={8}
            gap={{ base: "20px", md: "30px" }}
            gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
          >
            {data.map((el) => (
              <Link key={el._id} to={`/products/${el._id}`}>
                <Stack
                  textAlign="left"
                  backgroundColor="white"
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px",
                  }}
                  transition="all 0.3s ease"
                  overflow="hidden"
                >
                  <Box position="relative" overflow="hidden" backgroundColor="#f5f5f5">
                    <Image
                      src={el.imageURL?.split(",")[0] || el.imageURL}
                      alt={el.productName}
                      width="100%"
                      height={{ base: "300px", md: "400px" }}
                      objectFit="cover"
                      _hover={{
                        transform: "scale(1.05)",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  </Box>

                  <Stack p={5} spacing="8px">
                    <Text
                      fontSize={{ base: "14px", md: "16px" }}
                      fontWeight="500"
                      textTransform="capitalize"
                      letterSpacing="0.5px"
                      noOfLines={2}
                    >
                      {el.productName?.charAt(0).toUpperCase() + el.productName?.slice(1) || "Product"}
                    </Text>
                    <Text fontSize={{ base: "16px", md: "18px" }} fontWeight="600">
                      ₹ {el.price}
                    </Text>
                    {el.sizes && (
                      <HStack display="flex" justifyContent="flex-start" gap={2} mt={2}>
                        {el.sizes.split(",").slice(0, 3).map((size, idx) => (
                <Box
                            key={idx}
                            borderRadius="2px"
                            border="1px solid #e5e5e5"
                  px={2}
                            py={1}
                            fontSize="12px"
                            backgroundColor="#f8f8f8"
                            color="black"
                >
                            {size.trim()}
                </Box>
              ))}
            </HStack>
                    )}
          </Stack>
        </Stack>
              </Link>
      ))}
        </Grid>

          {/* Pagination */}
          {totalPages > 12 && (
            <Box mt={{ base: "40px", md: "60px" }}>
              <Paginantion
                page={page}
                setPage={setPage}
                totalPage={totalPages}
                divide={12}
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={{ base: "60px", md: "100px" }}>
          <Text fontSize={{ base: "18px", md: "24px" }} fontWeight="300" mb="20px">
            No products found matching your search
          </Text>
          <Link to="/products">
            <Button
              borderRadius="0"
              backgroundColor="black"
              color="white"
              _hover={{ backgroundColor: "#333" }}
              padding="20px 40px"
            >
              Browse All Products
            </Button>
          </Link>
        </Box>
      )}

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <Box mt={{ base: "60px", md: "100px" }} mb={{ base: "40px", md: "60px" }}>
          <Heading
            fontSize={{ base: "24px", md: "32px", lg: "36px" }}
            fontWeight="300"
            textAlign="center"
            mb={{ base: "30px", md: "50px" }}
            letterSpacing="2px"
          >
            ВАМ ТАКЖЕ МОЖЕТ ПОНРАВИТЬСЯ
          </Heading>

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
            spacing={{ base: "20px", md: "30px" }}
            width="100%"
          >
            {recommendedProducts.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`}>
                <Stack
                  textAlign="left"
                  backgroundColor="white"
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px",
                  }}
                  transition="all 0.3s ease"
                  overflow="hidden"
                >
                  <Box position="relative" overflow="hidden" backgroundColor="#f5f5f5">
                    <Image
                      src={product.imageURL}
                      alt={product.productName}
                      width="100%"
                      height={{ base: "300px", md: "400px" }}
                      objectFit="cover"
                      _hover={{
                        transform: "scale(1.05)",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  </Box>

                  <Stack p={4} spacing="6px">
                    <Text
                      fontSize={{ base: "13px", md: "15px" }}
                      fontWeight="500"
                      textTransform="capitalize"
                      letterSpacing="0.5px"
                      noOfLines={2}
                    >
                      {product.productName?.charAt(0).toUpperCase() + product.productName?.slice(1) || "Product"}
                    </Text>
                    <Text fontSize={{ base: "15px", md: "17px" }} fontWeight="600">
                      ₹ {product.price}
                    </Text>
                  </Stack>
                </Stack>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}
