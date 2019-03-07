import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule,  MatCardModule, MatGridListModule, MatSnackBarModule, MatDialogModule} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [MatButtonModule,
            MatInputModule,
            MatIconModule,
            MatCardModule,
            MatGridListModule,
            MatSnackBarModule,
            MatDialogModule,
            MatCheckboxModule],
  exports: [MatButtonModule,
            MatInputModule,
            MatCardModule,
            MatIconModule,
            MatGridListModule,
            MatSnackBarModule,
            MatDialogModule,
            MatCheckboxModule],
})
export class MaterialComponentsRepositoryModule { }
