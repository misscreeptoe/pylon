import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImmutableArray } from '../../utils';
import { Tab, TabStatus } from '../store';
import { ButtonComponent, CloseButtonComponent } from '../../ui';
import { DashboardComponent } from '../dashboard';
import { WebviewComponent } from '../webview';
import { ToolbarComponent } from '../toolbar';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
    CloseButtonComponent,
    DashboardComponent,
    WebviewComponent,
    ButtonComponent,
    ToolbarComponent,
  ],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input()
  public tabs?: ImmutableArray<Tab>;

  @Input()
  public tabStatus?: TabStatus;

  @Output()
  public tabClick = new EventEmitter<Tab>();

  @Output()
  public tabCloseClick = new EventEmitter<Tab>();

  @Output()
  public newTabClick = new EventEmitter<void>();

  public onTabClicked(tab: Tab): void {
    this.tabClick.emit(tab);
  }

  public onTabCloseClicked(tab: Tab): void {
    this.tabCloseClick.emit(tab);
  }

  public onNewTabClicked(): void {
    this.newTabClick.emit();
  }
}
