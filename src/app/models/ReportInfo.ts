export class ReportInfo {
    key: string;
    KeyDay: number;
    KeyMonth: number;
    KeyYear: number;
    SaleCount: number;
    SaleAmount: number;
    ExpenseAmount: number;
    ExpenseCount: number;
    COHStart: number;
    COHActual: number;

    constructor() {
        this.COHStart = 0;
        this.COHActual = 0;
    }
}