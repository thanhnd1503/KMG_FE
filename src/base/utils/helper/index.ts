import dayjs from 'dayjs';
import DomToImage from 'dom-to-image-more';
import jsPDF from 'jspdf';

// import { MENU_ACCOUNT_KEY } from '@account/constants/menu';
import { KebapSortItem } from '@base/components/ListSettingKebap';
import commonServices from '@base/services/commonServices';
import { ISearch } from '@base/types/common';
// import { MENU_CUSTOMER_KEY } from '@customer/constants/menu';
// import { MENU_DASHBOARD_URL } from '@dashboard/constants/menu';
// import { MENU_PURCHASE_KEY } from '@purchase/constants/menu';
// import { MENU_SALES_KEY } from 'sales/constants/menu';
// import { MENU_STOCK_KEY } from 'stock/constants/menu';
// import { MENU_VENDOR_KEY } from 'vendor/constants/menu';

const DOM_SCALE_RATIO = window.innerWidth < 600 ? 3 : 0.8;
export const flattenObject = (obj: Record<string, any>): Record<string, any> => {
  return Object.values(obj).reduce((acc, curr) => {
    if (typeof curr === 'object' && curr !== null && !Array.isArray(curr)) {
      return { ...acc, ...curr };
    }
    return acc;
  }, {});
};
export const convertArrayToObject = (array: string[], allKeys: string[]) => {
  return allKeys.reduce(
    (acc, key) => {
      acc[key] = array.includes(key);
      return acc;
    },
    {} as Record<string, boolean>
  );
};
export const parseParamsToString = (params: ISearch) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key].toString());
  });
  return searchParams.toString();
};
export const splitString = (str: string, lengths: any[]) => {
  let result = [];
  let index = 0;

  for (let length of lengths) {
    if (index + length > str?.length || length === 'rest') {
      result.push(str?.slice(index));
      return result;
    }

    result.push(str?.slice(index, index + length));
    index += length;
  }

  return result;
};
export const goExport = (data: any, fileName: string = dayjs().format('YYYYMMDD'), fileType = '.xlsx') => {
  let url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName + fileType);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
