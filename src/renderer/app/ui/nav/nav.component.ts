import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItemDirective } from './nav-item.directive';
import { CloseButtonComponent } from '../close-button';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, CloseButtonComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements AfterContentInit {
  @ContentChildren(NavItemDirective)
  public navItems!: QueryList<NavItemDirective>;

  @Output()
  public activeTabChange = new EventEmitter<number>();

  public tabActiveStatus: Record<number, boolean> = {};
  public currentActiveTab: number | null = null;

  @Input()
  public set activeTab(activeTab: number) {
    this.currentActiveTab = activeTab;
  }

  public ngAfterContentInit(): void {
    this.currentActiveTab = this.navItems.first?.id ?? null;

    this.navItems.changes.subscribe(() => {
      this.updateTabActiveStatus();
    });

    this.updateTabActiveStatus();
  }

  public setTabActive(navItem: NavItemDirective): void {
    this.currentActiveTab = navItem.id;
    this.updateTabActiveStatus();
    this.activeTabChange.emit(this.currentActiveTab);
  }

  public onCloseButtonClicked(navItem: NavItemDirective): void {
    navItem.onCloseClicked();
  }

  private updateTabActiveStatus(): void {
    this.tabActiveStatus = {};

    this.navItems.forEach((navItem) => {
      this.tabActiveStatus[navItem.id] = false;
    });

    if (this.currentActiveTab !== null) {
      this.tabActiveStatus[this.currentActiveTab] = true;
    }
  }
}
