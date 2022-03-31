import { Stack, Input, Button, Alert, AlertIcon, Textarea, Box, AlertStatus } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

export interface EditMessageProps {
    id?: number;
    subject: string;
    contents: string;
    image: string | ArrayBuffer | null;
}

export interface InputProps {
    hidden?: boolean;
    id?: number;
    subject: string;
    contents: string;
    newMessage: boolean;
    onSubmit(props: EditMessageProps): void;
}

export function MessageEdit(props: InputProps) {
    const [id, setId] = useState(props.id);
    const [subject, setSubject] = useState(props.subject);
    const [contents, setContents] = useState(props.contents);
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [imageVal, setImageVal] = useState<string>("");
    const [alertType, setAlertType] = useState<AlertStatus>();
    const [alertMessage, setAlertMessage] = useState<string>();

    useEffect(() => {
        setId(props.id);
        setSubject(props.subject);
        setContents(props.contents);
    }, [props]);

    const submit = () => {
        if (subject === undefined || subject.length === 0 || contents === undefined || contents.length === 0 || (props.newMessage === true && (image === undefined || image === null))) {
            setAlertType('error');
            setAlertMessage('Please fill in all message fields prior to submitting');
        } else {
            setAlertType('success');
            setAlertMessage('Message posted!');

            const editMessageProps: EditMessageProps = {
                id: props.id,
                subject: subject,
                contents: contents,
                image: image,
            };

            props.onSubmit(editMessageProps);

            setId(undefined);
            setSubject('');
            setContents('');
            setImageVal('');
            setImage(null);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let files = event.target.files;
        let reader = new FileReader();

        setImageVal(event.target.value);

        if (files !== null) {
            reader.readAsDataURL(files[0]);

            reader.onload = (e) => {
                if (e.target === null) {
                    setImage(null);
                } else {
                    setImage(e.target.result);
                }
            };
        }
    };

    if (props.hidden === undefined || !props.hidden) {
        return (
            <>
                <Alert status={alertType} hidden={alertType === undefined}>
                    <AlertIcon />
                    {alertMessage}
                </Alert>
                <Box width={450}>
                    <Stack spacing={3} padding={3}>
                        <Input placeholder="Subject" onChange={(e) => setSubject(e.target.value)} value={subject} />
                        <Textarea placeholder="Message" onChange={(e) => setContents(e.target.value)} value={contents} />
                        <Input placeholder="Message Image" type="file" onChange={(e) => handleFileChange(e)} value={imageVal} />
                        <Button onClick={submit} disabled={!props.newMessage && id === undefined}>
                            {props.newMessage || props.newMessage === undefined ? 'Submit' : 'Update'}
                        </Button>
                    </Stack>
                </Box>
            </>
        );
    } else {
        return null;
    }
}

export default MessageEdit;
