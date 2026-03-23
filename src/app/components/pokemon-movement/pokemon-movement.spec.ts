import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonMovement } from './pokemon-movement';

describe('PokemonMovement', () => {
  let component: PokemonMovement;
  let fixture: ComponentFixture<PokemonMovement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonMovement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonMovement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
