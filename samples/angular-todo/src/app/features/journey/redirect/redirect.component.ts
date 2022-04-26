/*
 * angular-todo-prototype
 *
 * redirect.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FRAuth, FRStep } from '@forgerock/javascript-sdk';

/**
 * Used to redirect the user to a URL provided by the server in a RedirectCallback
 */
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
})
export class RedirectComponent implements OnInit {
  /**
   * The name of the callback
   */
  @Input() name?: string;

  /**
   * The FRStep representing the current step in authentication
   */
  @Input() step?: FRStep;

  /**
   * Process the redirect defined in the step
   */
  async ngOnInit(): Promise<void> {
    if (this.step) {
      FRAuth.redirect(this.step);
    }
  }
}
