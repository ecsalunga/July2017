export class ArticleInfo {
    key: string;
    Title: string;
    Blurb: string;
    Content: string;
    Author: string;
    IsActive: boolean;
    ActionDate: number;

    constructor() {
        this.Blurb = "";
        this.Content = "";
    }
}