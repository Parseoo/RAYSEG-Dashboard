type RequestConfig = RequestInit & { url: string; _retry?: boolean };

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response, config: RequestConfig) => Response | Promise<Response>;
type ErrorInterceptor = (error: any) => any;

class FetchClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseURL: string = '', defaultHeaders: HeadersInit = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      [key]: value,
    };
  }

  removeDefaultHeader(key: string) {
    const headers = { ...this.defaultHeaders };
    delete (headers as any)[key];
    this.defaultHeaders = headers;
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(onSuccess: ResponseInterceptor, onError?: ErrorInterceptor) {
    this.responseInterceptors.push(onSuccess);
    if (onError) this.errorInterceptors.push(onError);
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; status: number; headers: Headers }> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    let config: RequestConfig = {
      ...options,
      url,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    try {
      let response = await fetch(config.url, config);

      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response, config);
      }

      if (!response.ok) {
        const error: any = new Error(`HTTP Error: ${response.status}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: await this.parseResponse(response),
          headers: response.headers,
        };
        error.config = config; // importante para retry
        throw error;
      }

      const data = await this.parseResponse(response);

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error: any) {
      for (const interceptor of this.errorInterceptors) {
        error = await interceptor(error);
      }
      throw error;
    }
  }

  private async parseResponse(response: Response) {
    const contentType = response.headers.get('content-type');

    if (!contentType) return null;

    if (contentType.includes('application/json')) return response.json();
    if (contentType.includes('text/')) return response.text();
    if (contentType.includes('application/octet-stream')) return response.blob();

    return response.text();
  }

  get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = any>(endpoint: string, data?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T = any>(endpoint: string, data?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new FetchClient(
  process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8001',
  { 'Content-Type': 'application/json' }
);

export default FetchClient;
