import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';

interface InputProps {
    highestTotalTradeSurplus: HighestTotalTradeSurplus[] | undefined;
}

export interface HighestTotalTradeSurplus {
    serviceLabel: string;
    tradeSurplusValue: number;
}

export function HighestTotalTradeSurplusTable(props: InputProps) {
    return (
        <Table variant="striped">
            <Thead>
                <Td>ServiceLabel</Td>
                <Td>Trade Surplus Value</Td>
            </Thead>
            <Tbody>
                {props.highestTotalTradeSurplus?.map((tempHighestTotalTradeSurplus: HighestTotalTradeSurplus) => (
                    <Tr key={tempHighestTotalTradeSurplus.serviceLabel}>
                        <Td>{tempHighestTotalTradeSurplus.serviceLabel}</Td>
                        <td>{tempHighestTotalTradeSurplus.tradeSurplusValue.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
