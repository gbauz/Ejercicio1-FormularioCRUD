import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
@Component({
  selector: 'app-formulariopersona',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule,MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './formulariopersona.html',
  styleUrl: './formulariopersona.css',
})
export class Formulariopersona {

}
