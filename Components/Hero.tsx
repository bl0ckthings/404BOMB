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

import DefuseButton from './DefuseButton';
import BunkerButton from './BunkerButton';
import { startTimerSafeHouse } from '../utils/TimerSafeHouse';
import { startTimer } from '../utils/Timer';
import { formatEther } from 'ethers';
import {  useAccount } from 'wagmi'
import { useContracts } from '../utils/ContractsProvider';



const Hero = () => {
   
   
    const [isSafe, setIsSafe] = useState(true);
    const [remainingTimeinBunker, setNewTimerBunker] = useState<string>('');
    const [remainingTime, setNewTimer] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [isInBunker, setisInBunker] = useState(false);
    

    const contracts = useContracts();

    const { address: account, isConnected, connector } = useAccount()

    useEffect(() => {
        const fetchBalance = async () => {
          if (!account || !(contracts as any).TST404) return;
        
          if (account !== undefined) {
            const balance = await (contracts as any).TST404('0x9CA8c793E5edFcE3732a3685a591e262E799530b').balanceOf(account);
        
            const userBalance = formatEther(balance).toString();
            setBalance(Number(userBalance));
          }
        };
        fetchBalance();
      },[account, contracts])

      useEffect(() => {
        const checkIsInBunker = async () => {
          try {
            if (account !== undefined) {
              const isInBunkerResult = await (contracts as any).TST404('0x9CA8c793E5edFcE3732a3685a591e262E799530b').inBunker(account);
            
              setisInBunker(isInBunkerResult);
            }
          } catch (error) {
            console.error(error);
          }
        };
        checkIsInBunker()
      },[account, contracts]);
      
      const SetTimer = async (account: string | undefined, contracts: any) => {
        if (account !== undefined) {
            const data = await contracts.TST404('0x9CA8c793E5edFcE3732a3685a591e262E799530b').getSecondsLeft(account);
            const timestamp = data.toString();
            const intervalId = startTimer(timestamp, (remainingTime: string) => {
                setNewTimer(remainingTime);
            });

            return () => clearInterval(intervalId);
        }
    };

    // Call SetTimer function within useEffect
    useEffect(() => {
        SetTimer(account, contracts); // Assuming account and contracts are defined
    }, [account, contracts]); 
  
      useEffect(() => {
        const SetTimerBunker = async () => {
            if (account !== undefined) {

          const data = await (contracts as any).TST404('0x9CA8c793E5edFcE3732a3685a591e262E799530b').nextExplosionOf(account);
          const timestamp = data.toString();
          const intervalId = startTimerSafeHouse(timestamp, (remainingTimeinBunker: string) => {
            setNewTimerBunker(remainingTimeinBunker);
          });
    
          return () => clearInterval(intervalId);
        }
        };
    
        SetTimerBunker();
      }, [account, contracts]);
  
  
      useEffect(() => {
        setIsSafe(remainingTime !== '00:00:00');
      }, [remainingTime])

      useEffect(() => {
        let tickingAudio: HTMLAudioElement | null = null;
        if (typeof window !== "undefined") {
            tickingAudio = new Audio('/TickSound.mp3');
        }

        // Function to start playing ticking sound
        const playTickingSound = () => {
            if (remainingTime !== '00:00:00' && remainingTime !== '' && tickingAudio) {
                tickingAudio.play()
                    .catch(error => console.error("Audio play failed", error));
                // Loop the ticking sound
                tickingAudio.loop = true;
            } else  if (tickingAudio){
                // Stop the ticking sound when the timer reaches 00:00:00
                tickingAudio.pause();
                tickingAudio.currentTime = 0; // Rewind the sound
            }
        };

        // Call the playTickingSound function whenever remainingTime changes
        playTickingSound();

        // Cleanup function to stop the sound when the component unmounts
        return () => {
            if (tickingAudio) {
                tickingAudio.pause();
                tickingAudio.currentTime = 0;
            }
        };
    }, [remainingTime]);


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
        { !isSafe && !isInBunker && (
                <Text
fontFamily={'Ticking Bomb'}
color= '#EB1B23'
fontSize='70px'
>YOU ARE REKT</Text>
        )}
         { isSafe && !isInBunker && (
                <Text
fontFamily={'Ticking Bomb'}
color= '#05FD03'
fontSize='70px'
>YOU ARE SAFE</Text>
        )}


<Text
fontFamily={'Ticking Bomb'}
color= 'primary.text'
fontSize='30px'>
    Your Balance : <span className='span'>{balance}</span> $404BOMB
</Text>
<Flex  padding={'20px'} gap={'30px'} alignItems={'center'}>
        <Box bgImage={defuseImg.src}
        bgRepeat={'no-repeat'}
        bgSize={'cover'}
        height={'50px'} width={'190px'}
        textAlign={'center'}
        cursor={'pointer'}>
        
             <Box 
              color={'white'}
               fontFamily={'Ticking Bomb'}
               fontSize={'30px'} fontWeight={'bold'}>
                <DefuseButton />
               </Box>
               
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
             <Box 
              color={'white'}
               fontFamily={'Ticking Bomb'}
               fontSize={'30px'} fontWeight={'bold'}
               ><BunkerButton/></Box>
        </Box>

    </Flex>
    </Flex>
 
    
    <Box bgImage={bgTimer.src} width={'500px'} textAlign={'center'}
    padding={'20px'}
    bgRepeat={'no-repeat'}
    bgSize={'cover'}>
        {isSafe && !isInBunker && (
        <Text color='#EB1B23' fontFamily={'Ticking Bomb'} fontSize={'30px'} >
            TIME BEFORE EXPLOSION :
        </Text>
        )}
         {isInBunker && (
        <Text color='#EB1B23' fontFamily={'Ticking Bomb'} fontSize={'30px'} >
            TIME LEFT IN BUNKER :
        </Text>
        )}
        {isSafe && !isInBunker && (
         <Text color='#EB1B23' fontFamily={'Ticking Bomb'} fontSize={'80px'} >{remainingTime}</Text>
        )}
         {isInBunker && (
         <Text color='#EB1B23' fontFamily={'Ticking Bomb'} fontSize={'80px'} >{remainingTimeinBunker}</Text>
        )}
         {!isSafe  && !isInBunker && (
         <Text color='#EB1B23' fontFamily={'Ticking Bomb'} fontSize={'80px'} >{remainingTime}</Text>
        )}
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
    
    <Flex  padding={'20px'} gap={'20px'} alignItems={'flex-end'} mt={'30px'} mr={'40px'}>
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