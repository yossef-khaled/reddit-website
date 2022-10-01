import { FC, useEffect, useState } from "react";
import { Box, Flex, Text } from '@chakra-ui/react';

interface LoadingDotsProps {
    isLoading: boolean;

}

const LoadingDots: FC<LoadingDotsProps> = ({isLoading}) => {
    const [waitingDots, setWaitingDots] = useState('');

    // TODO : use setInterval instead
    const timerForLoadingDots = setTimeout(() => {
        waitingDots.length == 3 ? setWaitingDots('')
        :
        setWaitingDots(`${waitingDots}.`);
      }
    , 500) 
  
    useEffect(() => {
      timerForLoadingDots;
    }, []);

    if(!isLoading) {
        clearTimeout(timerForLoadingDots);
    }
    
    return (
        <Flex>
            <Box ml={'46%'} mr={'50%'}>
                <Text fontSize={"3xl"} fontWeight={"bold"}>
                    Loading{waitingDots}
                </Text>
            </Box>
        </Flex>
    )
}

export default LoadingDots;