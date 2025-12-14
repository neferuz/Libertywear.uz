import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { BOLD, CENTER, FILL_PARENT, ORANGE } from "../constants/typography";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function Paginantion({page,setPage,totalPage,divide}){

    return <HStack mt={6}  w={FILL_PARENT} justify={CENTER}>

        <IconButton 
          icon={<FiChevronLeft size={20} />}  
          isDisabled={page+1==1} 
          onClick={()=>{
            setPage((prev)=>prev-1)
          }}
          variant="ghost"
          color="black"
          backgroundColor="transparent"
          _hover={{ backgroundColor: "transparent", color: "black", opacity: 0.7 }}
          _active={{ backgroundColor: "transparent" }}
          _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
          borderRadius="0"
        />
        <Text 
          fontWeight="400"
          color="black"
          fontFamily="'Manrope', sans-serif"
        >
          {page+1}
        </Text>
        <IconButton 
          icon={<FiChevronRight size={20} />} 
          isDisabled={page+1==Math.ceil(totalPage/divide)||totalPage==0} 
          onClick={()=>{
            setPage((prev)=>prev+1)
          }}
          variant="ghost"
          color="black"
          backgroundColor="transparent"
          _hover={{ backgroundColor: "transparent", color: "black", opacity: 0.7 }}
          _active={{ backgroundColor: "transparent" }}
          _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
          borderRadius="0"
        />

    </HStack>
}