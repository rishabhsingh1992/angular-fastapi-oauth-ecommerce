import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiError, Cart, Order, Product, User } from './api.types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<TResponse>(path: string): Observable<TResponse> {
    return this.http.get<TResponse>(this.toUrl(path)).pipe(catchError((error) => this.handleError(error)));
  }

  post<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.http
      .post<TResponse>(this.toUrl(path), body)
      .pipe(catchError((error) => this.handleError(error)));
  }

  put<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.http.put<TResponse>(this.toUrl(path), body).pipe(catchError((error) => this.handleError(error)));
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http.delete<TResponse>(this.toUrl(path)).pipe(catchError((error) => this.handleError(error)));
  }

  getUser(userId: number): Observable<User> {
    return this.get<User>(`/users/${userId}`);
  }

  getProduct(productId: number): Observable<Product> {
    return this.get<Product>(`/products/${productId}`);
  }

  getCart(cartId: number): Observable<Cart> {
    return this.get<Cart>(`/carts/${cartId}`);
  }

  getOrder(orderId: number): Observable<Order> {
    return this.get<Order>(`/orders/${orderId}`);
  }

  private toUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private handleError(error: HttpErrorResponse) {
    const apiError: ApiError = {
      status: error.status,
      code: this.resolveCode(error),
      message: this.resolveMessage(error),
      details: error.error
    };

    return throwError(() => apiError);
  }

  private resolveCode(error: HttpErrorResponse): string {
    if (typeof error.error === 'object' && error.error !== null && 'code' in error.error) {
      return String(error.error.code);
    }

    if (error.status === 0) {
      return 'NETWORK_ERROR';
    }

    return `HTTP_${error.status}`;
  }

  private resolveMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'object' && error.error !== null && 'message' in error.error) {
      return String(error.error.message);
    }

    return error.message || 'Unexpected API error';
  }
}
