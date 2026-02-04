import { LoginForm, RegisterForm } from "@/lib/@type"
import axios from "axios"

axios.defaults.baseURL = process.env.NEXT_PUBLIC_HOST_API
axios.defaults.headers.common['Content-Type'] = 'application/json'

export const setAuthHeader = (token: string) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log(axios.defaults.headers.common.Authorization)
  };
  
export const clearAuthHeader = () => {
    axios.defaults.headers.common.Authorization = '';
  };

export async function RegisterApi(data: RegisterForm) {
    return await axios.post(`${process.env.NEXT_PUBLIC_REGISTER_API}`, data)
}

export async function LoginApi(data: LoginForm) {
    console.log('🔧 LoginApi - Enviando a:', axios.defaults.baseURL + '/api/auth/login');
    console.log('🔧 LoginApi - Datos:', data);
    console.log('🔧 LoginApi - Headers:', axios.defaults.headers.common);
    
    return await axios.post('/api/auth/login', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function GetUserApi() {
    return await axios.get(`${process.env.NEXT_PUBLIC_GETUSER_API}`)
}

