import { Name2Value } from './';

export class SnapshotInfo {
    key: string;
    UserKey: string;
    UserName: string;
    ActionDate: number;
    KeyDay: number;
    Inventory: Array<Name2Value>;
    
    SaleAmount: number;
    ExpenseAmount: number;

    COHStart: number;
    COHActual: number;
    COHComputed: number;
    Count: number;
    Total: number;
    Note: string;

    ReviewerKey: string;
    ReviewerName: string;
    ReviewDate: number;

    constructor() {
        this.Count = 0;
        this.Total = 0;
    }
}