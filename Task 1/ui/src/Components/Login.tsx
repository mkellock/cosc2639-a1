import { Stack, Input, Button, Link, Alert, AlertIcon } from '@chakra-ui/react';
import { useState } from 'react';

export interface LoginDetails {
    username: string;
    password: string;
}

export interface InputProps {
    hidden?: boolean;
    inError?: boolean;
    errorMessage?: string;
    onSubmit(props: LoginDetails): void;
    onRegister(): void;
}

export function Login(props: InputProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inError, setInError] = useState<boolean>();
    const [errorMessage, setErrorMessage] = useState<string>();

    const submit = () => {
        setInError(false);
        setErrorMessage('');

        if (username.length === 0 || password.length === 0) {
            setInError(true);
            setErrorMessage('Please enter your username and password');
        } else {
            const loginDetails: LoginDetails = {
                username: username,
                password: password,
            };

            props.onSubmit(loginDetails);
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
                    <Input onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <Input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                    <Button onClick={submit}>Login</Button>
                    <Link onClick={props.onRegister}>Register</Link>
                </Stack>
            </>
        );
    } else {
        return null;
    }
}

export default Login;
