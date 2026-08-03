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
    const cleanBase = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${cleanBase}${cleanEndpoint}`;

    let headers: Record<string, string> = {
      ...(this.defaultHeaders as Record<string, string>),
      ...(options.headers as Record<string, string>),
    };

    // Si el body es FormData, remover Content-Type para que el navegador genere el multipart boundary
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
      delete headers['content-type'];
    }

    let config: RequestConfig = {
      ...options,
      url,
      headers,
    };

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    try {
      let response: Response;
      try {
        response = await fetch(config.url, config);
      } catch (fetchErr: any) {
        // Envolver el error nativo de red con contexto detallado
        const networkError: any = new Error(
          `Error de conexión al servidor (${config.method || 'GET'} ${config.url}): ${fetchErr.message || 'No se pudo contactar el backend'}`
        );
        networkError.name = 'NetworkError';
        networkError.isNetworkError = true;
        networkError.config = config;
        networkError.originalError = fetchErr;
        throw networkError;
      }

      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response, config);
      }

      if (!response.ok) {
        const error: any = new Error(`HTTP Error: ${response.status} at ${config.method || 'GET'} ${config.url}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: await this.parseResponse(response),
          headers: response.headers,
        };
        error.config = config; // importante para retry

        // Solo loguear errores que no sean 404 (son esperados en algunos casos)
        if (response.status !== 404) {
          console.error(`[FetchClient] Request failed: ${config.method || 'GET'} ${config.url} - Status: ${response.status}`);
        }

        throw error;
      }

      const data = await this.parseResponse(response);

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error: any) {
      if (!error.config) {
        error.config = config;
      }
      let currentError = error;
      let recovered = false;
      let result;
      for (const interceptor of this.errorInterceptors) {
        try {
          result = await interceptor(currentError);
          recovered = true;
          break;
        } catch (e) {
          currentError = e;
        }
      }
      
      if (recovered) {
        return result;
      }
      throw currentError;
    }
  }

  private async parseResponse(response: Response) {
    const contentType = response.headers.get('content-type');

    if (!contentType) return null;

    if (contentType.includes('application/json')) return response.json();
    if (contentType.includes('text/')) return response.text();
    if (contentType.includes('application/octet-stream') || contentType.includes('application/pdf')) return response.blob();

    return response.text();
  }

  get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any, options?: RequestInit) {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? data : (data !== undefined ? JSON.stringify(data) : undefined),
    });
  }

  put<T = any>(endpoint: string, data?: any, options?: RequestInit) {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? data : (data !== undefined ? JSON.stringify(data) : undefined),
    });
  }

  patch<T = any>(endpoint: string, data?: any, options?: RequestInit) {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? data : (data !== undefined ? JSON.stringify(data) : undefined),
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
