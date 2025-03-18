import { MENU_DEMO_KEY } from './menu';

// endpoint URL
export type ProductStatus = 'available' | 'rented' | 'returned';
export const mappingProductStatus: Record<string, string> = {
  booked: '계약중',
  available: '대여가능',
  rented: '대여중',
  returned: '반납'
};
// export const URL_BOARD_ADMIN_FOLDER_LIST = 'admin/board/folder'
