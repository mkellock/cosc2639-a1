import { Stack, Input, Button, Alert, AlertIcon } from '@chakra-ui/react';
import { useState } from 'react';

export interface RegisterDetails {
    id: string;
    username: string;
    password: string;
    image: string | ArrayBuffer | null;
}

interface InputProps {
    hidden?: boolean;
    inError?: boolean;
    errorMessage?: string;
    onSubmit(props: RegisterDetails): void;
}

export function Register(props: InputProps) {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [inError, setInError] = useState<boolean>();
    const [errorMessage, setErrorMessage] = useState<string>();

    const submit = () => {
        setInError(false);
        setErrorMessage('');

        if (id.length === 0 || username.length === 0 || password.length === 0 || image === null) {
            setInError(true);
            setErrorMessage('Please fill in all form fields');
        } else {
            const registerDetails: RegisterDetails = {
                id: id,
                username: username,
                password: password,
                image: image,
            };

            props.onSubmit(registerDetails);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let files = event.target.files;
        let reader = new FileReader();

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
                {inError || props.inError ? (
                    <Alert status="error">
                        <AlertIcon />
                        {errorMessage}
                        {props.errorMessage}
                    </Alert>
                ) : null}
                <Stack spacing={3} width={450} padding={3} hidden={false}>
                    <Input onChange={(e) => setId(e.target.value)} placeholder="ID" />
                    <Input onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <Input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                    <Input onChange={(e) => handleFileChange(e)} placeholder="User Image" type="file" />
                    <Button onClick={submit}>Register</Button>
                </Stack>
            </>
        );
    } else {
        return null;
    }
}

export default Register;
