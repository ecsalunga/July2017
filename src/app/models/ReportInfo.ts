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
        this.SaleCount = 0;
        this.SaleAmount = 0;
        this.ExpenseCount = 0;
        this.ExpenseAmount = 0;
        this.COHStart = 0;
        this.COHActual = 0;
    }
}