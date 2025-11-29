import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-formulariomascota',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './formulariomascota.html',
  styleUrl: './formulariomascota.css',
})
export class Formulariomascota {

}
