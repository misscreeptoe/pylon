import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type ButtonTheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input()
  public theme?: ButtonTheme;

  public cssClasses: string[] = [];

  private _icon?: boolean;
  private _disabled?: boolean;

  public get icon(): boolean {
    return this._icon ?? false;
  }

  public get disabled(): boolean {
    return this._disabled ?? false;
  }

  @Input()
  public set icon(icon: any) {
    this._icon = coerceBooleanProperty(icon);
  }

  @Input()
  public set disabled(disabled: any) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  public ngOnInit(): void {
    this.setCssClasses();
  }

  public ngOnChanges(): void {
    this.setCssClasses();
  }

  private setCssClasses(): void {
    this.cssClasses = [];

    this.cssClasses.push(this.getThemeCssClass());
  }

  private getThemeCssClass(): string {
    return `btn-${this.theme ?? 'primary'}`;
  }
}
