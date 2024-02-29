import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    HStack,
    IconButton,
    useDisclosure,
    Stack,
    Text,
    Button,
    keyframes,
    Link
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import bgHero from '../assets/backgroundmain.png';
import defuseImg from '../assets/defuse.png';
import bunkerImg from '../assets/bunker.png';
import btnBuy from '../assets/buy.png';
import bgBottom from '../assets/background-bottom.png';
import bgTimer from '../assets/bgTimer.png'
import vectorImg from '../assets/header-vector.png'
const Hero = () => {


return (
  
 
<Box height='80vh' 
bgImage={bgHero.src}
bgRepeat='no-repeat'
bgSize='cover'
overflow={'visible'}

>
<Flex
        justifyContent={{ base: 'space-between' }}
        marginTop={'20px'}
        
        
      >
        <Box>
            <Text
            fontFamily={'Ticking Bomb'}
            color={'primary.text'}
            fontSize={'45px'}
            padding={"20px"}
            >404 BOMB</Text>
        </Box>
        
        <Box
          width="500px" // Adjust the width as needed
          height="80px" // Adjust the height as needed
          backgroundSize="cover"
          backgroundPosition="center"
          bgImage={vectorImg.src} // Adjust the path accordingly
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <ConnectButton />
        </Box>
      </Flex>
<Flex justify={'space-around'} alignItems={'center'}  >
    <Flex mt={'120px'} flexDir={'column'} padding={'20px'}  gap={'20px'}>
    <Text
fontFamily={'Ticking Bomb'}
color= '#EB1B23'
fontSize='70px'
>YOU ARE REKT</Text>
<Text
fontFamily={'Ticking Bomb'}
color= 'primary.text'
fontSize='30px'>
    Your Balance : <span>8432 BOMB</span>
</Text>
<Flex  padding={'20px'} gap={'30px'} alignItems={'center'}>
        <Box bgImage={defuseImg.src}
        bgRepeat={'no-repeat'}
        bgSize={'cover'}
        height={'50px'} width={'190px'}
        textAlign={'center'}
        cursor={'pointer'}>
        
             <Button variant={'unstyled'}
              color={'white'}
               fontFamily={'Ticking Bomb'}
               fontSize={'30px'} fontWeight={'bold'}>DEFUSE</Button>
        </Box>
       
        <Box bgImage={bunkerImg.src}
         bgRepeat={'no-repeat'}
        bgSize={'cover'}
         height={'50px'}
          width={'190px'}
           textAlign={'center'
           }
           cursor={'pointer'}
           >
             <Button variant="unstyled "
              color={'white'}
               fontFamily={'Ticking Bomb'}
               fontSize={'30px'} fontWeight={'bold'}
               >ENTER BUNKER</Button>
        </Box>

    </Flex>
    </Flex>
 
    
    <Box bgImage={bgTimer.src} width={'500px'} textAlign={'center'}
    padding={'20px'}
    bgRepeat={'no-repeat'}
    bgSize={'cover'}>
         <Text color='#EB1B23' fontFamily={'Ticking Bomb'} fontSize={'80px'} >11 : 59 : 50</Text>
    </Box>
       
     
   
   
</Flex>




<Box
bgImage={bgBottom.src}
height={'50vh'}
bgRepeat={'no-repeat'}
bgSize={'cover'}

>
<Flex pl={'200px'} flexDirection={'column'} mt={'60px'}>
<Text fontFamily={'Ticking Bomb'}
color= 'primary.text'
fontSize='40px' flexDirection={'row'}>RULES</Text>
<Flex gap={'3%'}>
    <Flex fontFamily={'Ticking Bomb'}
color= 'primary.text' 
fontSize={'25px'} 
flexDir={'column'}
gap={'30px'}
>
    <Flex maxW={'550px'}>1. If you are inactive for 12 hours, the nuclear bomb will explode and your tokens locked forever.</Flex>
    <Flex maxW={'550px'}>2. Once the nuclear explosion has occurred,your wallet will automatically nuke it salef, and your $BOMB tokens will be locked.</Flex>
    
</Flex>
<Flex fontFamily={'Ticking Bomb'}
color= 'primary.text' 
fontSize={'25px'} 
flexDir={'column'}
gap={'30px'}
>
    <Flex maxW={'650px'}>3. Yoy can delay the explosion at any time by using the “SAVE $BOMS” button to reset the timer or by buying receiving token.</Flex>
    <Flex maxW={'550px'}>4. Hmm Yoy can delay the explosion at any time by using the “SAVE $BOMS” button to reset the timer or by buying receiving token.</Flex>
    
</Flex>
</Flex>

</Flex>
<Flex justify={'space-around'}   mt={'50px'}>
    <Box  >
   

    </Box>
    
    <Flex  padding={'20px'} gap={'20px'} alignItems={'flex-end'}>
        <Box bgImage={btnBuy.src}
        bgRepeat={'no-repeat'}
        bgSize={'cover'}
        height={'45px'} width={'170px'}
        textAlign={'center'}
        cursor={'pointer'} >
        
             <Button variant={'unstyled'}
              color={'white'}
               fontFamily={'Ticking Bomb'}
               fontSize={'25px'} fontWeight={'bold'}
               >BUY $BOMB</Button>
        </Box>
       
        <Box bgImage={btnBuy.src}
         bgRepeat={'no-repeat'}
        bgSize={'cover'}
         height={'45px'}
          width={'173px'}
           textAlign={'center'}
           cursor={'pointer'}>
             <Button variant="unstyled "
              color={'white'}
               fontFamily={'Ticking Bomb'}
               fontSize={'25px'} fontWeight={'bold'}
               
               >CHART</Button>
        </Box>

    </Flex>
   
</Flex>


</Box>

</Box>

)
}

export default Hero;