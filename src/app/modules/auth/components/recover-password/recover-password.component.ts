import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {
  codeSent = false;
  codeApproved = false;
}