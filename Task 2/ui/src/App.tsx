import * as React from 'react';
import { ChakraProvider, theme, Heading, Text } from '@chakra-ui/react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { HighestTradeValue, HighestTradeValueTable } from './Components/HighestTradeValueTable';
import { HighestTotalTradeDeficit, HighestTotalTradeDeficitTable } from './Components/HighestTotalTradeDeficitTable';
import { HighestTotalTradeSurplus, HighestTotalTradeSurplusTable } from './Components/HighestTotalTradeSurplusTable';

interface RowState {
    highestTradeValue: HighestTradeValue[];
    highestTotalTradeDeficit: HighestTotalTradeDeficit[];
    highestTotalTradeSurplus: HighestTotalTradeSurplus[];
}

class App extends React.Component<{}, RowState> {
    constructor(props: any) {
        super(props);
        this.state = {
            highestTradeValue: [],
            highestTotalTradeDeficit: [],
            highestTotalTradeSurplus: [],
        };

        let gqlUri = '/graphql';

        //gqlUri = 'http://localhost:8080/graphql';

        const client = new ApolloClient({
            uri: gqlUri,
            cache: new InMemoryCache(),
        });

        client
            .query({
                query: gql`
                    query highestTradeValue {
                        highestTradeValue {
                            time
                            tradeValue
                        }
                    }
                `,
            })
            .then((result: any) => {
                let tempHighestTradeValue: HighestTradeValue[] = [];

                result.data.highestTradeValue.forEach((element: any) => {
                    tempHighestTradeValue.push({ ...element });
                });

                this.setState({ highestTradeValue: tempHighestTradeValue });
            });

        client
            .query({
                query: gql`
                    query highestTotalTradeDeficit {
                        highestTotalTradeDeficit {
                            countryLabel
                            productType
                            tradeDeficitValue
                            status
                        }
                    }
                `,
            })
            .then((result: any) => {
                let tempHighestTotalTradeDeficit: HighestTotalTradeDeficit[] = [];

                result.data.highestTotalTradeDeficit.forEach((element: any) => {
                    tempHighestTotalTradeDeficit.push({ ...element });
                });

                this.setState({ highestTotalTradeDeficit: tempHighestTotalTradeDeficit });
            });

        client
            .query({
                query: gql`
                    query highestTotalTradeSurplus {
                        highestTotalTradeSurplus {
                            serviceLabel
                            tradeSurplusValue
                        }
                    }
                `,
            })
            .then((result: any) => {
                let tempHighestTotalTradeSurplus: HighestTotalTradeSurplus[] = [];

                result.data.highestTotalTradeSurplus.forEach((element: any) => {
                    tempHighestTotalTradeSurplus.push({ ...element });
                });

                this.setState({ highestTotalTradeSurplus: tempHighestTotalTradeSurplus });
            });
    }

    render() {
        return (
            <ChakraProvider theme={theme}>
                <p>
                    <strong>Note:</strong> Data loads asyncronously, please wait a few seconds...
                </p>
                <p>&nbsp;</p>
                <Heading as="h1" fontSize="x-large">
                    Top 10 time slots with the highest trade value
                </Heading>
                <HighestTradeValueTable highestTradeValue={this.state.highestTradeValue}></HighestTradeValueTable>
                <p>&nbsp;</p>
                <Heading as="h1" fontSize="x-large">
                    Top 50 countries with the highest total trade deficit value
                </Heading>
                <HighestTotalTradeDeficitTable highestTotalTradeDeficit={this.state.highestTotalTradeDeficit}></HighestTotalTradeDeficitTable>
                <p>&nbsp;</p>
                <Heading as="h1" fontSize="x-large">
                    Top 30 services with the highest total trade surplus value
                </Heading>
                <HighestTotalTradeSurplusTable highestTotalTradeSurplus={this.state.highestTotalTradeSurplus}></HighestTotalTradeSurplusTable>
            </ChakraProvider>
        );
    }
}

export default App;
