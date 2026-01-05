import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  private toastSignal = signal<any>({ show: false, state: false, sticky: false });
  toast = this.toastSignal.asReadonly();

  private toastMessageSignal = signal<string>('');
  toastMessage = this.toastMessageSignal.asReadonly();

  private toastTitleSignal = signal<string>('Welcome');
  toastTitle = this.toastTitleSignal.asReadonly();

  constructor() {}

  setState(state: boolean, message: string, sticky?: boolean): void {
    if (sticky === undefined) { sticky = false; }

    this.toastMessageSignal.set(message);
    this.toastTitleSignal.set(state ? 'Success' : 'Error');
    this.toastSignal.set({ show: true, state, sticky });
  }

  hideToast(): void {
    this.toastSignal.set({ show: false, state: false, sticky: false });
  }

  clearToast(): void {
    this.hideToast();
    this.toastMessageSignal.set('');
    this.toastTitleSignal.set('Welcome');
  }
}
