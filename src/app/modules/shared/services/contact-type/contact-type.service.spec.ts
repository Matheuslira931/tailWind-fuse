import {TestBed} from '@angular/core/testing';

import {ContactTypeService} from './contact-type.service';

describe('ContactType', () => {
    let service: ContactTypeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ContactTypeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
