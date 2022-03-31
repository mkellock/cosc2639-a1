import { HStack, Image, VStack, Text } from '@chakra-ui/react';

export interface MessageProps {
    id: number,
    subject: string,
    contents: string,
    username: string,
    postTime: number,
}

export function Message(props: MessageProps) {
    return (
        <>
            <HStack paddingTop={3} paddingBottom={3} spacing={3} align="top">
                <Image fit="cover" width={120} height={120} src={'https://storage.googleapis.com/user_images_cosc2639/m' + props?.id + '.png?rand=' + Math.random()} />
                <VStack align="left">
                    <Text fontWeight="bold">{props.subject}</Text>
                    <Text>{props.contents}</Text>
                    <Text fontSize="small">
                        {props.username} - {new Date(props.postTime).toLocaleDateString() + ' ' + new Date(props.postTime).toLocaleTimeString()}
                    </Text>
                </VStack>
            </HStack>
        </>
    );
}

export default Message;
