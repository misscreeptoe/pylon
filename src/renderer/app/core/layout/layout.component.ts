import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsContainerComponent } from '../tabs-container';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, TabsContainerComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
