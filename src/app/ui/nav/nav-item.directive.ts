import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appNavItem]',
  standalone: true,
})
export class NavItemDirective {
  @Input()
  public id: string;

  @Input()
  public title: string;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
