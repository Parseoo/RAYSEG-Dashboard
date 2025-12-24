export interface propertyListItem {
    id: number,
    square: number,
    amountBed: number,
    title: string, 
    price: number,
    mainImage: string, 
    location: string,
    views: number,
    images: string[],
    description: string,
    facillity: { [key: string]: boolean }
}

export interface PropertyCardItem {
    id: number,
    square: number,
    amountBed: number,
    title: string, 
    price: number,
    mainImage: string, 
    location: string,
  }
  
export interface PropertyCardProps {
    data: PropertyCardItem
    opt?: string,
  }

export interface User {
  id: string;
  name: string;
  email: string;
  blocked: boolean,
  confirmed: boolean
}

export interface UserState {
  user: User | null;
  isLogin: boolean;
  token: string | null,
  login: (user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export interface RegisterForm {
  name: string
  username: string
  email: string 
  password: string
}

export interface LoginForm {
  identifier: string
  email: string 
  password: string
}