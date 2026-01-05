import { Component, effect, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Toast } from '../toast/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-toast-component',
  imports: [ToastModule, CommonModule, ButtonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.scss',
  providers: [MessageService],
})
export class ToastComponent implements OnInit {
  toast: boolean = true;
  toastMessage: string | 'Loaded';

  constructor(
    private toastService: Toast,
    private messageService: MessageService,
  ) {
    effect(() => {
      const status = this.toastService.toast();
      const title = this.toastService.toastTitle();
      const message = this.toastService.toastMessage();

      if (status.show && status.state) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: title,
            detail: message,
            sticky: status.sticky
          });
        }, 10);
      }
      if (status.show && !status.state) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: title,
            detail: message,
            sticky: status.sticky
          });
        }, 10);
      }
    });
  }

  ngOnInit(): void {

  }

  show() {
    this.messageService.add({
      severity: 'info',
      summary: 'Sticky',
      detail: 'Message Content',
      sticky: true,
    });
  }

  onClose() {
    this.messageService.clear();
    this.toastService.clearToast();
  }
}
