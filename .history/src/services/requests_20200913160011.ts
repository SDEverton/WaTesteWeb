import IRequests from 'interfaces/models/requests';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class RequestsService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IRequests>> {
    return this.apiService.get('/app/requests', params);
  }

  public current(): Observable<IRequests> {
    return this.apiService.get('/app/requests');
  }

  public save(model: Partial<IRequests>): Observable<IRequests> {
    return this.apiService.post('/app/requests', {
      description: model.description,
      quantity: Number(model.quantity),
      price: model.price
    });
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/app/requests/${id}`);
  }
}

const requestsService = new RequestsService(apiService);
export default requestsService;
