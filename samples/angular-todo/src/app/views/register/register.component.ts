/*
 * angular-todo-prototype
 *
 * register.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
// @ts-ignore
import Widget, { journey } from '../../../../package/inline';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

/**
 * Used to show a registration page
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  constructor(public userService: UserService, public router: Router) {}

  ngOnInit() {
    new Widget({
      target: document.getElementById('login-widget-inline'), // Any existing element from static HTML file
      props: {
        config: {
          clientId: environment.WEB_OAUTH_CLIENT,
          redirectUri: environment.APP_URL,
          scope: 'openid profile email',
          serverConfig: {
            baseUrl: environment.AM_URL,
            timeout: 30000, // 90000 or less
          },
          realmPath: environment.REALM_PATH,
          tree: environment.JOURNEY_REGISTER,
        },
      },
    });

    journey.start();

    journey.onSuccess((userData: any) => {
      console.log(userData);
      this.userService.info = userData.user.response;
      this.userService.isAuthenticated = true;
      this.router.navigateByUrl('/');
    });
    journey.onFailure((error: any) => {
      console.log(error);
    });
  }
}
