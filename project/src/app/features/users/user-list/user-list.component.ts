import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@core/services/message.service';
import { UserService } from '@core/services/user.service';
import { Role, User } from '@core/types/user.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[];
  selectedUser: User;
  selectedMode: string;

  constructor(private router: Router, private route: ActivatedRoute,
              private service: UserService,
              private messageService: MessageService
     ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(qparams => {
      if (qparams['refresh']) {
        this.refresh();
      }
    });
    this.refresh();
  }

  async refresh() {
    this.service.findAll().subscribe(
      users => {
        this.users = users;
        this.selectedUser = undefined;
      },
      err => this.messageService.error(err.error.message)
    );
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.router.navigate(['users', this.selectedMode, user.id]);
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
  }

  handleUserChange(user: User) {
    if (user.id) {
      this.service.update(user).subscribe(
        u => {
          this.upsertUser(u);
          // this.messageService.success(`Successfully updated user: ${u.username}`);
        },
        // err => this.messageService.error(err.error.message)
      );
    } else {
      this.service.create(user).subscribe(
        u => {
          this.upsertUser(u);
          // this.messageService.success(`Successfully added user: ${u.username}`);
        },
        // err => this.messageService.error(err.error.message)
      );
    }
    this.selectedUser = undefined;
    // this.refresh();
  }

  addUser() {
    this.selectedUser = null;
    this.selectedMode = 'create';
    this.router.navigate(['users', this.selectedMode]);
  }

  userCanceled() {
    this.selectedUser = undefined;
  }

  deleteUser(user: User) {
    this.service.delete(user.id).subscribe(
      u => {
          this.removeUser(u);
          this.selectedUser = undefined;
          // this.messageService.success(`Successfully deleted user: ${u.username}`);
        },
        // err => this.messageService.error(err.error.message)
    );
    this.refresh();
  }

  getAvatar(user) {
    return user.avatar;
     
  }

  getRoleName(role: Role) {
    return Role[role];
  }

  private upsertUser(user: User): void {
    if (!user) { return; }
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }

  private removeUser(user: User): void {
    if (!user) { return; }
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
}
