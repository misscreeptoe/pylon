import {
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: '[appNavItem]',
  standalone: true,
})
export class NavItemDirective {
  @Input()
  public id: string;

  @Input()
  public title: string;

  @Output()
  public closeClick = new EventEmitter<void>();

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public onCloseClicked(): void {
    this.closeClick.emit();
  }
}
