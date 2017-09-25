import { Name2Value } from './';

export class SnapshotInfo {
    key: string;
    UserKey: string;
    UserName: string;
    ActionDate: number;
    KeyDay: number;
    Inventory: Array<Name2Value>;
    Borrow: Array<Name2Value>;

    COHActual: number;
    Count: number;
    Total: number;

    BorrowCount: number;
    BorrowTotal: number;
    Note: string;

    ReviewerKey: string;
    ReviewerName: string;
    ReviewDate: number;

    constructor() {
        this.Count = 0;
        this.Total = 0;
        this.BorrowCount = 0;
        this.BorrowTotal = 0;
    }
}