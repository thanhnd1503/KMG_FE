import dayjs from 'dayjs';

export const mockProductItem = async (id: string | number = 1): Promise<any> => {
  return {
    id,
    carNo: '125하1561',
    owner: 'Lee',
    producer: '현대',
    mainModel: '싼타페',
    mainGrade: 'R2.0 2WD',
    detailGrade: '프리미엄',
    color: '블루',
    class: 'R2.0 2WD 프리미엄',
    createDate: '2023-03-31',
    certificate: '싼타페(SANTAFE)',
    identificationNo: 'KMHS281BBLU221488',
    producePlace: 1,
    modal: 'M Spt',
    carType: '320i',
    year: '2016 / 8',
    detailModel: '신형 싼타페',
    newGrade: 'R2.0 2WD 프리미엄',
    producerKey: '5',
    mainModelKey: '110',
    detailModelKey: '2647',
    mainGradeKey: '17867',
    detailGradeKey: '36243',
    newGradeKey: '40257',
    demoKey: '8',
    usage: '일반',
    carBodyStyle: 'SUV',
    displacement: '1995',
    fuel: '디젤',
    transmission: '오토',
    fuelEfficiency: '13.8km/L(2등급)',
    newCarPrice: '29500000',
    factoryPrice: '32600000',
    maxSeat: 5,
    basicWarrantyPeriod: '2/3/4',
    powertrainWarrantyPeriod: 5,
    powertrainWarrantyMileage: '10000',
    emissionGasWarrantyPeriod: 5,
    emissionDrivingDistance: '80000',
    length: 4770,
    width: 1890,
    height: 1890,
    distanceAxles: 2765,
    modalImage: [
      {
        uid: '3',
        name: 'zzz.png',
        url: 'http://www.baidu.com/zzz.png'
      }
    ],
    operatingStatus: 1,
    optionMemo: ''
  };
};
export const mockMaintenances = [
  {
    id: 1,
    manager: '관리자(홍윤기)',
    period: ['2024-03-12 18:20', '2024-03-19 15:55'],
    address: '자체',
    partsCost: 0,
    laborCost: 0,
    totalCost: 0,
    detail: `배터리 점검`
  },
  {
    id: 2,
    manager: '관리자(홍윤기)',
    period: ['2024-03-12 18:20', '2024-03-19 15:55'],
    address: '자체',
    partsCost: 1,
    laborCost: 1,
    totalCost: 1,
    detail: `배터리 점검`
  }
];
export const mockAccidents = [
  {
    id: '1',
    status: 'receipt',
    contNo: 82647,
    accidentTime: '2024-03-12 18:20',
    operator: '박세라',
    accidentDetail:
      '사고 발생 장소:\n사고 내용:\n차량 파손 정보:\n인적 피해:\n과실 비율:\n보험사:\n보험사 담당자:\n보험사 담당자 연락처:\n보험사 사고 접수번호:\n기타:',
    opponentProduct:
      '차량 번호:\n차량 모델:\n차량 파손 정보:\n인적 피해:\n과실 비율:\n차량 소유주:\n보험사:\n보험사 사고 접수번호:\n보험사 담당자:\n보험사 담당자 연락처:'
  },
  {
    id: '2',
    status: 'receipt',
    contNo: 82647,
    accidentTime: '2024-03-12 18:20',
    operator: '박세라',
    accidentDetail:
      '사고 발생 장소:\n사고 내용:\n차량 파손 정보:\n인적 피해:\n과실 비율:\n보험사:\n보험사 담당자:\n보험사 담당자 연락처:\n보험사 사고 접수번호:\n기타:',
    opponentProduct:
      '차량 번호:\n차량 모델:\n차량 파손 정보:\n인적 피해:\n과실 비율:\n차량 소유주:\n보험사:\n보험사 사고 접수번호:\n보험사 담당자:\n보험사 담당자 연락처:'
  },
  {
    id: '3',
    status: 'receipt',
    contNo: 82647,
    accidentTime: '2024-03-12 18:20',
    operator: '박세라',
    accidentDetail:
      '사고 발생 장소:\n사고 내용:\n차량 파손 정보:\n인적 피해:\n과실 비율:\n보험사:\n보험사 담당자:\n보험사 담당자 연락처:\n보험사 사고 접수번호:\n기타:',
    opponentProduct:
      '차량 번호:\n차량 모델:\n차량 파손 정보:\n인적 피해:\n과실 비율:\n차량 소유주:\n보험사:\n보험사 사고 접수번호:\n보험사 담당자:\n보험사 담당자 연락처:'
  }
];
export const mockContracts = [
  {
    id: '1',
    manager: '홍길동',
    contractTime: '2024-03-12 18:20',
    status: 'complete',
    contractor: '박세라',
    contractorPhone: '010-8359-5789',
    contractTerm: ['2024-03-12 18:20', '2024-03-19 15:55']
  },
  {
    id: '2',
    manager: '홍길동',
    contractTime: '2024-03-12 18:20',
    status: 'complete',
    contractor: '박세라',
    contractorPhone: '010-8359-5789',
    contractTerm: ['2024-03-12 18:20', '2024-03-19 15:55']
  },
  {
    id: '3',
    manager: '홍길동',
    contractTime: '2024-03-12 18:20',
    status: 'complete',
    contractor: '박세라',
    contractorPhone: '010-8359-5789',
    contractTerm: ['2024-03-12 18:20', '2024-03-19 15:55']
  }
];
