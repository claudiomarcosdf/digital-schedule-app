import { create } from "zustand";
import { InstanceInfo, QRCode } from "../types/whatsapp";
import { getInstanceInfoApi, getQRCodeApi } from "../libs/WhatsappService";

type WhatsappStoreProps = {
  instanceInfo: InstanceInfo | null;
  qrCode: QRCode | null;
  getInstanceInfo: () => void;
  getQRCode: () => void;
}

const initInstanceInfo = {
  error: false,
  message: '',
  user: null
}

const initQRCode = {
  error: false,
  message: null,
  image: null
}

export const useWhatsappStore = create<WhatsappStoreProps>((set) => ({
  instanceInfo: null,
  qrCode: null,
  getInstanceInfo: async () => {
    const { data, error } = await getInstanceInfoApi();

    const instance: InstanceInfo = initInstanceInfo;
    
    if (data) {
      instance.error = false;
      instance.message = '';
      instance.user = data.instance_data?.user?.id;
    } else if (error) {
      instance.error = true;
      instance.message = error as string;
      instance.user = null;
    } 

    if (instance.user || instance.error) {
      //Se houver usuário limpar qrCode
      //console.log("zerando qr code");
      const qrCode: QRCode = {
        error: false,
        message: null,
        image: null
      };

      set((state) => ({ ...state, instanceInfo: instance, qrCode: qrCode}));
    } else {
      set((state) => ({ ...state, instanceInfo: instance}));
    }
    
  },
  getQRCode: async () => {
    const { data, error } = await getQRCodeApi();

    const qrCode: QRCode = initQRCode;
    
    if (data) {
      qrCode.error = false;
      qrCode.message = '';
      qrCode.image = data?.qrcode;
    } else if (error) {
      qrCode.error = true;
      qrCode.message = error as string;
      qrCode.image = null;
    }   

    set((state) => ({ ...state, qrCode: qrCode }));    
  }
}));