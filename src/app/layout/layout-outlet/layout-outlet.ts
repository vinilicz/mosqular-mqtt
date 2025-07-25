import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-layout-outlet',
  imports: [RouterOutlet, Header, ConfirmDialogModule, ToastModule],
  templateUrl: './layout-outlet.html',
  styleUrl: './layout-outlet.scss',
})
export class LayoutOutlet {}
