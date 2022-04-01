import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';

interface InputProps {
    highestTradeValue: HighestTradeValue[] | undefined;
}

export interface HighestTradeValue {
    time: number;
    tradeValue: number;
}

export function HighestTradeValueTable(props: InputProps) {
    return (
        <Table variant="striped">
            <Thead>
                <Tr>
                    <Td>Time</Td>
                    <Td>Trade Value</Td>
                </Tr>
            </Thead>
            <Tbody>
                {props.highestTradeValue?.map((tempHighestTradeValue: HighestTradeValue) => (
                    <Tr key={tempHighestTradeValue.time}>
                        <Td>{tempHighestTradeValue.time}</Td>
                        <td>{tempHighestTradeValue.tradeValue.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
