import { Component, OnInit, Signal } from '@angular/core';
import { LoaderService } from '../../services/loader/loader';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from "primeng/button";
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';
import { Applications, createEmptyApplication } from '../../models/applications.model';
import { Signals } from '../../services/signals/signals';
import { FormsModule } from '@angular/forms';
import { createVoterTypeOptions, SelectProperty } from '../../models/select.model';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../services/auth/auth';
import { Toast } from '../../services/toast/toast';

@Component({
  selector: 'app-home',
  imports: [
    Menubar, MenuModule, TieredMenuModule, AvatarModule, SkeletonModule, ButtonModule,
    SelectModule, FormsModule, Dialog, InputTextModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  loggedUserId: string = sessionStorage.getItem('userid') || '';
  loggedUsername: string = sessionStorage.getItem('firstname') || '';

  // Menu items
  profileItem: MenuItem[] | undefined;
  tieredMenuLogged: MenuItem[] | undefined;
  tieredMenuDefault: MenuItem[] | undefined;
  isAvatarLoaded: boolean = false;
  expandedMenuItems: Set<string> = new Set();

  // Voter type selection properties
  voterType: string | undefined;
  voterTypeOptions: SelectProperty[] = createVoterTypeOptions();

  // Login modal properties
  loginModalVisible: boolean = false;
  username: string = '';
  password: string = '';
  userData: any = {};
  closable: boolean = true;
  usernameDisabled: boolean = false;
  passwordDisabled: boolean = false;
  buttonDisabled: boolean = false;

  // Signals
  applications: Signal<Applications[]>;
  applicationsLoading: Signal<boolean>;

  // Dummy objects for skeleton loaders
  applicationSkeletons: Applications[] = [];

  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private applicationsService: Signals,
    private authService: Auth,
    private toast: Toast
  ) {
    this.applications = this.applicationsService.applications;
    this.applicationsLoading = this.applicationsService.isLoading;
    this.applicationSkeletons = [
      ...Array(Math.floor(Math.random() * (5 - 3) + 3)).fill(null).map(() =>
        createEmptyApplication(Math.floor(Math.random() * 10) + 1)
      )
    ];
    this.setMenuItems();
  }

  ngOnInit() {
    this.applicationsService.getApplications();
  }

  onAvatarLoad() {
    this.isAvatarLoaded = true;
  }

  onAvatarError(event: any) {
    event.target.src = 'assets/avatar.png';
    this.isAvatarLoaded = true;
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userid');
    this.loggedUserId = '';
    this.loggedUsername = '';
    this.setMenuItems();
  }

  setMenuItems(): void {
    this.profileItem = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      }
    ];

    this.tieredMenuLogged = [
      {
        label: this.loggedUsername,
        icon: 'pi pi-user',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];

    this.tieredMenuDefault = [
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
        command: () => this.loginModalVisible = true
      },
      {
        label: 'Register',
        icon: 'pi pi-user-plus'
      }
    ];
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.items && item.items.length > 0) {
      const itemKey = item.label || '';
      if (this.expandedMenuItems.has(itemKey)) {
        this.expandedMenuItems.delete(itemKey);
      } else {
        this.expandedMenuItems.add(itemKey);
      }
    }
  }

  getSubmenuIconClass(item: MenuItem): string {
    const itemKey = item.label || '';
    let result = 'pi pi-angle-right';
    if (this.expandedMenuItems.has(itemKey)) {
      result = 'pi pi-angle-down';
    }
    return result;
  }

  setModalContent(fieldProperty: boolean) {
    this.usernameDisabled = fieldProperty;
    this.passwordDisabled = fieldProperty;
    this.buttonDisabled = fieldProperty;
  }

  login() {
    this.setModalContent(true);
    this.closable = false;
    this.authService.getAppUser(this.username, this.password).subscribe({
      next: (response) => {
        if (response.body) {
          this.userData = response.body;
          sessionStorage.setItem('token', this.userData.token);
          sessionStorage.setItem('userid', this.userData.data.idNum);
          sessionStorage.setItem('accessrights', this.userData.data.accessRight);
          sessionStorage.setItem('refreshToken', this.userData.refreshToken);
          sessionStorage.setItem('firstname', this.userData.data.firstName);
          this.loggedUserId = this.userData.data.idNum;
          this.loggedUsername = this.userData.data.firstName;
          this.setMenuItems();
        }
      },
      error: (error) => {
        this.toast.setState(false, error.message);
      },
      complete: () => {
        this.loaderService.hide();
        this.setModalContent(false);
        this.closable = true;
        this.loginModalVisible = false;
      }
    });
  }

  visitSite(appName: string) {
    const urlParams = `token=${sessionStorage.getItem('token')}&userid=${sessionStorage.getItem('userid')}&accessrights=${sessionStorage.getItem('accessrights')}&refreshToken=${sessionStorage.getItem('refreshToken')}`;
    if (appName === 'Store') {
      window.location.href = 'https://store-test.mmpcph.com/shop?' + urlParams;
    }
  }
}
