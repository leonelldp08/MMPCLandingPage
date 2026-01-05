import { Injectable, Signal, signal } from '@angular/core';
import { Applications } from '../../models/applications.model';
import { Toast } from '../toast/toast';
import { Data } from '../data/data';
import { LoaderService } from '../loader/loader';

@Injectable({
  providedIn: 'root',
})
export class Signals {
  private applicationsSignal = signal<Applications[]>([]);
  private applicationsLoadedSignal = signal<boolean>(false);

  applications = this.applicationsSignal.asReadonly()

  constructor(
    private dataService: Data,
    private toastService: Toast,
    private loaderService: LoaderService
  ) {}

  getApplications() {
    this.applicationsLoadedSignal.set(true);
    this.dataService.getApplications().subscribe({
      next: (response) => {
        this.applicationsSignal.set(response.body ? response.body : []);
        this.applicationsLoadedSignal.set(false);
      },
      error: (error) => {
        this.applicationsLoadedSignal.set(false);
        this.toastService.setState(false, 'Failed to load applications.' + error.message);
      },
      complete: () => {
        this.applicationsLoadedSignal.set(false);
      }
    });
  }

  get isLoading(): Signal<boolean> {
    return this.applicationsLoadedSignal;
  }
}