export const moneyFormatter = (value: any) => `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const dateFormatter = (value: any) => value && dayjs(value).format('YYYY-MM-DD');
export const formatDateKorean = (dateString: string, type?: string): any => {
  if (dateString?.length !== 8 || isNaN(Number(dateString))) {
    return 'Invalid date format';
  }

  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  if (!type) {
    return `${year}-${month}-${day}`;
  }
  return `${year}년 ${month}월 ${day}일`;
};
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }

  return date.toISOString().slice(0, 16).replace('T', ' ');
};
export const calculateDaysDifference = (inputDate: string) => {
  const currentDate = new Date();
  const targetDate = new Date(inputDate);
  const currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const targetDateStartOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const differenceInMilliseconds = currentDateStart.getTime() - targetDateStartOfDay.getTime();
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return differenceInDays;
};
export const numberWithCommas = (value: number | string) => {
  if (!value) {
    return value;
  }
  const valueString = value.toString();
  const positionAddComma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
  return valueString.replace(positionAddComma, ',');
};
export const unComma = (value: string | number): number => {
  return parseFloat(String(value).replace(/,/g, '')) || 0;
};
export const getPdfFromHTMLs = async (pages: HTMLElement[] | HTMLElement | NodeListOf<Element>) => {
  try {
    const pdfWidth = window.innerWidth; // A4 width in mm
    const pdfHeight = pdfWidth * 1.41; // A4 height in mm
    const margin = 2;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [pdfWidth, pdfHeight]
    });
    if (pages instanceof NodeList) {
      pages = Array.from(pages) as HTMLElement[];
    }
    if (pages instanceof HTMLElement) {
      pages = [pages];
    }
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      const imageDataUrl = await DomToImage.toJpeg(page, {
        width: page.clientWidth * DOM_SCALE_RATIO,
        height: page.clientHeight * DOM_SCALE_RATIO,
        style: {
          transform: 'scale(' + DOM_SCALE_RATIO + ')',
          transformOrigin: 'top left'
        }
      });

      let imgWidth = pdfWidth - margin * 2;
      let imgHeight = (imgWidth * page.clientHeight) / page.clientWidth;
      // Kiểm tra nếu chiều cao hình ảnh vượt quá chiều cao trang PDF, thì chia thành nhiều trang
      pdf.addImage(imageDataUrl, 'JPEG', margin, margin, imgWidth, Math.min(imgHeight, pdfHeight - margin * 2), undefined, 'FAST');

      if (i < pages.length - 1) {
        pdf.addPage(); // Thêm trang mới trừ khi đây là phần tử cuối cùng
      }
    }

    return pdf;
  } catch (error) {
    console.error('ERROR:', error);
    return false;
  }
};
export const getIMGFromHTML = async (html: HTMLElement) => {
  const imageDataUrl = await DomToImage.toJpeg(html, {
    width: html.clientWidth * DOM_SCALE_RATIO,
    height: html.clientHeight * DOM_SCALE_RATIO,
    style: {
      transform: 'scale(' + DOM_SCALE_RATIO + ')',
      transformOrigin: 'top left'
    }
  });
  return imageDataUrl;
};

export const downloadFileByID = async (fileID: string, fileName: string) => {
  try {
    const res = await commonServices.getFile(fileID);
    if (res) {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);

      link.click();

      // Clean up and remove the link
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
};

export const generateUUID = function () {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};
export const generateKoreaMenu = function (menu: string): string {
  const menuMap: { [key: string]: string } = {
    // [MENU_PURCHASE_KEY]: '매입정보',
    // [MENU_CUSTOMER_KEY]: '고객관리',
    // [MENU_VENDOR_KEY]: '거래처 정보',
    // // [MENU_ACCOUNT_KEY]: '차량 정산 관리',
    // [MENU_ACCOUNT_KEY]: 'BPS 신차 지급내역(펌뱅킹) ',
    // [MENU_STOCK_KEY]: '모든 차량 리스트',
    // [MENU_SALES_KEY]: '전체',
    // [MENU_DASHBOARD_URL]: '고객관리'
  };

  return menuMap[menu] ?? menu;
};
export function formatPhoneNumber(phoneNumber: string): string {
  const notDigit = /\D/g;
  phoneNumber = phoneNumber?.replace(notDigit, '');

  if (phoneNumber?.length === 11) {
    const groupPhoneNumber = /(\d{3})(\d{4})(\d{4})/;
    const formatGroupPhoneNumber = '$1-$2-$3'; // as xxx-xxx-xxxx
    return phoneNumber?.replace(groupPhoneNumber, formatGroupPhoneNumber);
  } else {
    return phoneNumber || '-';
  }
}
export const isValuableObject = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  return Object.values(obj).some((value) => {
    if (typeof value === 'object' && value !== null) {
      return isValuableObject(value); // Đệ quy kiểm tra object con
    }
    return value !== undefined;
  });
};

export const getSortValue = (sortList: KebapSortItem[]) => {
  const sortItem = sortList.find((item) => item.sort !== false);
  if (sortItem) {
    return {
      sortKey: sortItem.key,
      sortOrder: typeof sortItem.sort === 'string' ? sortItem.sort.toUpperCase() : sortItem.sort
    };
  }
};

export const downloadPublicFile = (publicUrl: string, fileName: string) => {
  fetch(`${publicUrl + fileName}`).then((response) => {
    response.blob().then((blob) => {
      const fileURL = window.URL.createObjectURL(blob);

      let alink = document.createElement('a');
      alink.href = fileURL;
      alink.download = fileName;
      alink.click();
    });
  });
};
export const getMaxId = (arr: { [key: string]: any }[], fieldName: string = 'id'): number => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return -1; // or any default value you prefer
  }
  return Math.max(...arr.map((item) => item[fieldName]));
};
