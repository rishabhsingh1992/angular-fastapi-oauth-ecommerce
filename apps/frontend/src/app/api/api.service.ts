import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AddCartItemRequest, ApiError, CartResponse, CreateOrderRequest, Order, OrderResponse, Product, UpdateCartItemRequest, User } from './api.types';

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

  patch<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.http.patch<TResponse>(this.toUrl(path), body).pipe(catchError((error) => this.handleError(error)));
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

  getProducts(): Observable<Product[]> {
    return this.get<Product[]>('/products');
  }

  getCategories(): Observable<string[]> {
    return this.get<string[]>('/products/categories');
  }

  // Cart endpoints
  getCart(): Observable<CartResponse> {
    return this.get<CartResponse>('/cart');
  }

  addCartItem(request: AddCartItemRequest): Observable<CartResponse> {
    return this.post<AddCartItemRequest, CartResponse>('/cart/items', request);
  }

  updateCartItem(productId: number, request: UpdateCartItemRequest): Observable<CartResponse> {
    return this.patch<UpdateCartItemRequest, CartResponse>(`/cart/items/${productId}`, request);
  }

  removeCartItem(productId: number): Observable<CartResponse> {
    return this.delete<CartResponse>(`/cart/items/${productId}`);
  }

  clearCart(): Observable<CartResponse> {
    return this.delete<CartResponse>('/cart');
  }

  // Order endpoints
  createOrder(request: CreateOrderRequest): Observable<OrderResponse> {
    return this.post<CreateOrderRequest, OrderResponse>('/orders', request);
  }

  listOrders(): Observable<OrderResponse[]> {
    return this.get<OrderResponse[]>('/orders');
  }

  getOrder(orderId: string): Observable<OrderResponse> {
    return this.get<OrderResponse>(`/orders/${orderId}`);
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
