import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutTabsComponent } from '../layout-tabs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, LayoutTabsComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
