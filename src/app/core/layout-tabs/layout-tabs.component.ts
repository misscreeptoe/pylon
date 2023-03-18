import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent, NavItemDirective } from '../../ui';
import { DashboardComponent } from '../dashboard';

@Component({
  selector: 'app-layout-tabs',
  standalone: true,
  imports: [CommonModule, NavComponent, NavItemDirective, DashboardComponent],
  templateUrl: './layout-tabs.component.html',
  styleUrls: ['./layout-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutTabsComponent {}
