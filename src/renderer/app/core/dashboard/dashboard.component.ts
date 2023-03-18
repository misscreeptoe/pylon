import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DappListing } from '../../model';
import { RowComponent, ColumnComponent, ContainerComponent } from '../../ui';
import { DappListingCardComponent } from '../dapp-listing-card';

const DAPP_LISTINGS: DappListing[] = [
  {
    name: 'Internet Computer Docs',
    canisterId: 'hwvjt-wqaaa-aaaam-qadra-cai',
  },
  {
    name: 'Motoko Playground',
    canisterId: 'm7sm4-2iaaa-aaaab-qabra-cai',
  },
  {
    name: 'NNS',
    canisterId: 'qoctq-giaaa-aaaaa-aaaea-cai',
    url: 'https://nns.ic0.app',
  },
  {
    name: 'Internet Identity',
    canisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
    url: 'https://identity.ic0.app',
  },
  {
    name: 'Distrikt',
    canisterId: 'az5sd-cqaaa-aaaae-aaarq-cai',
  },
  {
    name: 'Taggr',
    canisterId: '6qfxa-ryaaa-aaaai-qbhsq-cai',
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
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public dappListings = DAPP_LISTINGS;
}
