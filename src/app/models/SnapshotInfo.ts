import { NameValue } from './NameValue';

export class SnapshotInfo {
    key: string;
    UserKey: string;
    UserName: string;
    ActionDate: number;
    KeyDay: number;
    Inventory: Array<NameValue>;
    
    SaleAmount: number;
    ExpenseAmount: number;

    COHStart: number;
    COHActual: number;
    COHComputed: number;
    Note: string;

    ReviewerKey: string;
    ReviewerName: string;
    ReviewDate: number;
}