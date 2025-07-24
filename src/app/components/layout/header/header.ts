import {Component, inject} from '@angular/core';
import {HttpApp} from '../../../services/http-app';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private router = inject(Router);

  goToPage(page: string): void {
    console.log(`Navigating to ${page}`);
    this.router.navigate([page]);
    // Implement actual navigation logic here, e.g., using Angular Router
  }

  login(): void {
    console.log('Login clicked');
    // Implement login logic
  }

  logout(): void {
    console.log('Logout clicked');
    // Implement logout logic
  }


}
