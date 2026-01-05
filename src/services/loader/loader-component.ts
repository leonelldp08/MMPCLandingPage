import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService } from '../loader/loader';

@Component({
  selector: 'app-loader-component',
  imports: [ProgressSpinnerModule, CommonModule],
  templateUrl: './loader-component.html',
  styleUrls: ['./loader-component.scss'],
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe((status) => {
      this.isLoading = status;
    });
  }
}
