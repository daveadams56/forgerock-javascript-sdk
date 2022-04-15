/*
 * angular-todo-prototype
 *
 * text.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  AttributeInputCallback,
  NameCallback,
  ValidatedCreateUsernameCallback,
  FRWebAuthn,
  FRStep,
  WebAuthnStepType,
} from '@forgerock/javascript-sdk';

/**
 * Used to collect a username, email address or any other text
 */
@Component({
  selector: 'app-webauthn',
  templateUrl: './webauthn.component.html',
})
export class WebAuthnComponent implements OnInit {
  /**
   * The callback to be represented as a username, create username, or text input field
   */
  @Input() callback?:
    | NameCallback
    | ValidatedCreateUsernameCallback
    | AttributeInputCallback<string>;

  /**
   * The name of the callback
   */
  @Input() name?: string;

  /**
   * The name of the callback
   */
  @Input() step?: FRStep;

  /**
   * Emits a string representing the text entered by the user
   */
  @Output() updatedCallback = new EventEmitter<FRStep>();

  /**
   * Initialise any failure messages and whether this field is mandatory
   */
  async ngOnInit(): Promise<void> {
    if (this.step) {
      // Determine if a step is a Web Biometrics step
      const stepType = FRWebAuthn.getWebAuthnStepType(this.step);

      let step = this.step;

      if (stepType === WebAuthnStepType.Registration) {
        // Registering a new device
        step = await FRWebAuthn.register(step);
      } else if (stepType === WebAuthnStepType.Authentication) {
        // Authenticating with a registered device
        step = await FRWebAuthn.authenticate(step);
      }

      // `step` has now been populated with the Web Biometrics credentials

      // Send this new step to the ForgeRock server
      this.updateValue(step);
    }
  }

  /**
   * Emit an event to the parent component, passing the text entered
   * @param event - the value of the text field
   */
  updateValue(event: FRStep): void {
    this.updatedCallback.emit(event);
  }
}
