import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, FormsModule, ToastrModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'twubric';
  filter: boolean = false;
  httpClient = inject(HttpClient);
  users: any = [
    {
      image: '',
      username: 'Jondoe',
      fullname: 'Jon Doe',
      join_date: '12-04-2023',
      twubric: {total: 1,friends: 1,influence: 2, chirpiness: 3}
    }
  ];
  filteredUsers: any = [];
  sortBy: string = 'score';
  startDate: Date | null = null;
  endDate: Date | null = null;
  searchData: string = '';

  // TODO: Needed to fix this plugin issue
  // constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.httpClient
      .get(
        'https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/82e3ef99cde5b6e313922a5ccce7f38e17f790ac/twubric.json'
      )
      .subscribe((data) => {
        this.users = data;
      });
      this.filteredUsers = JSON.parse(JSON.stringify(this.users));
  }

filterDate(sDate: any, eDate: any) {
  if (sDate && eDate) {
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    this.filteredUsers = this.users.filter((user: any) => {
      const userJoinDate = new Date(user.join_date);
      return (!startDate || userJoinDate >= startDate) && (!endDate || userJoinDate <= endDate);
    });
  }
}

sortByCriteria() {
    this.filteredUsers = this.users.slice().sort((a: any, b: any) => {
        return a.twubric[this.sortBy] - b.twubric[this.sortBy];
    });
}

sortUser() {
  this.filteredUsers = this.users.sort((a: any, b: any) => {
    return a.username.localeCompare(b.username);
  });
}

searchUser() {
    const searchDataLowerCase = this.searchData.toLowerCase();
    if (!searchDataLowerCase) {
        this.filteredUsers = this.users;
        return;
    }
    this.filteredUsers = this.users.filter((user: any) => {
        return user.username
            .toLowerCase()
            .includes(searchDataLowerCase);
    });
}

  removeFollower(i: any) {
    // this.toastr.success('Hello world!', 'Toastr fun!');
    this.filteredUsers.splice(i, 1);
  }

resetFilter(type: any) {
    if (type == 'date') {
      this.startDate = null;
      this.endDate = null;
    }
    if (type == 'criteria') {
      this.sortBy = 'score';
    }
    if (type == 'all') {
      this.startDate = null;
      this.endDate = null;
      this.sortBy = 'score';
      this.filter = false;
    }
    this.filteredUsers = this.users;
  }
}
