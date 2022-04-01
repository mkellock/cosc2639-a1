import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';

interface InputProps {
    highestTotalTradeDeficit: HighestTotalTradeDeficit[] | undefined;
}

export interface HighestTotalTradeDeficit {
    countryLabel: string;
    productType: string;
    tradeDeficitValue: number;
    status: string;
}

export function HighestTotalTradeDeficitTable(props: InputProps) {
    return (
        <Table variant="striped">
            <Thead>
                <Td>Country Label</Td>
                <Td>Product Type</Td>
                <Td>Trade Deficit Value</Td>
                <Td>Status</Td>
            </Thead>
            <Tbody>
                {props.highestTotalTradeDeficit?.map((tempHighestTotalTradeDeficit: HighestTotalTradeDeficit) => (
                    <Tr key={tempHighestTotalTradeDeficit.countryLabel}>
                        <Td>{tempHighestTotalTradeDeficit.countryLabel}</Td>
                        <td>{tempHighestTotalTradeDeficit.productType}</td>
                        <td>{tempHighestTotalTradeDeficit.tradeDeficitValue.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</td>
                        <td>{tempHighestTotalTradeDeficit.status}</td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
