/*
 * angular-todo-prototype
 *
 * hidden-value.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HiddenValueCallback } from '@forgerock/javascript-sdk';
import qrcode from 'qrcode-generator';

/**
 * Used to display a message or script to be evaluated by the browser
 */
@Component({
  selector: 'app-hidden-value',
  templateUrl: './hidden-value.component.html',
})
export class HiddenValueComponent implements OnInit {
  /**
   * The callback representing the hidden value content
   */
  @Input() callback?: HiddenValueCallback;

  /**
   * The name of the callback
   */
  @Input() name?: string;

  constructor(private sanitizer: DomSanitizer) {}

  qrImage?: SafeHtml;

  ngOnInit(): void {
    if (this.callback) {
      if (this.callback.getInputValue() === 'mfaDeviceRegistration') {
        const qr = qrcode(0, 'M');
        qr.addData(this.callback.getOutputValue() as string);
        qr.make();
        this.qrImage = this.sanitizer.bypassSecurityTrustHtml(qr.createImgTag(3, 8));
      }
    }
  }
}
