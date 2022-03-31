import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

ReactDOM.render(
    <ChakraProvider>
        <App />
    </ChakraProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
