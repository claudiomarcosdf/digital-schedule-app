
export interface InstanceInfo {
  error: boolean;
  message?: string | null;
  user?: string | null;
}

export interface QRCode {
  error: boolean;
  message?: string | null;
  image?: string | null; 
} 

export interface FileMessage {
  fileName: string;
  message: string;
}