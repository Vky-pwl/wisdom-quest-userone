import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule,
  MatInputModule, MatIconModule,
    MatCardModule, MatGridListModule,
     MatSnackBarModule,
      MatDialogModule,
      MatRadioModule, MatTooltipModule, MatListModule, MatExpansionModule,
       MatBottomSheetModule, MatTabsModule} from '@angular/material';
import { ReplacePipe } from './replace.pipe';
import { OrderByPipe } from './order.pipe';

@NgModule({
  declarations: [ReplacePipe, OrderByPipe],
  imports: [
    MatExpansionModule,
    MatTabsModule,
            MatButtonModule,
            MatInputModule,
            MatBottomSheetModule,
            MatIconModule,
            MatCardModule,
            MatGridListModule,
            MatSnackBarModule,
            MatDialogModule,
            MatRadioModule,
            MatTooltipModule,
            MatListModule,
            MatCheckboxModule],
  exports: [ReplacePipe, OrderByPipe,
    MatExpansionModule,
    MatBottomSheetModule,
    MatTabsModule,
            MatButtonModule,
            MatInputModule,
            MatCardModule,
            MatIconModule,
            MatGridListModule,
            MatSnackBarModule,
            MatTooltipModule,
            MatDialogModule,
            MatRadioModule,
            MatListModule,
            MatCheckboxModule],
})
export class MaterialComponentsRepositoryModule { }
