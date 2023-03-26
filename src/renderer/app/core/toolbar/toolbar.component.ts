import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui';
import { TabsService } from '../store';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  constructor(private readonly tabsService: TabsService) {}

  public reload(): void {
    this.tabsService.reload();
  }

  public navigateForward(): void {
    this.tabsService.navigateForward();
  }

  public navigateBack(): void {
    this.tabsService.navigateBack();
  }
}
