import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItemDirective } from './nav-item.directive';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements AfterContentInit {
  @ContentChildren(NavItemDirective)
  public navItems!: QueryList<NavItemDirective>;

  public tabActiveStatus: Record<string, boolean> = {};
  public currentActiveTab: string = null;

  public ngAfterContentInit(): void {
    this.currentActiveTab = this.navItems.first.id ?? null;

    this.navItems.changes.subscribe(() => {
      this.updateTabActiveStatus();
    });

    this.updateTabActiveStatus();
  }

  public isTabSelected(navItem: NavItemDirective): boolean {
    return this.tabActiveStatus[navItem.id];
  }

  public setTabActive(navItem: NavItemDirective): void {
    this.currentActiveTab = navItem.id;
    this.updateTabActiveStatus();
  }

  private updateTabActiveStatus(): void {
    this.tabActiveStatus = {};

    this.navItems.forEach((navItem) => {
      this.tabActiveStatus[navItem.id] = false;
    });

    if (this.currentActiveTab) {
      this.tabActiveStatus[this.currentActiveTab] = true;
    }
  }
}
