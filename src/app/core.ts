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
}