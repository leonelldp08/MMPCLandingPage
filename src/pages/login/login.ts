import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { LoaderService } from '../../services/loader/loader';
import { Toast } from '../../services/toast/toast';

interface ImageData {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    CardModule,
    GalleriaModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabel
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  imageData: ImageData[] = [];
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1
    }
  ];

  username: string = '';
  password: string = '';
  userData: any = {};
  loading: boolean = false;
  btnLabel: string = 'Login';

  constructor(
    private router: Router,
    private authService: Auth,
    private toast: Toast,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.imageData =
    [
      {
        itemImageSrc: 'assets/Store.jpg',
        thumbnailImageSrc: 'assets/Store.jpg',
        alt: 'Purchase your MMPC Products and earn Points',
        title: 'MMPC Store'
      },
      {
        itemImageSrc: 'assets/Election.jpg',
        thumbnailImageSrc: 'assets/Election.jpg',
        alt: 'Vote for new officers easily and securely',
        title: 'Election'
      },
      {
        itemImageSrc: 'assets/Application.jpg',
        thumbnailImageSrc: 'assets/Application.jpg',
        alt: 'Apply for Membership and Services Online',
        title: 'Online Services'
      },
      {
        itemImageSrc: 'assets/MemberManagement.jpg',
        thumbnailImageSrc: 'assets/MemberManagement.jpg',
        alt: 'Manage your membership details easily',
        title: 'Member Management'
      }
    ];
  }

  login() {
    this.authService.getAppUser(this.username, this.password).subscribe({
      next: (response) => {
        if (response.body) {
          this.userData = response.body;
          sessionStorage.setItem('token', this.userData.token);
          sessionStorage.setItem('userid', this.userData.data.idNum);
          sessionStorage.setItem('accessrights', this.userData.data.accessRight);
          sessionStorage.setItem('refreshToken', this.userData.refreshToken);
          sessionStorage.setItem('firstname', this.userData.data.firstName);
        }
      },
      error: (error) => {
        this.toast.setState(false, error.message);
        this.loaderService.hide();
      },
      complete: () => {
        this.router.navigate(['/home']);
      }
    });
  }

  clearForm() {
    this.username = '';
    this.password = '';
  }
}
