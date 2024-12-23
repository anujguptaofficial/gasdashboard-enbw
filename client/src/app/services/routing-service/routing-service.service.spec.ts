import { of } from 'rxjs';
import { RoutingService } from './routing-service.service';

describe('RoutingServiceService', () => {
  let service: RoutingService;
  let routerMock: any;
  let routerService: any;

  beforeEach(() => {
    routerService = {
      navigateToURL: jest.fn()
    };
    routerMock = {
      navigateByUrl: jest.fn()
    };
    service = new RoutingService (
      routerMock,
      routerService  
    );
  });

  describe('Test:navigateToURL',() => {
    it('should navigate url', () => {
      jest.spyOn(routerMock,"navigateByUrl").mockReturnValue(of("/"))
      expect(routerMock.navigateByUrl).toBeDefined();
      service.navigateToURL('/');
    })
  })
});
