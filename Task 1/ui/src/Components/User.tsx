import { Alert, AlertIcon, Button, Heading, HStack, IconButton, Input, Stack, Table, Tbody, Td, Thead, Tr, Image, Box, AlertStatus } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import MessageEdit, { EditMessageProps } from './MessageEdit';
import { useState } from 'react';
import { MessageProps } from './Message';

export interface UpdatePasswordVals {
    oldPassword?: string;
    newPassword?: string;
}

interface InputProps {
    hidden?: boolean;
    messages?: MessageProps[];
    passwordAlertType?: AlertStatus;
    passwordAlertMessage?: string;
    onMessageSubmit(props: EditMessageProps): void;
    onUpdatePassword(props: UpdatePasswordVals): void;
}

export function User(props: InputProps) {
    const [id, setId] = useState<number>();
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [image, setImage] = useState('placeholder.png');
    const [oldPassword, setOldPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();

    const messageEdit = (messageId: number) => {
        props.messages?.forEach((tempMessage) => {
            if (tempMessage.id === messageId) {
                setId(tempMessage.id);
                setSubject(tempMessage.subject);
                setMessage(tempMessage.contents);
                setImage('https://storage.googleapis.com/user_images_cosc2639/m' + tempMessage.id + '.png?rand=' + Math.random());
            }
        });
    };

    const onMessageSubmit = (submitProps: EditMessageProps) => {
        setId(undefined);
        setSubject("");
        setMessage("");
        setImage('placeholder.png')
        props.onMessageSubmit(submitProps);
    };

    const onUpdatePassword = () => {
        const updatePasswordVals: UpdatePasswordVals = {
            oldPassword: oldPassword,
            newPassword: newPassword,
        };

        props.onUpdatePassword(updatePasswordVals);
    };

    if (props.hidden === undefined || !props.hidden) {
        return (
            <Stack spacing={3}>
                <Heading as="h1" fontSize="xx-large">
                    User
                </Heading>
                <Heading as="h2" fontSize="x-large">
                    Change Password
                </Heading>
                <Alert status={props.passwordAlertType} hidden={props.passwordAlertType === undefined}>
                    <AlertIcon />
                    {props.passwordAlertMessage}
                </Alert>
                <Stack spacing={3} width={450}>
                    <Input placeholder="Old Password" type="password" onChange={(e) => setOldPassword(e.target.value)} />
                    <Input placeholder="New Password" type="password" onChange={(e) => setNewPassword(e.target.value)} />
                    <Button onClick={onUpdatePassword}>Change</Button>
                </Stack>
                <Heading as="h2" fontSize="x-large">
                    User Messages
                </Heading>
                <Table variant="striped">
                    <Thead>
                        <Tr>
                            <Td>Subject</Td>
                            <Td width={250}>Posting Date</Td>
                            <Td width={100}></Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {props.messages?.map((tempMessage: MessageProps) => (
                            <Tr key={tempMessage.id}>
                                <Td>{tempMessage.subject}</Td>
                                <td>{new Date(tempMessage.postTime).toLocaleDateString() + ' ' + new Date(tempMessage.postTime).toLocaleTimeString()}</td>
                                <td>
                                    <IconButton id="{tempMessage.id}" aria-label="Edit" icon={<EditIcon />} onClick={() => messageEdit(tempMessage.id)} />
                                </td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                <HStack paddingTop={3} paddingBottom={3} spacing={3} align="top">
                    <Image fit="cover" width={120} height={120} src={image} />
                    <Box width="100%">
                        <MessageEdit id={id} subject={subject} contents={message} onSubmit={onMessageSubmit} newMessage={false}></MessageEdit>
                    </Box>
                </HStack>
            </Stack>
        );
    } else {
        return null;
    }
}

export default User;
