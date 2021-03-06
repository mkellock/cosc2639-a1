import Login, { LoginDetails } from './Components/Login';
import Register, { RegisterDetails } from './Components/Register';
import MainUI, { UserDetails } from './Components/MainUI';
import Forum from './Components/Forum';
import User, { UpdatePasswordVals } from './Components/User';
import { useState } from 'react';
import { EditMessageProps } from './Components/MessageEdit';
import { MessageProps } from './Components/Message';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { AlertStatus } from '@chakra-ui/react';

export function App() {
    const [userDetails, setUserDetails] = useState<UserDetails>();
    const [loginHidden, setLoginHidden] = useState(false);
    const [registerHidden, setRegisterHidden] = useState(true);
    const [mainUIHidden, setMainUIHidden] = useState(true);
    const [loginInError, setLoginInError] = useState(false);
    const [logInErrorMessage, setLogInErrorMessage] = useState<string>();
    const [registerError, setRegisterError] = useState(false);
    const [registerErrorMessage, setRegisterInErrorMessage] = useState<string>();
    const [userHidden, setUserHidden] = useState(true);
    const [forumHidden, setForumHidden] = useState(false);
    const [messages, setMessages] = useState<MessageProps[]>();
    const [userMessages, setUserMessages] = useState<MessageProps[]>();
    const [passwordAlertType, setPasswordAlertType] = useState<AlertStatus>();
    const [passwordAlertMessage, setPasswordAlertMessage] = useState<string>();

    let gqlUri = '/graphql';

    //gqlUri = 'http://localhost:8080/graphql';

    const client = new ApolloClient({
        uri: gqlUri,
        cache: new InMemoryCache(),
    });

    const onLoginSubmit = (loginDetails: LoginDetails) => {
        // Call API to authenticate user
        const getLoginDetails = gql`
            query userByIdPassword($id: String!, $password: String!) {
                userByIdPassword(id: $id, password: $password) {
                    id
                    username
                }
            }
        `;

        const loginVariables = {
            id: loginDetails.id,
            password: loginDetails.password,
        };

        client
            .query({
                query: getLoginDetails,
                variables: loginVariables,
            })
            .then((result) => {
                // If login is unsuccessful
                if (result.data.userByIdPassword === null) {
                    setLoginInError(true);
                    setLogInErrorMessage('ID or password is invalid');
                } else {
                    // If authentication passes
                    setForumHidden(false);
                    setMainUIHidden(false);
                    setLoginHidden(true);

                    // Load the user's data
                    loadForumMessages(result.data.userByIdPassword.id);
                    loadUser({ ...result.data.userByIdPassword });
                }
            });
    };

    const onRegister = () => {
        setLoginHidden(true);
        setRegisterHidden(false);
    };

    const onForumClick = () => {
        setForumHidden(false);
        setUserHidden(true);
    };

    const onRegisterSubmit = (registerDetails: RegisterDetails) => {
        // Call API to register user
        const registerUser = gql`
            mutation registerUser($id: String!, $username: String!, $password: String!, $image: String!) {
                registerUser(id: $id, username: $username, password: $password, image: $image)
            }
        `;

        const registerUserVariables = {
            id: registerDetails.id,
            username: registerDetails.username,
            password: registerDetails.password,
            image: registerDetails.image,
        };

        client
            .mutate({
                mutation: registerUser,
                variables: registerUserVariables,
            })
            .then((result) => {
                if (result.data.registerUser === 0) {
                    // If registration passes
                    setRegisterHidden(true);
                    setRegisterError(false);

                    // Go back to the login screen
                    onLogoutClick();
                } else if (result.data.registerUser === 1) {
                    // If id exists
                    setRegisterError(true);
                    setRegisterInErrorMessage('The ID already exists');
                } else if (result.data.registerUser === 2) {
                    // If id exists
                    setRegisterError(true);
                    setRegisterInErrorMessage('The username already exists');
                }
            });
    };

    const onLogoutClick = () => {
        // Set up the UI
        setUserHidden(true);
        setForumHidden(true);
        setMainUIHidden(true);
        setLoginHidden(false);

        // Unset the user's login
        setUserDetails(undefined);
    };

    const onUsernameClick = () => {
        setForumHidden(true);
        setUserHidden(false);
    };

    const onMessageSubmit = (props: EditMessageProps) => {
        // Call API to add/update message
        const messageSubmit = gql`
            mutation message($id: Int, $subject: String!, $contents: String!, $userId: String!, $userName: String!, $image: String) {
                message(id: $id, subject: $subject, contents: $contents, userId: $userId, userName: $userName, image: $image)
            }
        `;

        const messageVariables = {
            id: props.id,
            subject: props.subject,
            contents: props.contents,
            userId: userDetails?.id,
            userName: userDetails?.username,
            image: props.image,
        };

        client
            .mutate({
                mutation: messageSubmit,
                variables: messageVariables,
            })
            .then(() => {
                loadForumMessages(userDetails?.id);
            });
    };

    const loadForumMessages = (id: string | undefined) => {
        // Call API to load forum messages
        const getMessages = gql`
            query {
                allMessages {
                    id
                    subject
                    contents
                    userId
                    username
                    postTime
                }
            }
        `;

        client
            .query({
                query: getMessages,
            })
            .then((result) => {
                let loadedMessages: MessageProps[] = [];
                let loadedUserMessages: MessageProps[] = [];

                result.data.allMessages.forEach((element: any) => {
                    loadedMessages.push({ ...element });

                    if (element.userId === id) {
                        loadedUserMessages.push({ ...element });
                    }
                });
                setMessages(loadedMessages);
                setUserMessages(loadedUserMessages);
            });
    };

    const loadUser = (userData: UserDetails) => {
        // Set the login details
        setUserDetails({ ...userData });
    };

    const updatePassword = (props: UpdatePasswordVals) => {
        // Call API to update password
        const passwordSubmit = gql`
            mutation updatePassword($id: String!, $oldPassword: String!, $newPassword: String!) {
                updatePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword)
            }
        `;

        const passwordVariables = {
            id: userDetails?.id,
            oldPassword: props.oldPassword,
            newPassword: props.newPassword,
        };

        if (props.oldPassword !== undefined && props.oldPassword.length > 0 && props.newPassword !== undefined && props.newPassword.length > 0) {
            client
                .mutate({
                    mutation: passwordSubmit,
                    variables: passwordVariables,
                })
                .then((result) => {
                    if (result.data.updatePassword) {
                        // If registration passes
                        setPasswordAlertType('success');
                        setPasswordAlertMessage('Password updated!');
                    } else {
                        // If registration fails
                        setPasswordAlertType('error');
                        setPasswordAlertMessage('Please ensure your current password is correct');
                    }
                });
        } else {
            setPasswordAlertType('error');
            setPasswordAlertMessage('Please fill in all password fields');
        }
    };

    return (
        <>
            <Login onSubmit={onLoginSubmit} onRegister={onRegister} hidden={loginHidden} inError={loginInError} errorMessage={logInErrorMessage} />
            <Register hidden={registerHidden} onSubmit={onRegisterSubmit} inError={registerError} errorMessage={registerErrorMessage} />
            <MainUI hidden={mainUIHidden} onLogoutClick={onLogoutClick} onForumClick={onForumClick} onUsernameClick={onUsernameClick} userDetails={userDetails}>
                <User hidden={userHidden} onMessageSubmit={onMessageSubmit} messages={userMessages} onUpdatePassword={updatePassword} passwordAlertMessage={passwordAlertMessage} passwordAlertType={passwordAlertType}></User>
                <Forum hidden={forumHidden} onMessageSubmit={onMessageSubmit} messages={messages}></Forum>
            </MainUI>
        </>
    );
}

export default App;
