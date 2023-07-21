import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() userId!: string;
  @Output() userEmail = new EventEmitter<string>()
  user!: Observable<User | undefined>

  constructor(private userService: UserService) {} // Inject the user service

  ngOnInit(): void {
    this.user = this.userService.getUserById(this.userId); // Assign the Observable directly
    this.user.subscribe((user) => {
      if (user) {
        this.userEmail.emit(user.email); // Emit the owner's email when the user data is available
      }
    });
  }
}
