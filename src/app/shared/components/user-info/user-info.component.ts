import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() userId!: string;
  user!: User | undefined

  constructor(private userService: UserService) {} // Inject the user service

  async ngOnInit(): Promise<void> {
    try {
      this.user = await this.userService.getUserById(this.userId); // Get the user data using await
    } catch (error) {
      // Handle any errors that might occur during the getUserById call
      console.error(error);
    }
  }
}
