import { atom } from 'recoil';

type ModalType = {
  visible: boolean;
  data?: any;
  onSubmit?: any;
  propertyProps?: any;
  width?: number;
};
export const counselRegAtom = atom<ModalType>({
  key: 'counselRegAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
export const contractRegAtom = atom<ModalType>({
  key: 'contractRegAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
export const customerRegAtom = atom<ModalType>({
  key: 'customerRegAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
export const productRegAtom = atom<ModalType>({
  key: 'productRegAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
export const companyRegAtom = atom<ModalType>({
  key: 'companyRegAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
export const modelRegAtom = atom<ModalType>({
  key: 'modelRegAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
export const sendKakaoAtom = atom<ModalType>({
  key: 'sendKakaoAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
export const confirmAtom = atom<ModalType>({
  key: 'confirmAtom',
  default: {
    visible: false,
    data: null,
    propertyProps: null,
    onSubmit: () => {},
    width: 480
  }
});
export const signatureModalAtom = atom<ModalType>({
  key: 'signatureModalAtom',
  default: {
    visible: false,
    data: null,
    onSubmit: () => {}
  }
});
