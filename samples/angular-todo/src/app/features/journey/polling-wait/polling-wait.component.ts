/*
 * angular-todo-prototype
 *
 * polling-wait.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CallbackType, FRStep, PollingWaitCallback } from '@forgerock/javascript-sdk';

/**
 * Used to implement a wait before polling AM for an update
 */
@Component({
  selector: 'app-polling-wait',
  templateUrl: './polling-wait.component.html',
})
export class PollingWaitComponent implements OnInit {
  /**
   * The name of the callback
   */
  @Input() name?: string;

  /**
   * The callback representing the polling wait
   */
  @Input() callback?: PollingWaitCallback;

  /**
   * The FRStep representing the current step in authentication
   */
  @Input() step?: FRStep;

  /**
   * The message to display to the user
   */
  @Input() message?: string;

  /**
   * Emits a string representing the text entered by the user
   */
  @Output() waitingFinished = new EventEmitter<boolean>();

  /**
   * Process the redirect defined in the step
   */
  ngOnInit(): void {
    if (this.callback) {
      this.message = this.callback?.getMessage();

      setTimeout(() => {
        this.finishWaiting(true);
      }, this.callback.getWaitTime());
    }
  }

  shouldShowSpinner(): boolean {
    return (
      this.step?.getCallbacksOfType(CallbackType.TextOutputCallback).length === 0 ||
      this.step?.getCallbacksOfType(CallbackType.HiddenValueCallback).length === 0
    );
  }

  finishWaiting(event: any): void {
    this.waitingFinished.emit(event);
  }
}
