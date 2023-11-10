import { Component, OnInit } from '@angular/core';
import { MusiciansService } from '../../services/musicians.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Musician } from '../../interfaces/muscian-response.inteface';

@Component({
  selector: 'app-musician-page',
  templateUrl: './musician-page.component.html',
  styles: [],
})
export class MusicianPageComponent implements OnInit {
  constructor(
    private musiciansservice: MusiciansService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  public musician?: Musician;

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.musiciansservice.getMusicianById(id)))
      .subscribe((musician) => {
        if (!musician) return this.router.navigate(['/admin/musicians/list']);
        return (this.musician = musician);
      });
  }
}
