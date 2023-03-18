import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DappListing } from '../../model';
import { RowComponent, ColumnComponent, ContainerComponent } from '../../ui';
import { DappListingCardComponent } from '../dapp-listing-card';
import { DappsManagerService } from '../dapps-manager';

const DAPP_LISTINGS: DappListing[] = [
  {
    name: 'NNS',
    canisterId: 'qoctq-giaaa-aaaaa-aaaea-cai',
    description: 'Asset Management and Voting for the Network Nervous System',
  },
  {
    name: 'Internet Identity',
    canisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
    description: 'Anonymous blockchain authentication framework',
  },
  {
    name: 'DSCVR',
    canisterId: 'h5aet-waaaa-aaaab-qaamq-cai',
    description:
      'A decentralized social news aggregator built on the Internet Computer',
  },
];

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ContainerComponent,
    RowComponent,
    ColumnComponent,
    DappListingCardComponent,
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public dappListings = DAPP_LISTINGS;

  constructor(private readonly dappsManagerService: DappsManagerService) {}

  public async onOpenDapp(dappListing: DappListing): Promise<void> {
    this.dappsManagerService.openDapp(dappListing);
  }
}
