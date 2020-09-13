import IRequests from 'interfaces/models/requests';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class RequestsService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IRequests>> {
    return this.apiService.get('/user', params);
  }

  public current(): Observable<IRequests> {
    return this.apiService.get('/user/current');
  }

  public save(model: Partial<IRequests>): Observable<IRequests> {
    console.log(model);
    return this.apiService.post('/requests/oi', model);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/user/${id}`);
  }
}

const requestsService = new RequestsService(apiService);
export default requestsService;
