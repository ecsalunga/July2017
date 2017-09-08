import { NameValue } from './NameValue';

export class SnapshotInfo {
    key: string;
    MemberKey: string;
    MemberName: string;
    ActionDate: number;
    KeyDay: number;
    Inventory: Array<NameValue>;
    
    SaleAmount: number;
    ExpenseAmount: number;

    COHActual: number;
    COHComputed: number;
    Note: string;

    ReviewerKey: string;
    ReviewerName: string;
    ReviewDate: number;
    IsReviewed: boolean;
}