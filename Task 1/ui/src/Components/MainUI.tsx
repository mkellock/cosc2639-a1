import { Stack, HStack, Link, Divider, Image, Box } from '@chakra-ui/react';

interface InputProps {
    hidden?: boolean;
    children?: JSX.Element | JSX.Element[];
    userDetails?: UserDetails;
    onLogoutClick(): void;
    onForumClick(): void;
    onUsernameClick(): void;
}

export interface UserDetails {
    id: string;
    username: string;
}

export function MainUI(props: InputProps) {
    if (props.hidden === undefined || !props.hidden) {
        return (
            <Stack spacing={3} padding={3} hidden={false}>
                <HStack spacing={3} align="top">
                    <Link onClick={props.onLogoutClick}>Logout</Link>
                    <Link onClick={props.onForumClick}>Forum</Link>
                    <Link onClick={props.onUsernameClick}>User Details</Link>
                </HStack>
                <Divider />
                <HStack spacing={3} align="top">
                    <Stack spacing={3}>
                        <Image fit="cover" width={120} height={120} src={'https://storage.googleapis.com/user_images_cosc2639/' + props.userDetails?.id + '.gif?rand=' + Math.random()} />
                        <Link onClick={props.onUsernameClick}>{props.userDetails?.username}</Link>
                    </Stack>
                    <Divider orientation="vertical" height="300px" />
                    <Box width="100%">{props.children}</Box>
                </HStack>
            </Stack>
        );
    } else {
        return null;
    }
}

export default MainUI;
