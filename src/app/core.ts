import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Injectable()
export class Core {
    viewChild: ViewContainerRef;
    component: any;
    selector: string;

    constructor(private resolver: ComponentFactoryResolver) { }

    loadComponent(selector: string) {
        let factories = Array.from(this.resolver['_factories'].values());
        let component = <ComponentFactory<any>> factories.find((item: ComponentFactory<any>) => item.selector === selector);
        if(component) {
            this.clearComponent();
            this.selector = selector;
            let factory = this.resolver.resolveComponentFactory(component.componentType);
            let created = this.viewChild.createComponent(factory);
            this.component = created;
        }
    }

    clearComponent() {
        this.selector = "";
        if(this.component) {
            this.component.destroy();
        }
    }

    dateToNumber(date: Date): number
    {
        let dt: Date = new Date();
        let strDate = date.getFullYear() + this.az(date.getMonth()+1) + this.az(date.getDate()) + this.az(dt.getHours()) + this.az(dt.getMinutes()) + this.az(dt.getSeconds());
        return parseInt(strDate);
    }

    numberToDate(num: number): Date
    {
        let val = num.toString();
        let year = parseInt(val.substring(0, 4));
        let month = parseInt(val.substring(4, 6));
        let day = parseInt(val.substring(6, 8));
        let hour = parseInt(val.substring(8, 10));
        let minute = parseInt(val.substring(10, 12));
        let second = parseInt(val.substring(12, 14));
        
        return new Date(year, month-1, day, hour, minute, second);
    }

    private az(val: number) : string {
        let num = val.toString();
        if(num.length < 2)
            num = "0" + num;
        
        return num;
    }

}