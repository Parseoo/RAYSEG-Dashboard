// About Us
export interface AboutUsResponse {
    title: string;
    short_description: string;
    history: string;
    mission: string;
    vision: string;
    corporate_images: CorporateImage[];
}

export interface CorporateImage {
    id: number;
    image_url: string;
}

export interface AboutUsRequest {
    title: string;
    short_description: string; 
    history: string;
    mission: string;
    vision: string;
}

export interface UploadCorporateImageRequest {
    file: string;
}

// Footer
export interface FooterResponse {
    physical_address: string;
    primary_phone: string;
    secondary_phone: string;
    email: string;
    business_hours: string;
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    whatsapp_number: string;
    footer_description: string;
}

// Services
export interface HeaderImage {
    id: number;
    image_url: string;
}

export interface UploadHeaderImagesRequest {
    images: string[];
}

export interface ServicesResponse {
    title: string;
    description: string;
    header_image_url?: string;
    header_images?: HeaderImage[];
    services: ServiceItem[];
}

export interface ServiceItem {
    id?: number;
    icon: string;
    name: string;
    description: string;
    order: number;
}

export interface ServicesRequest {
    title: string;
    description: string;
}

// Legal Pages
export interface LegalPagesResponse {
    privacy_title: string;
    privacy_content: string;
    terms_title: string;
    terms_content: string;
    updated_at?: string;
}

// Home
export interface HomeResponse {
    main_title: string;
    main_subtitle: string;
    main_image_url: string;
    introductory_title: string;
    introductory_subtitle: string;
}

export interface HomeRequest {
  main_title: string;
  main_subtitle: string;
  introductory_title: string;
  introductory_subtitle: string;
}

export interface UploadMainImageRequest {
  file: string;
}
