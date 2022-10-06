/*
 * angular-todo-prototype
 *
 * login.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenManager } from '@forgerock/javascript-sdk';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

/**
 * Used to show a login page
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(public userService: UserService, private route: ActivatedRoute) {}

  startCentralizedLogin(): void {
    TokenManager.getTokens({
      forceRenew: false,
      login: 'redirect',
    });
  }
}
