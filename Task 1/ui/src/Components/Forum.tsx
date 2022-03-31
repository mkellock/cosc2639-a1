import { Alert, AlertIcon, Heading } from '@chakra-ui/react';
import Message, { MessageProps } from './Message';
import MessageEdit, { EditMessageProps } from './MessageEdit';

interface InputProps {
    hidden?: boolean;
    messages?: MessageProps[];
    onMessageSubmit(props: EditMessageProps): void;
}

export function Forum(props: InputProps) {
    if (props.hidden === undefined || !props.hidden) {
        return (
            <>
                <Heading as="h1" fontSize="xx-large">
                    New Message
                </Heading>
                <MessageEdit subject="" contents="" onSubmit={props.onMessageSubmit} newMessage={true}></MessageEdit>
                <Heading as="h1" fontSize="xx-large">
                    Forum
                </Heading>
                {props.messages === undefined || props.messages?.length === 0 ? (
                    <Alert status="info">
                        <AlertIcon />
                        No messages to display
                    </Alert>
                ) : (
                    props.messages?.map((message: MessageProps) => <Message key={message.id} id={message.id} subject={message.subject} contents={message.contents} userid={message.userid} username={message.username} postTime={message.postTime}></Message>)
                )}
            </>
        );
    } else {
        return null;
    }
}

export default Forum;
