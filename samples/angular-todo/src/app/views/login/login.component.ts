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
export class LoginComponent implements OnInit {
  constructor(public userService: UserService, private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    // Check for goto param indicating this is a centralized login flow supported by this app
    this.checkForCentralizedLoginFlow();
  }

  startCentralizedLogin(): void {
    TokenManager.getTokens({
      forceRenew: false,
      login: 'redirect',
    });
  }

  async checkForCentralizedLoginFlow() {
    this.route.queryParams.subscribe(async (params) => {
      if (params.goto) {
        this.userService.goto = params.goto;
      }
    });
  }

  shouldShowCentralizedLoginButton() {
    return !this.userService.goto && environment.CENTRALIZED_LOGIN;
  }
}
