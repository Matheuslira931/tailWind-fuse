import {TestBed} from '@angular/core/testing';

import {CompanySizeService} from './company-size.service';

describe('CityService', () => {
    let service: CompanySizeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CompanySizeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
