import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DappListing } from '../../model';

@Injectable({
  providedIn: 'root',
})
export class DappsManagerService {
  public readonly dapps$: Observable<DappListing[]>;

  private dapps: DappListing[];
  private readonly dappsSubject: BehaviorSubject<DappListing[]>;

  constructor() {
    this.dapps = [];
    this.dappsSubject = new BehaviorSubject(this.dapps);
    this.dapps$ = this.dappsSubject.asObservable();
  }

  public openDapp(dappListing: DappListing): void {
    this.dapps.push(dappListing);

    this.emit();
  }

  private emit(): void {
    this.dappsSubject.next(this.dapps);
  }
}
