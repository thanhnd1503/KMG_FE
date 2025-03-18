import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import styles from './RentalAgreement.module.css';

import logo_702 from './images/logo_702.png';
import kolon_logo_1 from './images/kolon_logo_1.png';
import kolon_logo_mini_red from './images/kolon_logo_mini_red.png';
import kolon_logo_background from './images/kolon_logo_background.png';
import classNames from 'classnames/bind';
import { Button, Checkbox, ConfigProvider, DatePicker, Flex, Input, Select, Spin } from 'antd';
import customerServices from '@base/services/customerServices';
import { useParams, useSearchParams } from 'react-router-dom';
import Link from 'antd/es/typography/Link';
import { useSetRecoilState } from 'recoil';
import { signatureModalAtom } from '@base/store/atoms/modal';
import contractServices from '@base/services/contractServices';
import jsPDF from 'jspdf';
import { getIMGFromHTML, getPdfFromHTMLs, numberWithCommas, splitString } from '@base/utils/helper';
import ValueDisplay from '@base/components/ValueDisplay';
import commonServices from '@base/services/commonServices';
import useToast from '@base/hooks/useToast';
import CustomResult from '../CustomResult';
import dayjs from 'dayjs';
import AutoSizeInput from '@base/components/AutoSizeInput/AutoSizeInput';

const cx = classNames.bind(styles);
const { Group: CheckboxGroup } = Checkbox;

interface RentalAgreementProps {
  active?: boolean;
  round?: boolean;
}

interface signImageModal {
  key?: string;
  setOpenSignatureModal?: any;
  signImage?: any;
}

const useCheckboxGroups = (groupKeys: any[]) => {
  const initialState = groupKeys.reduce((acc: any, group: any) => ({ ...acc, [group.key]: group.values }), {});
  const [selectedValues, setSelectedValues] = useState(initialState);

  const handleChange = (group: any) => (checkedValues: any) => {
    if (checkedValues.length > 1) {
      setSelectedValues((prev: any) => ({
        ...prev,
        [group]: [checkedValues[checkedValues.length - 1]]
      }));
    } else {
      setSelectedValues((prev: any) => ({
        ...prev,
        [group]: checkedValues
      }));
    }
  };

  return [selectedValues, handleChange];
};

const RentalAgreement: React.FC<RentalAgreementProps> = () => {
  const firstTransferAgreementRef = useRef<HTMLDivElement | null>(null);
  const { temp_id } = useParams();
  const setOpenSignatureModal = useSetRecoilState(signatureModalAtom);
  const [arraySignModal, setArraySignModal] = useState<signImageModal[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [dataLoading, setDataLoading] = useState(false);
  const showToast = useToast();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const groupKeys = [
    { key: 'payment_type', values: [] },
    { key: 'black_box_install', values: [] },
    { key: 'terminus_attachment_status', values: [] },
    { key: 'gps', values: [] }
  ];
  const [selectedValues, handleChange] = useCheckboxGroups(groupKeys);
  useEffect(() => {
    const getData = async () => {
      setDataLoading(true);
      if (temp_id) {
        const res = await commonServices.getTemp(temp_id);
        if (res?.success) {
          const resData = JSON.parse(res.row?.data);
          console.log(resData);
          if (resData.customers?.[0]) {
            resData.customers[0].cust_address = resData?.customers?.[0]?.['cust_address']?.replace('[+]', ' ');
          }
          setData(resData);
          handleChange('payment_type')([resData?.payment_type]);
        }
      }
      setDataLoading(false);
    };
    getData();
  }, []);
  const handleSubmitSignature = (sig: string, id: string) => {
    setArraySignModal((prev) => {
      const existingItem = prev.find((item) => item.key === id);

      const updatedItem = existingItem
        ? { ...existingItem, setOpenSignatureModal: { visible: false }, signImage: sig }
        : { key: id, setOpenSignatureModal: { visible: false }, signImage: sig };

      const newArray = existingItem ? prev.map((item) => (item.key === id ? updatedItem : item)) : [...prev, updatedItem];

      return newArray;
    });

    setOpenSignatureModal({ visible: false });
  };

  const getSignImage = (id: string) => {
    return arraySignModal?.find((item) => item.key === id);
  };

  const handleClick = (id: string) => {
    setOpenSignatureModal({
      visible: true,
      onSubmit: (sig: any) => handleSubmitSignature(sig, id)
    });
  };
  const handleExportAsPDF = async () => {
    try {
      setExportLoading(true);
      const pages = document.querySelectorAll('.page');
      const pdf = await getPdfFromHTMLs(pages);
      if (pdf) {
        pdf.save('document.pdf');
      }
      setExportLoading(false);
    } catch (error) {
      console.error('ERROR:', error);
    }
  };

  const handleSubmitFinal = async () => {
    setSubmitLoading(true);
    try {
      const pages = document.querySelectorAll('.page');
      const pdf = await getPdfFromHTMLs(pages);
      if (pdf) {
        const pdfBlob = pdf.output('blob');
        if (pdfBlob && temp_id) {
          const file_upload = new File([pdfBlob], dayjs().format('장기렌트 계약서 MMDD.pdf'), { type: 'application/pdf' });

          const transferAgreementId = await handleUploadFirstTransferAgreement();
          const body = {
            temp_id,
            file_upload,
            transferAgreementId
          };

          const res = await contractServices.confirmContractAgreement(body);
          if (res?.success) {
            showToast({ content: '결제 변경 신청서가 성공적으로 전송되었습니다.', type: 'success' });
            setIsSubmitted(true);
            window.close();
          } else {
            showToast({ content: res?.message, type: 'error' });
          }
        }
      }
    } catch (error) {
      console.error('ERROR:', error);
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleUploadFirstTransferAgreement = async () => {
    if (firstTransferAgreementRef.current) {
      try {
        const imageDataUrl = await getIMGFromHTML(firstTransferAgreementRef.current);
        const blob = await fetch(imageDataUrl).then((res) => res.blob());

        // Tạo file từ Blob
        const file_upload = new File([blob], '자동이체 신청서.jpg', { type: 'image/jpeg' });

        const body = {
          file_upload
        };

        // Gửi POST request sử dụng dịch vụ contractServices
        const res = await contractServices.uploadAutoTransferAgreement(body);
        if (res?.success) {
          return res.file_upload_id;
        }
      } catch (error) {
        console.error('ERROR:', error);
      }
    }
  };
  const NameInput = () => <AutoSizeInput variant="filled" maxLength={50} />;
  if (isSubmitted) return <CustomResult title="자동차 장기 임대차 계약서(렌트)가" />;

  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <ConfigProvider theme={{ token: { controlInteractiveSize: 26 } }}>
      <Spin spinning={dataLoading}>
        <div className={cx('container')}>
          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>1/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
              {/* <img src={kolon_logo_mini_red} alt="Logo" /> */}
              {/* <img src={kolon_logo_background} alt="Logo" /> */}
            </div>
            <div className={cx('form')}>
              <div className={cx('form_heading')}>
                <h1 className={cx('form_heading_1')}>자동차 장기 임대차 계약서(렌트)</h1>
              </div>
              <div className={cx('form_content')}>
                <div className={cx('form_title_1')}>
                  <h2 className={cx('form_title_1_content')}>제1조 고객(계약자) 정보</h2>
                </div>

                <div className={cx('form_content_1')}>
                  <table className={cx('form_content_1_table', 'form_table')}>
                    <tr>
                      <th>고객(계약자)명 or 법인명</th>
                      <td className={cx('text_center')}>{data?.customers?.[0]?.['cust_name']}</td>
                      <th>연락처 1</th>
                      <td className={cx('text_center')}>{data?.customers?.[0]?.['cust_phone_number']}</td>
                    </tr>
                    <tr>
                      <th>주민 or 법인 등록번호</th>
                      <td className={cx('text_center')}>{data?.customers?.[0]?.['resident_registration_number']}</td>
                      <th>연락처 2</th>
                      <td className={cx('text_center')}>{data?.customers?.[0]?.['cust_phone_number2']}</td>
                    </tr>
                    <tr>
                      <th>법인 or 개인 사업자번호</th>
                      <td className={cx('text_center')}>
                        {data?.customers?.[0]?.['cust_type'] === 'company'
                          ? data?.customers?.[0]?.['company_registration_number']
                          : data?.customers?.[0]?.['business_registration_number']}
                      </td>
                      <th>담당자(법인)</th>
                      <td className={cx('text_center')}>{data?.customers?.[0]?.['cust_final_manager']}</td>
                    </tr>
                    <tr>
                      <th>대표자명(법인)</th>
                      <td className={cx('text_center')}>{data?.customers?.[0]?.['cust_represent'] || ''}</td>
                      <th>담당자 연락처(법인)</th>
                      <td className={cx('text_center')}>{data?.customers?.[0]?.['cust_contact_person']}</td>
                    </tr>
                    <tr>
                      <th>주소</th>
                      <td className={cx('text_center')} colSpan={3}>
                        {data?.customers?.[0]?.['cust_address']}
                      </td>
                    </tr>
                  </table>
                </div>
                <div className={cx('form_background')}>
                  <div className={cx('form_title_1')}>
                    <h2 className={cx('form_title_1_content')}>제2조 대여조건(렌트계약)</h2>
                  </div>

                  <div className={cx('form_two-table')}>
                    <div className={cx('form_content_1')}>
                      <div className={cx('form_subtitle')}>
                        <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
                        <h3 className={cx('form_subtitle_content')}>차량조건</h3>
                      </div>
                      <table className={cx('form_content_1_table', 'form_table')}>
                        <tr>
                          <th>대여차종(유종)</th>
                          <td className={cx('text_center')}>{data?.product?.['car_type']}</td>
                        </tr>
                        <tr>
                          <th>차량번호</th>
                          <td className={cx('text_center')}>{data?.product?.['car_number']}</td>
                        </tr>
                        <tr>
                          <th>소비자가</th>
                          <td className={cx('text_center')}>{numberWithCommas(data?.product?.['purchase_price'])}원</td>
                        </tr>
                        <tr>
                          <th>색상(외/내부)</th>
                          <td className={cx('text_center')}>{data?.product?.['car_color']}</td>
                        </tr>
                        <tr>
                          <th>옵션사항</th>
                          <td className={cx('text_center')}>{data?.product?.['car_option_note']}</td>
                        </tr>
                      </table>
                    </div>

                    <div className={cx('form_content_1')}>
                      <div className={cx('form_subtitle')}>
                        <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
                        <h3 className={cx('form_subtitle_content')}>차량조건</h3>
                      </div>
                      <table className={cx('form_content_1_table', 'form_table')}>
                        <tr>
                          <th>월 대여료</th>
                          <td colSpan={3}>
                            <div className={cx('flex-between', 'px-2')}>
                              <div className={cx('form_checkbox')}>
                                <CheckboxGroup
                                  style={{ borderColor: '#000' }}
                                  value={selectedValues?.['payment_type']}
                                  onChange={handleChange('payment_type')}
                                >
                                  {[
                                    { value: 'prepaid', label: '선납' },
                                    { value: 'postpaid', label: '후납' }
                                  ].map((item: any, index: number) => (
                                    <div key={index} className={cx('form_checkbox_item')}>
                                      <span>{item.label}</span>
                                      <Checkbox value={item.value} />
                                    </div>
                                  ))}
                                </CheckboxGroup>
                              </div>
                              <div className={cx('no_wrap')}>{numberWithCommas(data?.['monthly_amount'])}원/월</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>잔존율</th>
                          <td className={cx('text_center')}>{data?.['retention_rate']}</td>
                          <th>만기인수금액</th>
                          <td className={cx('text_center')}>{numberWithCommas(data?.['acquisition_amount'])}</td>
                        </tr>
                        <tr>
                          <th>약정주행거리</th>
                          <td colSpan={3} className={cx('text_center')}>
                            {data?.['contract_mileage']} 만Km/년
                          </td>
                        </tr>
                        <tr>
                          <th>대여기간</th>
                          <td colSpan={3} className={cx('text_center')}>
                            차량 인도일로부터 ({data?.['rental_period']})개월
                          </td>
                        </tr>
                        <tr>
                          <th>계약기간</th>
                          <td colSpan={3} className={cx('text_center')}>
                            계약 완료일로부터 차량 반납일까지
                          </td>
                        </tr>
                        <tr>
                          <th>위약금율</th>
                          <td className={cx('text_center')}>39%</td>
                          <th>연체이율</th>
                          <td className={cx('text_center')}>20%</td>
                        </tr>
                        <tr>
                          <th>보증금(원)</th>
                          <td className={cx('text_center')}>{numberWithCommas(data?.['deposit_amount'])}</td>
                          <th>선납금(원)</th>
                          <td className={cx('text_center')}>{numberWithCommas(data?.['advance_amount'])}</td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  <>
                    <div className={cx('form_subtitle')} style={{ paddingLeft: '12px' }}>
                      <h3 className={cx('form_subtitle_content')}>[보증금 ▪ 선납금 입금 계좌]</h3>
                    </div>
                    <div className={cx('form_content_1')}>
                      <table className={cx('form_content_1_table', 'form_table')}>
                        <tr>
                          <th className={cx('text_center')}>예금주</th>
                          <th className={cx('text_center')}>은행명</th>
                          <th className={cx('text_center')}>계좌번호</th>
                        </tr>
                        <tr>
                          <td className={cx('text_center')}>코오롱모빌리티그룹㈜</td>
                          <td className={cx('text_center')}>우리은행</td>
                          <td className={cx('text_center')}>1005-701-971363</td>
                        </tr>
                      </table>
                    </div>
                  </>

                  <div className={cx('form_subtitle')}>
                    <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
                    <h3 className={cx('form_subtitle_content')}>정비내용</h3>
                  </div>
                  <div className={cx('content_container', 'flex-between', 'form_content_1', 'div-border')}>
                    <div className={cx('container_content1')} style={{ width: '65%' }}>
                      <div>• 긴급출동(해당보험사기준) 6회/대여기간 내</div>
                      <div>• 제조사 기본 Warranty 제공</div>
                      <div>• 보험사항</div>
                      <div className={cx('form_content_1')}>
                        <table className={cx('form_content_1_table', 'form_table')}>
                          <tr>
                            <th>대인1/대인2</th>
                            <th>대물보상한도</th>
                            <th>자손보상한도</th>
                            <th>자차보험</th>
                            <th>무보험차상해</th>
                          </tr>
                          <tr>
                            <td className={cx('text_center')}>무한</td>
                            <td className={cx('text_center')}>{data?.['property_compensation_limit']} 억원</td>
                            <td className={cx('text_center')}>{data?.['child_compensation_limit']}</td>
                            <td className={cx('text_center')}>가입(면책금50만원)</td>
                            <td className={cx('text_center')}>2억원</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                    <div className={cx('container_content2')} style={{ width: '35%' }}>
                      <div className={cx('div-border')}>
                        고객센터 : 031-5182-5180
                        <br />
                        상담시간 : 평일 09:00 ~ 18:00
                        <br />
                        <p>상담시간 외 사고접수는 가입된 보험사를 통해 처리 가능합니다.</p>
                      </div>
                      <div className={cx('div-border')}>
                        가입 보험사 : 삼성화재(긴급출동 : 1588- 5114)
                        <br />
                        <p>
                          자차보험 보상 제외 항목 : 단독사고 또는 소모품(타이어, 휠, 오일, 필터, 브레이크 패드, 배터리, 부동액, 와이퍼 등)
                        </p>
                      </div>
                    </div>
                  </div>

                  <Flex justify="space-between" align="end" className={cx('div-border')}>
                    <Flex vertical gap={10}>
                      <span>
                        고객(계약자)은 본 조항의 주요내용에 대하여 충분히 이해한 후 본인의 의사에 따라 계약내용에 동의하였음을 확인합니다.
                      </span>
                      <AutoSizeInput variant="filled" defaultValue="YYYY-MM-DD" />
                    </Flex>
                    <Flex justify="center" align="center" gap={2} wrap>
                      <span>
                        고객(계약자) 성함 : <NameInput />
                      </span>
                      <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img1')}>
                        {getSignImage('sign_img1') ? (
                          <img
                            src={getSignImage('sign_img1')?.signImage}
                            style={{ maxWidth: '100%' }}
                            alt="signature"
                            width={window.innerWidth < 600 ? 80 : 160}
                          />
                        ) : (
                          '(서명)'
                        )}
                      </span>
                    </Flex>
                  </Flex>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>2/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제3조 월 대여료 지급</h2>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div>&#9312;</div>월 대여료는 월간단위로 카드, 직접이체 또는 자동이체를 통해 지급합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9313;</div>
                            ‘회사’는 자동이체 결제시 자동이체가 완료 된 날로부터 5영업일 이내에 세금계산서를 ‘고객’에게 발행합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9314;</div>월 중에 계약이 만료 또는 중도해지됨으로써 월간 사용일수의 과부족이 발생할 경우에는 양당사자는
                            월대여료를 1일 단위로 환산한 일평균대여료를 적용하여 정산합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9315;</div>
                            ‘고객’은 보증금/보증보험증권을 계약 후 3일 이내에 ‘회사’에게 현금/증권으로 지급하여야 합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9316;</div>
                            ‘고객’은 약관 제7조 제2항 제6호의 내용에 따라 본 계약 제2조의[고객부담금]을 부담하고 본 계약기간 중 발생한
                            교통법규 위반 범칙금은 전액을 부담합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9317;</div>
                            계약기간의 만료, 계약의 해지 등으로 본 계약이 종료될 경우, ‘회사’는 ‘고객’으로부터 수령한 보증금에서 ‘고객’이
                            부담해야 할 본 계약상의 모든 채무 (지연된 월대여료, 위약금, 손해배상 등 포함)를 공제한 금액을 ‘고객’에게
                            반환하기로 합니다. 단, 보증금액이 채무 금액보다 부족할 경우 차량반납 3일 이내에 차액을 ‘회사’가 제공한 계좌로
                            입금합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9318;</div>
                            계약기간의 만료, 계약의 해지 등으로 본 계약이 종료될 경우 차량은 반납을 원칙으로 합니다. 단, ‘고객’의 인수
                            요청이 있을 시 ‘회사’의 자체적인 판단으로 ‘고객’의 차량 인수 요청에 동의 할 수 있으며 차량의 인수대금은 약정한
                            차량의 잔존금액으로 합니다.
                          </div>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              고객(계약자)은 본 조항의 주요내용에 대하여 충분히 이해한 후 본인의 의사에 따라 계약내용에 동의하였음을
                              확인합니다.
                            </div>
                            <div className="content-end">
                              <Flex justify="center" align="center" gap={5} wrap>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img2')}>
                                  {getSignImage('sign_img2') ? (
                                    <img
                                      src={getSignImage('sign_img2')?.signImage}
                                      style={{ maxWidth: '100%' }}
                                      alt="signature"
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </Flex>
                            </div>
                          </div>
                        </div>
                      </>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제4조 운전자 범위</h2>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div>&#9312;</div>
                            <div>차량의 운전자 제한 연령은 제2조에 따릅니다.</div>
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9313;</div>
                            <div>
                              운전경력 12개월 이상의 유효한 운전면허증(외국인은 국제운전면허증) 소지자로서 아래 명기한 개인 또는 자격요건을
                              갖춘 자로 합니다.
                              <div className={cx('flex-start')}>
                                <div>(1) 개인고객 :</div>
                                계약자 본인 (운전자 범위 확대 시 추가금 발생)
                              </div>
                              <div className={cx('flex-start')}>
                                <div>(2) 개인사업자 :</div>
                                계약자 본인 (운전자 범위 확대 시 추가감 발생)
                              </div>
                              <div className={cx('flex-start')}>
                                <div>(3) 법인고객:</div>
                                법인의 임직원
                              </div>
                              <div className={cx('flex-start')}>
                                <div>(4)</div>
                                대리운전의 경우 자동차종합보험(대인배상, 대물배상, 자기신체사고, 자기차량손해)에 가입된 자, 단 본조 제2항
                                제1~3호의 운전자격을 갖춘 자가 동승한 경우로 한정
                              </div>
                              <div className={cx('flex-start')}>
                                <div>(5)</div>
                                본조의 운전자 조건을 충족하지 않는 자가 운전하여 발생한 모든 손해에 대한 배상책임은 ‘고객’에게 있습니다.
                              </div>
                            </div>
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9314;</div>
                            <div>
                              <div>운전자 정보</div>
                              <table className={cx('form_content_1_table', 'form_table')}>
                                <tr>
                                  <th>성명</th>
                                  <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                                    <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                                  </td>
                                  <th>생년월일</th>
                                  <td className={cx('text_center')}>{data?.customers?.[0]?.['cust_birthday']}</td>
                                </tr>
                                <tr>
                                  <th>주소</th>
                                  <td className={cx('text_center')} colSpan={3}>
                                    {data?.customers?.[0]?.['cust_address']}
                                  </td>
                                </tr>
                                <tr>
                                  <th>면허번호</th>
                                  <td className={cx('text_center')} colSpan={3}>
                                    <ValueDisplay
                                      defaultValue={''}
                                      value={data?.customers?.[0]?.['license_number']}
                                      formatFunction={[(value) => splitString(value, [2, 'rest']).join('-')]}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <th>전화번호</th>
                                  <td className={cx('text_center')} colSpan={3}>
                                    {data?.customers?.[0]?.['cust_phone_number']}
                                  </td>
                                </tr>
                              </table>
                              <div>
                                *상기의 실운전자는 약관 제5조의 자격요건을 충족하여야 하며, 운전자격 미충족되는 개인사업자 대표의 경우
                                반드시 실운전자 정보를 작성하셔야 합니다.
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <div style={{}}>
                        <div className={cx('div-border', 'sign_content')}>
                          <div>
                            고객(계약자)은 본 조항의 주요내용에 대하여 충분히 이해한 후 본인의 의사에 따라 계약내용에 동의하였음을
                            확인합니다.
                          </div>
                          <div className="content-end">
                            <Flex justify="center" align="center" gap={5} wrap>
                              <span>
                                고객(계약자) 성함 : <NameInput />
                              </span>
                              <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img3')}>
                                {getSignImage('sign_img3') ? (
                                  <img
                                    src={getSignImage('sign_img3')?.signImage}
                                    style={{ maxWidth: '100%' }}
                                    alt="signature"
                                    width={window.innerWidth < 600 ? 80 : 160}
                                  />
                                ) : (
                                  '(서명)'
                                )}
                              </span>
                            </Flex>
                          </div>
                        </div>
                      </div>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제5조 차량 보험 및 보상, 책임규정</h2>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div>&#9312;</div>
                            <div>
                              ‘회사’는 대여차량의 소유주로서 ‘고객’의 과실로 인한 사고 에 대해, 이를 보호하기 위하여 영업용자동차보험 대인배
                              상Ⅰ, 대인배상Ⅱ, 대물배상 및 자기신체사고담보에 가입한 차량을 대여하기로 합니다
                            </div>
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9313;</div>
                            <div>
                              <div>보험보상한도</div>
                              <div>
                                <div>
                                  <div>
                                    (1) ‘고객’은 사고 발생시 본 계약서 앞면의 보험사항에 따라 ‘회사’가 가입한 영업용자동차보험 약관에 명시
                                    된 해석과 보장 범위 내에서 손해를 보상받을 수 있 습니다. 다만, ‘고객’이 다음 각 목의 어느 하나에 해
                                    당하는 사유로 발생한 손해와 법규의 위반으로 인한 손해 및 영업용자동차보험약관에서 정한 ‘보상하지 않는
                                    사항’(면책사항)에 해당하여 일부 또는 전부를 보상받지 못하는 손해는 ‘고객’의 부담 및 책임으로 합니다.
                                  </div>
                                  <div style={{ padding: '0px 12px' }}>
                                    <div>가. 고의로 인한 손해</div>
                                    <div>나. 무면허운전 사고로 인한 손해</div>
                                    <div>
                                      다. 영리를 목적으로 대여차량을 전대하거나 요 금 또는 대가를 받고 대여차량을 사용하다가 생긴 사고로
                                      인한 손해
                                    </div>
                                    <div>라. 범죄를 목적으로 대여차량을 사용하다가 발 생한 손해</div>
                                    <div>마. 음주운전/도주(사고 후 조치 미이행) 사고로 인한 손해</div>
                                    <div>바. 마약, 각성제, 신나 등 약물에 취한 상태에서 운전하다가 생긴 사고로 인한 손해</div>
                                    <div>사. 정상적인 도로 이외(해수욕장, 갯벌, 계곡, 차 량출입제한구역 등)의 지역을 운행하는 행위</div>
                                    <div>
                                      아. 본 계약서상의 운전자 이외의 자(제5조 운전 자 자격요건을 갖추지 못한 자를 포함)가 대여 차량을
                                      운전하다가 생긴 사고로 인한 손해
                                    </div>
                                    <div>
                                      자. 계약기간 만료, 해제, 해지 등으로 인한 계약 종료 후에도 대여차량을 반환하지 않고 운행 하는 중 생긴
                                      사고로 인한 손해
                                    </div>
                                    <div>차. 대여차량 도난 이후 발생한 사고로 인한 손해</div>
                                  </div>
                                </div>
                                <div>
                                  (2) 본 조 제2항 제1호 단서에 의한 사유로 인한 사고 발 생시 ‘고객’은 ‘회사’에 대하여 차량 감가 및 실수리비
                                  손해를 배상하여야 합니다.
                                </div>
                                <div>
                                  (3) ‘회사’가 제3자에 대하여 ‘고객’의 고의, 과실에 기한 사고로 인한 손해를 먼저 배상한 경우에는 ‘회사’는
                                  ‘고객’에 대하여 해당 금액에 대한 구상권을 청구할 수 있습니다.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{}}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              고객(계약자)은 본 조항의 주요내용에 대하여 충분히 이해한 후 본인의 의사에 따라 계약내용에 동의하였음을
                              확인합니다.
                            </div>
                            <div className="content-end">
                              <Flex justify="center" align="center" gap={5} wrap>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img4')}>
                                  {getSignImage('sign_img4') ? (
                                    <img
                                      src={getSignImage('sign_img4')?.signImage}
                                      style={{ maxWidth: '100%' }}
                                      alt="signature"
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </Flex>
                            </div>
                          </div>
                        </div>
                      </>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제6조 자차손해면책제도</h2>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div>&#9312;</div>
                            계약기간의 만료, 계약의 해지 등으로 본 계약이 종료될 경우 차량은 반납을 원칙으로 합니다. 단, ‘고객’의 인수
                            요청이 있을 시 ‘회사’의 자체적인 판단으로 ‘고객’의 차량 인수 요청에 동의 할 수 있으며 차량의 인수대금은 약정한
                            차량의 잔존금액으로 합니다.
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>3/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div></div>[고객부담금] 미만인 경우에는 ‘고객’이 실수리비를 부 담하기로 합니다. 단, ‘회사’가 약관 제10조 제4항에
                            따 라 본 계약을 해지하는 경우 ‘고객’은 차량 수리 여부를 불문하고 ‘회사’에게 [고객부담금]을 지급합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9313;</div>
                            자차손해면책제도는 본 계약에 따른 대여차량이 ‘고객’에 게 인도된 이후부터 적용되는 것으로 봅니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9314;</div>
                            <div>
                              <div>
                                제1항에도 불구하고 다음과 같은 경우에는 자차손해면책 제도 가입여부와 무관하게 ‘고객’의 책임으로 합니다(자차
                                손해면책제도 적용 불가).
                              </div>
                              <div>
                                <div>(1) 계약서 제5조 제2항 제1호 단서에 해당하는 경우</div>
                                <div>(2) ‘고객’ 또는 운전자가 허락하여 탑승한 탑승객의 고의 가 있는 경우</div>
                                <div>
                                  (3) ‘고객’ 또는 운전자의 명백한 관리소홀 또는 부주의로 인한 도난, 분실, 파손, 충돌, 추락, 전복 또는 침수
                                  등의 경우
                                </div>
                                <div>(4) 단독사고일 경우</div>
                                <div>(5) 대여차량의 일부 부분품, 부속품, 부속기계장치만의 자연마모가 아닌 파손, 훼손 또는 도난의 경우</div>
                                <div>(6) 허위계약 또는 계약위반의 경우</div>
                                <div>(7) 약관 제8조 제①항을 위반한 경우</div>
                              </div>
                            </div>
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9315;</div>
                            ‘고객’은 차량손해에 대한 [고객부담금] 또는 실수리비를 지체 없이 ‘회사’에게 지급하여야 합니다. ‘고객’이 [고객부
                            담금] 또는 실수리비의 원인을 제공한 책임 있는 대여차량 의 운전자 등으로부터 그 상당액을 수취하는 것은 ‘고객’의
                            책임과 권한으로 합니다. 다만, 해당 운전자 등이 ‘회사’에 [고객부담금] 또는 실수리비를 직접 납부한 때에는 ‘고객’
                            에게 동 금액을 별도로 청구하지 아니합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9316;</div>
                            ‘회사’는 ‘고객’에게 사고 수리된 차량이 인도되기 전 [고객 부담금]을 청구할 수 있으며, 최소한 사고 수리된 차량의
                            출고와 동시에 [고객부담금]이 지급되어야 차량을 인도할 수 있습니다. 단, 실제 수리비가 [고객부담금] 미만인 경우
                            에는 ‘회사’는 차액분에 대해 ‘고객’에게 지급합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9317;</div>
                            ‘고객’은 임차한 차량을 수리하지 않고 미수선수리비의 명 목 등으로 차량수리비를 보험사나 가해 운전자 등에게 청
                            구할 수 없으며, 수리비청구 등과 관련된 모든 권리는 ‘회 사’가 갖습니다.
                          </div>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              고객(계약자)은 본 조항의 주요내용에 대하여 충분히 이해한 후 본인의 의사에 따라 계약내용에 동의하였음을
                              확인합니다.
                            </div>
                            <div className="content-end">
                              <Flex justify="center" align="center" gap={5} wrap>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img5')}>
                                  {getSignImage('sign_img5') ? (
                                    <img
                                      src={getSignImage('sign_img5')?.signImage}
                                      style={{ maxWidth: '100%' }}
                                      alt="signature"
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </Flex>
                            </div>
                          </div>
                        </div>
                      </>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제7조 초과운행 부담금</h2>
                        </div>

                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div>&#9312;</div>
                            약정주행거리가 있는 경우, 본 계약이 종료(대여기간 만료, 해제 또는 해지된 경우 포함)된 후 차량의 운행거리가 본
                            계약서 앞면 약정주행거리를 초과한 경우에 초과운행부담 금을 정산하여야 합니다. (VAT 별도)
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9313;</div>
                            ‘고객’이 대여기간이 만료되기 이전에 해지한 경우에는 ‘고 객’의 약정운행거리를 일단위로 환산하여 초과운행거리를
                            산정합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9314;</div>
                            초과운행거리 산정 시 실 주행거리에서 500km를 뺀 값으 로 산정합니다.
                          </div>
                          <div style={{ paddingTop: 20 }}>
                            본 조 제&#9313;항 및 제&#9314;항에 따라 산정한 초과운행거리에 대하여 다음과 같은 방식으로 초과운행 부담금을
                            산정합니다. 초과운행료 = 국산차량 250원/km, 수입 외산차량 500원/km (차종 및 배기량은 무관) 초과운행 부담금 =
                            초과운행 km x km당 초과운행료
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <div className={cx('form_content_1')}>
                        <div>초과운행 km = 실제 운행거리 - 일일 약정운행거리 × 운행일</div>
                        <div>수 - 500km</div>
                        <div>일일 약정운행거리 = 연 약정운행거리 / 365</div>
                        <div style={{}}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              고객(계약자)은 본 조항의 주요내용에 대하여 충분히 이해한 후 본인의 의사에 따라 계약내용에 동의하였음을
                              확인합니다.
                            </div>
                            <div className="content-end">
                              <Flex justify="center" align="center" gap={5} wrap>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img6')}>
                                  {getSignImage('sign_img6') ? (
                                    <img
                                      src={getSignImage('sign_img6')?.signImage}
                                      style={{ maxWidth: '100%' }}
                                      alt="signature"
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </Flex>
                            </div>
                          </div>
                        </div>
                      </div>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제8조 차량 반납 및 감가 기준</h2>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div>&#9312;</div>
                            계약 종료 시 고객은 ‘회사’에게 차량을 최초 인도 받은 상태(판금, 도장을 필요로 하지 않는 양호한 상태)로
                            반납하여야 합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9313;</div>
                            감가대상 및 부위는 ‘자차손해면책’ 예외 사항 기준.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9314;</div>
                            사고와 외판 교환 및 외관의 수리가 필요한 부분에 대해서는 제4항 및 제5항의 감가를 적용합니다.
                          </div>
                          <div className={cx('flex-start')}>
                            <div>&#9315;</div>
                            가치 감가 : 반납차량의 상태를 점검한 결과를 기준으로 교환건에 대하여 적용합니다.
                          </div>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div>(1) 가치 감가 기준표</div>
                          <table className={cx('form_content_1_table', 'form_table')} style={{}}>
                            <tr>
                              <th>부위명칭</th>
                              <th>감가율</th>
                              <th>부위명칭</th>
                              <th>감가율</th>
                            </tr>
                            <tr>
                              <th>앞도어(좌)</th>
                              <td className={cx('text_center')}>4%</td>
                              <th>앞도어(우)</th>
                              <td className={cx('text_center')}>4%</td>
                            </tr>
                            <tr>
                              <th>뒷도어(좌)</th>
                              <td className={cx('text_center')}>4%</td>
                              <th>뒷도어(우)</th>
                              <td className={cx('text_center')}>4%</td>
                            </tr>
                            <tr>
                              <th>A필러(좌)</th>
                              <td className={cx('text_center')}>5%</td>
                              <th>B필러(우)</th>
                              <td className={cx('text_center')}>5%</td>
                            </tr>
                            <tr>
                              <th>B필러(좌)</th>
                              <td className={cx('text_center')}>5%</td>
                              <th>B필러(우)</th>
                              <td className={cx('text_center')}>5%</td>
                            </tr>
                            <tr>
                              <th>쿼터패널(좌)</th>
                              <td className={cx('text_center')}>9%</td>
                              <th>쿼터패널(우)</th>
                              <td className={cx('text_center')}>9%</td>
                            </tr>
                            <tr>
                              <th>트렁크리드</th>
                              <td className={cx('text_center')}>6%</td>
                              <th>후드</th>
                              <td className={cx('text_center')}>6%</td>
                            </tr>
                            <tr>
                              <th>프론트휀더(좌)</th>
                              <td className={cx('text_center')}>4%</td>
                              <th>프론트휀더(우)</th>
                              <td className={cx('text_center')}>4%</td>
                            </tr>
                            <tr>
                              <th>사이드실(좌)</th>
                              <td className={cx('text_center')}>5%</td>
                              <th>사이드실(우)</th>
                              <td className={cx('text_center')}>5%</td>
                            </tr>
                            <tr>
                              <th>앞범퍼</th>
                              <td className={cx('text_center')}>0%</td>
                              <th>뒷범퍼</th>
                              <td className={cx('text_center')}>0%</td>
                            </tr>
                            <tr>
                              <th>프론트패널</th>
                              <td className={cx('text_center')}>6%</td>
                              <th>리어패널</th>
                              <td className={cx('text_center')}>6%</td>
                            </tr>
                            <tr>
                              <th>트렁크 플로어</th>
                              <td className={cx('text_center')}>6%</td>
                              <th>트렁크 플로어</th>
                              <td className={cx('text_center')}>6%</td>
                            </tr>
                            <tr>
                              <th>앞휠하우스(좌)</th>
                              <td className={cx('text_center')}>13%</td>
                              <th>앞휠하우스(우)</th>
                              <td className={cx('text_center')}>13%</td>
                            </tr>
                            <tr>
                              <th>뒷휠하우스(좌)</th>
                              <td className={cx('text_center')}>13%</td>
                              <th>뒷휠하우스(우)</th>
                              <td className={cx('text_center')}>13%</td>
                            </tr>
                            <tr>
                              <th>인사이드패널(좌)</th>
                              <td className={cx('text_center')}>4%</td>
                              <th>인사이드패널(우)</th>
                              <td className={cx('text_center')}>4%</td>
                            </tr>
                            <tr>
                              <th>앞사이드멤버(좌)</th>
                              <td className={cx('text_center')}>10%</td>
                              <th>앞사이드멤버(우)</th>
                              <td className={cx('text_center')}>10%</td>
                            </tr>
                            <tr>
                              <th>뒷사이드멤버(좌)</th>
                              <td className={cx('text_center')}>10%</td>
                              <th>뒷사이드멤버(우)</th>
                              <td className={cx('text_center')}>10%</td>
                            </tr>
                            <tr>
                              <th>앞대쉬패널</th>
                              <td className={cx('text_center')}>15%</td>
                              <th>뒷대쉬패널</th>
                              <td className={cx('text_center')}>15%</td>
                            </tr>
                            <tr>
                              <th>플로어패널</th>
                              <td className={cx('text_center')}>15%</td>
                              <th>크로스멤버</th>
                              <td className={cx('text_center')}>15%</td>
                            </tr>
                            <tr>
                              <th>루프패널</th>
                              <td className={cx('text_center')}>13%</td>
                              <th></th>
                              <td className={cx('text_center')}></td>
                            </tr>
                          </table>
                          <div className={cx('flex-start')}>
                            <div>(2)</div>
                            <div>
                              가치 감가액 = 차량 권장 소비자가격 x 항목별 감가율 총합계 (단, 최초등록일 기준 3년 이하 차량은 차량 소비자가
                              100%를 기준으로 감가 적용하며, 3 ~ 4년 이하차량은 차량 소비자가 기준 75% 4 ~ 5년 이하 차량은 차량 소비자가
                              기준 50% 기준으로 감가를 적용하기로 합니다.)
                            </div>
                          </div>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('flex-start')}>
                            <div>&#9316;</div>
                            실수리비 감가 : 기타 차량의 ‘파손’으로 인한 차량의 내/외관 원상복구가 필요한 부위에 대해서는 실수리비로 감가
                            하기로 합니다. (예시 : 유리, 사이드미러, 타이어, 휠, 오디오, 시트 등의 내/외장 부품 훼손)
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div ref={firstTransferAgreementRef} className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>4/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div>
                            (1) 파손이란 긁힌 것, 벗겨진 것, 휘어지거나 들어간 것, 색깔을 바꾼 것, 찍힘, 우그러짐, 부분 스프레이칠, 부식등
                            정상적인 차량상태와 상이한 경우를 말합니다.
                          </div>
                          <div>(2) 휠의 경우 소모품이 아니므로, 복원 비용이 청구됩니다.</div>
                          <div>(3) 전면유리의 파손 및 균열이 있는 경우 전면유리 교체비용이 청구됩니다.</div>
                        </div>
                        <div className={cx('form_content_1')}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              고객(계약자)은 본 조항의 주요내용에 대하여 충분히 이해한 후 본인의 의사에 따라 계약내용에 동의하였음을
                              확인합니다.
                            </div>
                            <div className="content-end">
                              <Flex justify="center" align="center" gap={5} wrap>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img7')}>
                                  {getSignImage('sign_img7') ? (
                                    <img
                                      src={getSignImage('sign_img7')?.signImage}
                                      alt="signature"
                                      style={{ maxWidth: '100%' }}
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </Flex>
                            </div>
                          </div>
                        </div>
                      </>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제9조 결제정보</h2>
                        </div>
                        <div className={cx('form_subtitle')}>
                          <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
                          <h3 className={cx('form_subtitle_content')}>CMS 출금이체 신청서</h3>
                        </div>
                        <div className={cx('form_content_1')}>
                          <table className={cx('form_content_1_table', 'form_table')}>
                            <tr>
                              <th>수납기관명</th>
                              <td className={cx('text_center')} colSpan={3}>
                                효성FMS
                              </td>
                            </tr>
                            <tr>
                              <th>요금종류</th>
                              <td className={cx('text_center')} colSpan={3}>
                                월요금
                              </td>
                            </tr>
                            <tr>
                              <th>고객명</th>
                              <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                                <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                              </td>
                              <th>생년월일</th>
                              <td className={cx('text_center')}>{data?.payment?.['payer_number']}</td>
                            </tr>
                            <tr>
                              <th>주소</th>
                              <td className={cx('text_center')} colSpan={3}>
                                {data?.payment?.['payer_address']}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                범칙금주소 <br />
                                (실거주지)
                              </th>
                              <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')} colSpan={3}>
                                <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                              </td>
                            </tr>
                            <tr>
                              <th>연락처</th>
                              <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')} colSpan={3}>
                                <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                              </td>
                            </tr>
                            <tr>
                              <th>신청은행명</th>
                              <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')} colSpan={3}>
                                <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                              </td>
                            </tr>
                            <tr>
                              <th>계좌번호</th>
                              <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')} colSpan={3}>
                                <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                              </td>
                            </tr>
                            <tr>
                              <th>결제일</th>
                              <td className={cx('text_center')} colSpan={3}>
                                매월
                                <Select
                                  suffixIcon={false}
                                  popupClassName={cx('select-input__popup')}
                                  className={cx('select-input')}
                                  style={{ maxWidth: 200, marginLeft: 5 }}
                                  options={[
                                    { value: '5일', label: '5일' },
                                    { value: '15일', label: '15일' },
                                    { value: '25일', label: '25일' }
                                  ]}
                                />
                                <br />
                                *차량 출고 월의 익월 결제일 청구
                              </td>
                            </tr>
                            <tr>
                              <th>계산서발행</th>
                              <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')} colSpan={3}>
                                <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                              </td>
                            </tr>
                          </table>
                        </div>
                      </>
                      <>
                        <div style={{ width: '100%' }} className={cx('my-2')}>
                          <h2 className={cx('form_title_1_content')}>제10조 블랙박스 등 관련 내용</h2>
                        </div>

                        <div style={{ margin: '0px 20px' }}>
                          <table className={cx('form_content_1_table', 'form_table')}>
                            <tr>
                              <th>블랙박스 장착 유무</th>
                              <td>
                                <div className={cx('flex-between')}>
                                  <div className={cx('form_checkbox')}>
                                    <CheckboxGroup
                                      style={{ borderColor: '#000', fontSize: '40px' }}
                                      value={selectedValues?.['black_box_install']}
                                      onChange={handleChange('black_box_install')}
                                    >
                                      {['동의', '미동의'].map((key) => (
                                        <div key={key} className={cx('form_checkbox_item')}>
                                          <span>{key}</span>
                                          <Checkbox value={key} />
                                        </div>
                                      ))}
                                    </CheckboxGroup>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>

                        <div style={{ margin: '0 10px' }}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              <div className={cx('mb-2')}>제3자 영상제공 동의</div>
                              <div className={cx('mb-2')}>
                                블랙박스 장착 차량임을 안내 받고 확인하였습니다. 블랙박스 영상은 교통사고 시 사고처리를 위한 정보(증거)
                                수집용으로만 사용되며, 고객(고객)은 해당 차량의 사고처리 목적으로 기록된 사고 영상을 ‘회사’ 및 자동차보험
                                가입 보험회사, 기타 관계 기관(경찰서 등)에서 요청한 경우 해당 사고 영상을 제공하는 것에 동의합니다.
                              </div>
                              <div className={cx('mb-2')}>
                                본인은 블랙박스로부터 수집되는 영상정보에 관하여 아래와 같은 사항에 대하여 동의합니다
                              </div>
                              <div className={cx('mb-2')}>
                                - 수집항목 : 블랙박스로 촬영되는 영상정보 및 그에 포함될 수 있는 개인정보
                                <br />
                                - 이용목적 : 사고처리를 위한 차량 블랙박스의 작동
                                <br />- 보유 및 이용기간 : 블랙박스 폐기 시점까지(다만, 정보주체가 영상정보 직접 삭제 후 반납 가능)
                              </div>
                            </div>
                            <div className="content-end">
                              <Flex justify="center" align="center" gap={5} wrap>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img8')}>
                                  {getSignImage('sign_img8') ? (
                                    <img
                                      src={getSignImage('sign_img8')?.signImage}
                                      alt="signature"
                                      style={{ maxWidth: '100%' }}
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </Flex>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제11조 하이패스 단말기 부착여부</h2>
                        </div>

                        <div className={cx('m-2')}>
                          <table className={cx('form_content_1_table', 'form_table')}>
                            <tr>
                              <th>단말기 부착 유무</th>
                              <td>
                                <div className={cx('flex-between')}>
                                  <div className={cx('form_checkbox')}>
                                    <CheckboxGroup
                                      style={{ borderColor: '#000', fontSize: '40px' }}
                                      value={selectedValues?.['terminal_attachment_status']}
                                      onChange={handleChange('terminal_attachment_status')}
                                    >
                                      {['부착', '부착하지 않음'].map((key) => (
                                        <div key={key} className={cx('form_checkbox_item')}>
                                          <span>{key}</span>
                                          <Checkbox value={key} />
                                        </div>
                                      ))}
                                    </CheckboxGroup>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>

                        <div style={{ margin: '0 10px' }}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              <div className={cx('mb-2')}>
                                고객(계약자)은 본 계약의 주요내용인 보증사항, 계약조건, 보험사항, 정비조건 특약사항 및 임대차 계약 약관에
                                대하여 충분한 설명을 듣고 잘 이해한 후 본인의 의사에 따라 본 계약을 체결하였으며, 본 계약의 계약내용을
                                성실히 이행할 것을 확약합니다.
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                      <>
                        <div style={{ width: '100%' }}>
                          <h2 className={cx('form_title_1_content')}>제12조 GPS 부착여부</h2>
                        </div>

                        <div className={cx('m-2')}>
                          <table className={cx('form_content_1_table', 'form_table')}>
                            <tr>
                              <th>GPS 부착 유무</th>
                              <td>
                                <div className={cx('flex-between')}>
                                  <div className={cx('form_checkbox')}>
                                    <CheckboxGroup
                                      style={{ borderColor: '#000' }}
                                      value={selectedValues?.['gps']}
                                      onChange={handleChange('gps')}
                                    >
                                      {['부착', '부착하지 않음'].map((key) => (
                                        <div key={key} className={cx('form_checkbox_item')}>
                                          <span>{key}</span>
                                          <Checkbox value={key} />
                                        </div>
                                      ))}
                                    </CheckboxGroup>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>

                        <div style={{ margin: '0 10px' }}>
                          <div className={cx('div-border', 'sign_content')}>
                            <div>
                              <div className={cx('mb-2')}>
                                <div className={cx('pb-2')}>개인위치정보의 보유 목적 및 이용기간</div>
                                <div className={cx('pb-2')}>
                                  코오롱모빌리티그룹은 본건 서비스를 제공하고 관련 법령을 준수하며 기타 개인위치정보주체가 동의한 목적을
                                  위해 개인위치정보를 보유합니다.
                                </div>
                                <div className={cx('pb-2')}>
                                  코오롱모빌리티그룹은 개인위치정보주체가 본건 서비스를 이용하기위해 대여계약 기간 동안 개인위치정보주체의
                                  개인위치정보를 이용합니다.
                                  <br />
                                  단, 관련 법령에 따라 개인위치정보를 보존할 의무가 있는 때에는 해당 법령에서 정하는 기간 동안 개인
                                  위치정보를 보유합니다.
                                </div>
                                <div className={cx('pb-2')}>
                                  대여금액 연체등 계약 해지 사유 발생시 코오롱모빌리티 그룹은 GPS 단말기에 설치된 시동제어 등의 차량 회수를
                                  위한 조치를 취할 수 있습니다.
                                </div>
                                <div>본인은 GPS 단말기로부터 수집되는 정보 및 기능에 관하여 동의합니다</div>
                              </div>
                            </div>
                            <div className="content-end">
                              <Flex justify="center" align="center" gap={5} wrap>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img9')}>
                                  {getSignImage('sign_img9') ? (
                                    <img
                                      src={getSignImage('sign_img9')?.signImage}
                                      alt="signature"
                                      style={{ maxWidth: '100%' }}
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </Flex>
                            </div>
                          </div>
                          <Flex justify="center" style={{ marginTop: 15 }}>
                            <AutoSizeInput variant="filled" defaultValue="YYYY-MM-DD" />
                          </Flex>
                        </div>
                      </>
                      <div className={cx('info__wrapper')}>
                        <div className={cx('flex-end')}>‘고객’(계약자)</div>
                        <div>
                          <div className={cx('customer-info')}>
                            <div className={cx('flex-between')}>
                              <div className={cx('pb-2')} style={{ flex: 1 }}>
                                주소 : {data?.customers?.[0]?.['cust_address']}
                              </div>
                            </div>
                            <div>
                              <div style={{ flex: 1 }}>연락처 : {data?.customers?.[0]?.['cust_phone_number']}</div>
                            </div>
                            <Flex wrap justify="space-between" align="center" className={cx('signature-wrapper')}>
                              <div style={{}}>
                                <span>
                                  고객(계약자) 성함 : <NameInput />
                                </span>
                              </div>
                              <div>
                                <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img10')}>
                                  {getSignImage('sign_img10') ? (
                                    <img
                                      src={getSignImage('sign_img10')?.signImage}
                                      alt="signature"
                                      style={{ maxWidth: '100%' }}
                                      width={window.innerWidth < 600 ? 80 : 160}
                                    />
                                  ) : (
                                    '(서명)'
                                  )}
                                </span>
                              </div>
                            </Flex>
                          </div>
                          <div className={cx('company-info')}>
                            <div className="content-end">‘회사”</div>
                            <div className="content-end" style={{ position: 'relative' }}>
                              <img src={kolon_logo_1} alt="Logo" />
                            </div>
                            <div className="content-end">경기도 안양시 동안구 평촌대로212번길 55, 9층</div>
                            <div className="content-end">(관양동, 대고빌딩)</div>
                            <div className="content-end">
                              <div>대표이사 전 철 원</div>
                              <div className={cx('opacity-50')}>(직인생략)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>5/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('div-border', 'bg_primary', 'text_center')}>
                              <div>자동차 임대차 계약 약관</div>
                            </div>
                            <div className={cx('pb-2')}>
                              임차인 (이하 “고객”)과 임대인 코오롱모빌리티그룹㈜(이하 “회사”)는 차량의 임대차계약(이하 “임대차계약”)을
                              체결함에 있어 다음과 같이 합의하고 이를 성실히 준수, 이행하기로 합니 다.
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제1조 차종 및 대여요금</div>
                              <div>
                                “회사”가 임대차계약에 따라 고객에 대여한 차량(이하 “대여차 량”)의 차종 및 대여요금은 “고객”과 “회사”가
                                합의한 임대차 계약 제2조의 [대여차종] 및 [월대여료]에 의하며, [보험조건] 에서 정한 영업용 자동차보험
                                보험료(대인배상, 대물배상 자기 신체사고 및 선택한 경우 무보험차상해)가 포함되어 있습니다.
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제2조 계약기간</div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9312;</div>
                                  임대차계약의 계약기간은 임대차계약체결일로부터 [대여 기간]의 만료일까지로 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  대여기간의 연장은 임대차계약 제2조 [보증조건]이 유효 한 경우(예: 보증금 지급 시 제3조 제1항 제6호에 따라
                                  보 증금에서 공제할 금액이 없는 경우, 보증보험증권 제출 시 대여기간의 연장에 상응하여 보증기간을 정한
                                  보증보험증 권을 추가 제출하는 경우 등)에 한하여 가능합니다
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9314;</div>위 제2항의 요건을 충족하는 경우로서 ”고객”이 대여기간 을 연장하고자 할 때 “고객”은
                                  대여기간 만료 30일전까지 “회사”에 대하여 서면 통보 및 연장 의사를 표명하고, “회 사”가 이에 동의하는 경우
                                  “회사”와 연장 사용에 관한 새 로운 임대차 계약(이하 “연장 계약”)을 체결하여야 합니다
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제3조 계약 조건</div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9312;</div>
                                  <div>
                                    <div>보증 또는 담보</div>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      “고객”은 계약체결 시 “회사”가 필요하다고 판단할 경 우 임대차계약에 따라 부담하는 각종 의무사항의 이행
                                      을 담보하기 위하여 임대차계약 제2조 [보증조건]에 따라 “회사”에게 보증 또는 담보를 제공하여야 합니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      보증 또는 담보의 종류는 선납금, 보증금, 보증보험증 권 등에서 “고객”과 “회사”가 합의하여 결정하며, 두
                                      종류 이상의 보증 또는 담보를 제공하는 것으로 결정할 수 있습니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      보증금 및/또는 선납금, 보증보험증권은 “고객”이 “회 사”에게 임대차계약의 체결 후 3일 이내에 지급하여야
                                      합니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(4)</div>
                                      (보증금 및 보험보증증권) “고객”이 “회사”에게 보증 금 및/또는 보험보험증권을 납부한 경우, “회사”는 제2
                                      조의 계약기간이 만료되거나 임대차계약이 해제 또는 해지되어 임대차계약이 종료되고, “고객”이 임대차계
                                      약에 따라 부담하는 일체의 채무를 이행한 때 보증금 및 /또는 보증보험증권을 “고객”에게 반환하기로
                                      합니다. 이 경우 “회사”는 “고객”에 대하여 보증금에 대한 이자 를 지급하지 아니하며, 보증보험증권에
                                      대해서도 아무 런 금원을 지급하지 아니합니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(5)</div>
                                      (선납금) ”고객”이 계약체결 시 납부한 선납금은 계약 기간 중 임대차계약 제2조 [총 대여료]에서 분할 차감
                                      되며, “고객”은 실제 월 납부액만 납부하시면 됩니다. “회사”는 제2조의 계약기간이 만료되어 임대차계약이
                                      종료되는 경우에는 “고객”에게 선납금을 반환하지 아 니합니다. 다만, 계약기간 중도에 임대차계약이 해제 또
                                      는 해지되어 종료되는 경우에는 선납금 중 아래 정산절 차를 거치고 난 후의 금액(반환선납금)을 “고객”에게
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div className={cx('pl-content-1')}>
                                    <div style={{ paddingLeft: 36 }}>
                                      <div></div>
                                      <div>
                                        반환합니다. 이 경우 “회사”는 “고객”에 대하여 반환 선 납금에 대한 이자를 지급하지 아니합니다.
                                      </div>
                                      <div className={cx('underline')}>반환선납금 = 선납금 x (정산일수/총 대여일수)</div>
                                      <div className={cx('underline')}>정산일수 = 총 대여일수 - 차량인도일로부터 경과일수</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(6)</div>
                                      계약기간의 만료, 해제, 해지 등으로 임대차계약 종료 시, 본 항 제4호 내지 제5호에도 불구하고 “회사” 는
                                      “고객”이 이행하지 않은 채무, 위약금 등 “고객” 이 임 대차계약에 따라 부담하는 일체의 채무를 보증금
                                      및/또 는 선납금에서 공제한 후 반환할 수 있습니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(7)</div>본 항 제6호는 “고객”이 보증보험증권을 제출한 경우 에도 준용되며, 계약기간의 만료, 해제,
                                      해지 등으로 임 대차계약 종료 시 “회사”는 “고객”이 이행하지 않은 채 무, 위약금 등 “고객”이 임대차계약에
                                      따라 부담하는 일 체의 채무에 관하여 보증보험증권을 행사하여 보증보 험회사로부터 보험금을 지급받을 수
                                      있습니다. 다만, 보증보험증권으로 채무의 변제가 완료되지 않을 시 추 가로 “고객”에게 채무의 변제를
                                      요구할 수 있습니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(8)</div>본 항 제6호에 따른 공제 및/또는 본 항 제7호에 따른 보험금 지급으로 인하여 “고객”의
                                      계약에 따른 책임이 나 손해배상 등 의무가 전부 면제되는 것은 아니며, 공 제 및/또는 보험금 지급 후에도
                                      “고객”의 채무가 남아 있는 경우 “회사”는 잔존 채무의 이행(변제)을 “고객” 에게 청구할 수 있습니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(9)</div>
                                      “고객”은 본 조에 의한 보증 또는 담보의 제공을 이유로 “회사”에 대하여 임대차계약에 따라 이행하여야 할
                                      채 무의 이행을 거절할 수 없습니다.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  <div>
                                    <div>위약금</div>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      “고객”의 사정 또는 귀책사유에 의해 계약이 중도 해지 된 경우 또는 계약서 약정이후 차량 출고 전 계약
                                      해지 된 경우 “고객”은 “회사”에게 월대여료(VAT제외)를 기준으로 계약해지일 현재 잔여 대여기간 일수에
                                      대하 여 임대차계약 제2조 [위약금률]을 적용한 다음의 산식 에 의한 위약금을 납부하여야 합니다.
                                    </div>
                                    <div>* 위약금 = [월대여료(VAT제외) x 12 / 365] x 잔여대 여기간일수 x [위약금률]</div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      “고객”이 임대차계약과 동일한 조건으로 “회사”가 동 의하는 신규고객을 확보하고 그 신규고객이 임대차계
                                      약을 승계(“고객”, 신규고객 및 “회사”가 승계계약을 체결)한 경우 위약금을 납부 하지 아니할 수 있습니다.
                                      단, 고객 및 상품유형에 따라 동일 계약조건으로 승계 가 불가능할 수 있으며, 승계 시 당사에서 정한 일정
                                      수 수료가 발생 및 청구됩니다.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9314;</div>
                                  <div>
                                    <div>
                                      “고객”은 다음 각호에 해당하는 사유가 발생하였을 때 즉 시 이를 “회사”에게 통지하여야 하며 통지하지
                                      않거나 잘 못된 통지에 따른 손해발생, 기타 불이익은 통지의무자가 부담하여야 합니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      “고객”(법인고객의 경우 청구담당자를 포함)의 주소 (전자우편주소 포함), 전화번호, 상호, 사업자등록번호
                                      등이 변경된 경우
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      대여차량에 대한 분실, 손상, 도난, 기타 제3자에 의한 소유권 침해사유가 발생하였거나 발생할 우려가 있을
                                      경우
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      대여차량의 운행, 보관 또는 기타 취급에 따른 사고로 인하여 제3자에게 손해가 발생한 경우
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(4)</div>
                                      대여차량의 차고지 주소, 고객 이외의 실제 대여차량 운전자의 성명, 주소, 연락처 등이 변경된 경우
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div>제4조 대여료 정산 및 지급</div>
                            <div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                <div>
                                  <div>
                                    대여료는 월간 단위로 정산하며, 임대차계약서 앞면 [3.월 대여료 지급]의 [대여료 결제일] 및 [납입방법]에
                                    따르기로 합니다. 다만 “고객”과 “회사”의 사전 별도 서면 협의가 있
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>6/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div className={cx('flex-start')}>
                                <div style={{ paddingRight: '36px' }}></div>는 경우 그 합의 대로 이행하기로 합니다.
                              </div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  “고객”이 요청하는 경우 “회사”는 청구내역과 세금계산서 를 결제일 이전에 “고객”에게 발송하고, “고객”은
                                  결제일 까지 대여료를 납부하여야 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9314;</div>
                                  “회사”는 “고객”이 결제일까지 대여료 등의 납부를 지연할 때에는 임대차계약서 제2조 [연체이율] 에 의한
                                  연체이자 를 “고객”에게 청구할 수 있습니다. 이에 “고객”은 대여료 결제일 다음날로부터 실제 납부일까지를
                                  연체일수로 계산 하여 [연체이율]을 적용한 연체이자를 납부하여야 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9315;</div>
                                  계약기간의 만료 또는 중도 해지 등으로 인하여 1개월 미 만의 대여료 해당기간(사용일수)이 발생할 경우에는 월
                                  대 여료를 1일 단위로 환산한 일 평균요금(월대여료 x12/365)을 사용일수에 적용하여 정산합니다.
                                  일평균요금(VAT포함) = 월대여료(VAT포함) x 12 / 365 정산대여료(VAT포함) = 일평균요금(VAT포함) x 사용일 수
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9316;</div>
                                  계약기간 중 대여료의 변동이 불가피할 시 “고객”과 “회 사”는 사전 서면 합의로 대여료를 재조정할 수 있습니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9317;</div>
                                  계약기간(“고객”이 계약기간 만료, 해제, 해지 등으로 인한 계약 종료 후 차량 반납을 지연할 경우에는 그
                                  지연기간도 포함)중 발생한 교통법규위반 범칙금, 과태료, 주차료, 통 행료 등은 “고객”의 부담으로 하며
                                  “회사”는 이 내용을 고 지할 수 있습니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9318;</div>
                                  계약기간 만료, 해제, 해지 등으로 인한 계약종료 시 “고 객”이 “회사”에게 차량을 반환하지 않은 경우, “고객”은
                                  제3조 제②항의 위약금과 별개로 계약 종료일 다음날부터 반납일까지 월 대여료를 1일 단위로 환산한
                                  일평균요금(월 대여료x12/365)을 당해 사용기간에 적용하여 계산한 금 액을 지급하여야 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9319;</div>
                                  계약기간의 만료 3개월 전부터 “고객”은 차량의 인수에 대 해 “회사”에 요청 할 수 있으며 차량의 인수시 약정된
                                  차량 의 잔존금액을 차량 인수가로 결정하며 잔존금액에 취등록 세등 공과금은 포함되어 있지 않습니다.
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제5조 운전자 자격 요건</div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9312;</div>
                                  대여차량의 운전자는 임대차계약 [운전자제한연령]의 연 령이상으로서 도로교통법상 운행 가능한 차종별로 유효한
                                  운전면허증 (외국인은 국제운전면허증)을 소지하여야 하 며, 운전자 자격조건 미달자의 운전 중 사고에 대한 민
                                  형 사상 책임은 “고객”이 부담하여야 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  <div>
                                    <div>
                                      대여차량의 운전자는 “고객”에 한정하는 것을 원칙으로 하 되, 아래의 자격을 갖춘 자에 한하여 “고객”
                                      이외의 자가 운전할 수 있습니다.
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      개인고객 : 계약자 본인 (운전자 범위 확대 시 추가금 발생)
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      개인사업자: 계약자 본인 (운전자 범위 확대 시 추가금 발생)
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      법인고객: 법인의 임직원
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(4)</div>
                                      대리운전의 경우 자동차종합보험(대인배상, 대물배상, 자기신체사고, 자기차량손해)에 가입된 자, 단 본조 제
                                      &#9313;항 제1~3호의 운전자격을 갖춘 자가 동승한 경우로 한정
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(5)</div>
                                      본조의 운전자 조건을 충족하지 않는 자가 운전하여 발생한 모든 손해에 대한 배상책임은 “고객”에게 있다.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제5조 운전자 자격 요건</div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9312;</div>
                                  “회사”는 최초 배차 시에 양호한 상태의 차량을 대여하며, “고객”은 계약종료 시에 정상적인 마모를 제외한 최초
                                  인 도 받은 상태(판금, 도장을 필요로 하지 않는 양호한 상태) 로 차량을 반환하여야 합니다.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  “고객”은 차량을 인도받는 즉시 차량의 종류, 규격, 기능, 성능 및 기타사항에 대하여 완전성을 확인한 후
                                  차량인수 증에 서명날인하여 “회사”에 교부한 때로부터 차량을 운 행, 사용할 수 있습니다.
                                </div>
                              </div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9314;</div>
                                  “고객”이 대여차량의 종류, 규격, 기능, 성능 및 기타사항 에 대하여 부적합한 점이나 하자를 발견한 경우 지체
                                  없이 그 내용을 차량인수증에 기재 한 후 “회사”에 교부하여야 합니다.
                                  <br />
                                  “고객”이 그러한 부적합 또는 하자를 차량인수증에 기재하 지 않은 때에는 차량이 완전한 상태에서 인도된 것으로
                                  추 정합니다.
                                </div>
                              </div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9315;</div>
                                  “고객”은 계약기간 중 정상적인 운행이 불가능한 차량 자 체의 하자 등의 사유가 발생 시, 공정거래위원회의
                                  소비자 분쟁 해결 기준을 준용하여 해결합니다.
                                </div>
                              </div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9316;</div>
                                  계약종료로 인하여 대여차량을 반납할 경우 정상적인 마모 를 제외한 차량의 훼손부위에 대하여 “고객”은
                                  “회사”의 협력정비업체에서 지체 없이 이를 최초 대여 시점의 상태 로 수리하여 반환하여야 합니다. 다만,
                                  “고객”이 자차손해 면책제도에 가입한 경우 사고건당 임대차계약서 제2조 [고객부담금]을 “회사”에게
                                  지급함으로써 “고객”의 정상 반납 의무를 대신할 수 있습니다.
                                </div>
                              </div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9317;</div>
                                  “고객”이 “회사”의 사전 서면 승인을 받고 차량의 구조를 변경, 개조, 부착물 설치, 기타 그 원상을 변경한 경우
                                  “고 객”은 계약종료 시 차량을 원상태로 회복하여 반환하여야 하고, 만약 “고객”이 차량을 원상태로 회복하여
                                  반환하지 않은 경우 “고객”은 “회사”가 해당 차량을 원상태로 회복 하기 위해 소요한 일체의 비용을 “회사”에게
                                  지급하여야 합니다.
                                </div>
                              </div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9318;</div>
                                  “고객”이 “회사”의 사전 서면 승인을 받지 않고 차량의 구 조를 변경, 개조, 부착물 설치, 기타 그 원상을 변경한
                                  경우 “회사”는 제8조 제&#9313;항에 따라 임대차계약을 해지할 수 있 으며, “고객”은 계약종료 시 차량을
                                  원상태로 회복하여 반 환하여야 합니다.만약 “고객”이 차량을 원상태로 회복하여 반환하지 않은 경우 “고객”은 “
                                  회사”가 해당 차량을 원상 태로 회복하기 위해 소요한 일체의 비용을 “회사”에게 지 급하여야 합니다.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div>제7조 차량 보험 및 보상</div>
                            <div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                <div>
                                  <div>
                                    “회사”는 대여차량의 소유주로서 “고객”의 과실로 인한 사 고에 대해, 이를 보호하기 위하여 영업용자동차보험
                                    대인 배상Ⅰ, 대인배상Ⅱ, 대물배상 및 자기신체사고담보에 가입 한 차량을 대여하기로 합니다.
                                  </div>
                                </div>
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                <div>
                                  <div>보험보상한도</div>
                                  <div className={cx('flex-start')}>
                                    <div>(1)</div>
                                    <div>
                                      <div>
                                        “고객”은 사고 발생시 임대차계약 제2조 [보 험조건]에 따라 “회사”가 가입한 영업용자동 차보험 약관에
                                        명시된 해석과 보장 범위 내에 서 손해를 보상받을 수 있습니다. 다만, “고객” 또는 임대차계약서에서 정한
                                        운전자(이하 “운전자”)의 다음 각 목의 어느 하나에 해당 하는 사유로 발생한 손해와 법규의 위반으로 인한
                                        손해 및 영업용자동차보험약관에서 정 한 ‘보상하지 않는 사항’(면책사항)에 해당하 여 일부 또는 전부를
                                        보상받지 못하는 손해는 “고객”의 부담 및 책임으로 합니다.
                                      </div>
                                      <div className={cx('pl-content-1')}>
                                        <div className={cx('flex-start')}>
                                          <div>가.</div>
                                          <div>고의로 인한 손해</div>
                                        </div>
                                        <div className={cx('flex-start')}>
                                          <div>나.</div>
                                          <div>무면허운전 사고로 인한 손해</div>
                                        </div>
                                        <div className={cx('flex-start')}>
                                          <div>다.</div>
                                          <div>
                                            영리를 목적으로 대여차량을 전대하거나 요 금 또는 대가를 받고 대여차량을 사용하다가 생긴 사고로
                                            인한 손해
                                          </div>
                                        </div>
                                        <div className={cx('flex-start')}>
                                          <div>라.</div>
                                          <div>범죄를 목적으로 대여차량을 사용하다가 발</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>7/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div>
                                <div className={cx('pl-content-2')}>
                                  <div className={cx('flex-start')}>
                                    <div>라.</div>
                                    <div>범죄를 목적으로 대여차량을 사용하다가 발 생한 손해</div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>마.</div>
                                    <div>음주운전/도주(사고 후 조치 미이행) 사고로 인한 손해</div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>바.</div>
                                    <div>마약, 각성제, 신나 등 약물에 취한 상태에서 운전하다가 생긴 사고로 인한 손해</div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>사.</div>
                                    <div>정상적인 도로 이외(해수욕장, 갯벌, 계곡, 차 량출입제한구역 등)의 지역을 운행하는 행위</div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>아.</div>
                                    <div>
                                      본 계약서상의 운전자 이외의 자(제5조 운전 자 자격요건을 갖추지 못한 자를 포함)가 대여 차량을
                                      운전하다가 생긴 사고로 인한 손해
                                    </div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>자.</div>
                                    <div>
                                      계약기간 만료, 해제, 해지 등으로 인한 계약 종료 후에도 대여차량을 반환하지 않고 운행 하는 중 생긴
                                      사고로 인한 손해
                                    </div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>차.</div>
                                    <div>대여차량 도난 이후 발생한 사고로 인한 손해</div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  “고객”은 본 항 제1호의 규정에도 불구하고 음주, 무면 허운전, 도주(사고 후 조치 미이행) 사고로 인하여 보험
                                  보상 등 혜택을 받게 되는 경우, 영업용자동차 보험약관 에서 정한 자기부담금을 부담하여야 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9314;</div>
                                  “고객”은 임대차계약 체결 시 대여차량의 보험가입조 건(임대차계약 제2조 [보험조건])을 선택하며, 보험가
                                  입조건의 보상한도를 초과한 부분에 대하여는 “고객” 의 책임으로 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9315;</div>
                                  “고객”이 대리운전자로 하여금 대여차량을 운전하게 한 경우, 대리운전자가 가입한 보험의 보상한도를 초과 한
                                  부분 및 보험에 가입하지 않은 대리운전자가 운행하 다가 발생한 사고로 인한 손해에 대해서는 “고객”이 부
                                  담합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9316;</div>
                                  “고객”이 보험조건을 변경하고자 할 때는 최소 7일전 상호 협의하여 변경할 수 있으며, 추가 비용이 발생할 경우
                                  상호 협의 하에 월대여료에 반영합니다. 단, 보험 조건 변경은 보험회사 처리완료일 다음날 00시부터 적 용되고,
                                  “회사”는 보험회사 처리완료일을 “고객”에게 통지합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9317;</div>
                                  <div>
                                    <div>자차손해면책제도</div>
                                    <div className={cx('pl-content-1')}>
                                      <div className={cx('flex-start')}>
                                        <div>가.</div>
                                        <div>
                                          제5조의 자격요건을 갖춘 운전자의 과실에 의한 모든 차량손해에 대해서는 “회사”의 부 담으로 하되,
                                          “고객”은 사고 건당 임대차계약 제2조 [고객부담금](이하 “[고객부담금]”)을 부담하고, 수리비가
                                          [고객부담금] 미만인 경 우에는 “고객”이 실수리비를 부담하기로 합 니다. 단, “회사”가 제10조 제④항에
                                          따라 임 대차계약을 해지하는 경우 “고객”은 차량 수 리 여부를 불문하고 “회사”에게 [고객부담] 을
                                          지급합니다.
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>나.</div>
                                        <div>
                                          자차손해면책제도는 임대차계약에 따른 대 여차량이 “고객”에게 인도된 이후부터 적용 되는 것으로
                                          봅니다.
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>다.</div>
                                        <div>
                                          <div>
                                            상기 가목에도 불구하고 다음과 같은 경우에 는 자차손해면책제도 가입여부와 무관하게 “고객”의
                                            책임으로 합니다(자차손해면책제 도 적용 불가).
                                          </div>
                                          <div className={cx('pl-content-1')}>
                                            <div className={cx('flex-start')}>
                                              <div>A.</div>
                                              <div>본 조 제2항 제1호 단서에 해당하는 경우</div>
                                            </div>
                                            <div className={cx('flex-start')}>
                                              <div>B.</div>
                                              <div>“고객” 또는 운전자가 허락하여 탑승 한 탑승객의 고의가 있는 경우</div>
                                            </div>
                                            <div className={cx('flex-start')}>
                                              <div>C.</div>
                                              <div>
                                                “고객” 또는 운전자의 명백한 관리소 홀 또는 부주의로 인한 도난, 분실, 파 손, 충돌, 추락, 전복
                                                또는 침수 등의 경우
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div></div>
                                        <div></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div>
                              <div className={cx('pl-content-2')}>
                                <div className={cx('pl-content-1')}>
                                  <div className={cx('flex-start')}>
                                    <div>D.</div>
                                    <div>
                                      대여차량의 일부 부분품, 부속품, 부 속기계장치만의 자연마모가 아닌 파 손, 훼손 또는 도난의 경우
                                    </div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>E.</div>
                                    <div>허위계약 또는 계약위반의 경우</div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>F.</div>
                                    <div>제8조 제&#9312;항을 위반한 경우</div>
                                  </div>
                                </div>
                              </div>
                              <div className={cx('pl-content-2')}>
                                <div className={cx('flex-start')}>
                                  <div>라.</div>
                                  <div>
                                    “고객”은 차량손해에 대한 [고객부담금] 또는 실수리비를 지체 없이 “회사”에게 지급하여 야 합니다. “고객”이
                                    [고객부담금] 또는 실수 리비의 원인을 제공한 책임 있는 대여차량의 운전자 등으로부터 그 상당액을 수취하는
                                    것 은 “고객”의 책임과 권한으로 합니다. 다만, 해당 운전자 등이 “회사”에 [고객부담금] 또 는 실수리비를
                                    직접 납부한 때에는 “고객” 에 동 금액을 별도로 청구하지 아니합니다.
                                  </div>
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>마.</div>
                                  <div>
                                    “회사”는 “고객”에게 사고 수리된 차량이 인 도되기 전 [고객부담금]을 청구할 수 있으며, 최소한 사고 수리된
                                    차량의 출고와 동시에 [고 객부담금]이 지급되어야 차량을 인도할 수 있 습니다. 단, 실제 수리비가
                                    [고객부담금] 미만 인 경우에는 “회사”는 기 지급된 [고객부담금]
                                    <br />과 실제수리비 사이의 차액분에 대해 “고객” 에게 지급합니다.
                                  </div>
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>바.</div>
                                  <div>
                                    “고객”은 임차한 차량을 수리하지 않고 미수 선수리비의 명목 등으로 차량수리비를 보험사 나 가해 운전자
                                    등에게 청구할 수 없으며, 수 리비청구 등과 관련된 모든 권리는 “회사”가 갖는다.
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div className={cx('flex-start')}>
                                <div>&#9314;</div>
                                <div>
                                  <div>대차차량의 제공</div>
                                  <div style={{ paddingLeft: 20 }}>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      <div>
                                        “회사”와 “고객”은 “고객” 과실로 인한 대여차량 손해 발생시 차량의 수리기간 동안 고객에게 대차 차량을
                                        제 공할 수 있도록 약정할 수 있습니다 (단, 수리에 필요로 되는 시간이 8시간 이하일 경우에는 해당 없음)
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      <div>
                                        피해사고로 인한 대여차량 손해 발생시에는 대차서비 스를 제공하지 않습니다. 단, “고객”의 요청 시
                                        “회사” 는 대여차량의 수리기간 동안 대차차량을 “고객”에게 보험대차 하기로 하고, 상대방 차량의
                                        보험회사에 대차 료를 청구하기로 합니다. 이때 “고객”은 대차료 청구와 관련된 필요서류 작성 및 제출을
                                        위하여 “회사”에 협조 하기로 합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      <div>
                                        대차서비스 제공 시 대여차량과 동종의 차량을 제공하 는 것을 원칙으로 하되, 동종의 차량을 제공할 수
                                        없는 경우 배기량이 동급인(EV 차량의 경우 보조금 제외 차 량가격, 치수 및 승차정원 등을 기준으로
                                        “회사”가 지 정한) 일반차량을 제공하기로 하며, 대차 제공차량의 차량상태(연식 등), 옵션(썬루프,
                                        내비게이션 등) 유종 (휘발유, 경유, LPG) 등은 변경될 수 있습니다. 동급의 차량도 제공할 수 없는 경우
                                        회사는 고객과 협의하여 대차차량을 제공하기로 합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(4)</div>
                                      <div>
                                        “회사”는 고객의 제7조 제2항 제1호 단서 각 목의 행 위로 인해 발생된 사고 및 정비 건에 대해서는 대차차
                                        량을 제공하지 않습니다.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className={cx('flex-start')}>
                                <div>&#9315;</div>
                                <div>
                                  임대차계약이 종료 또는 해지되었음에도 “고객”이 “회사” 에 차량을 반환하지 않고 운행하는 중 생긴 사고는
                                  “고객” 의 자차손해면책제도 가입 또는 “회사”의 영업용자동차보 험 가입에도 불구하고 “고객”이 손해배상책임을
                                  져야 하며 (자차손해면책제도 적용불가, 자동차보험 보상불가), 그 사고로 인하여 “회사”에 손해가 발생하는 경우
                                  “고객”은 “회사”에게 그 손해를 배상하여야 합니다.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>8/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div className={cx('flex-start')}>
                                <div>&#9316;</div>
                                “회사”가 차량의 정비 및 사고 수리의 목적으로 차량을 수 리처로 이동하는데 소비되는 유류는 “고객”이 부담하며
                                “회사”는 별도 보상하지 않습니다.
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제8조 금지 행위</div>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9312;</div>
                                  <div>
                                    <div>“고객”은 대여차량으로 다음 각호의 행위를 하여서는 안됩 니다.</div>
                                    <div className={cx('pl-content-1')}>
                                      <div className={cx('flex-start')}>
                                        <div>(1)</div>
                                        <div>
                                          운전자 이외의 자 또는 제5조 운전자의 자격요건에 해 당되지 않는 자에게 차량을 운전토록 하는 행위
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(2)</div>
                                        <div>
                                          테스트, 운전연습, 경기대회 참가, 타차의 견인 또는 견 인에 준하는 행위를 위해서 사용하는 행위
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(3)</div>
                                        <div>유상운송 또는 재대여 용도로 사용하는 행위</div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(4)</div>
                                        <div>
                                          “회사”의 사전 서면 승인 없이 차량의 구조를 변경, 개 조, 부착물 설치, 기타 그 원상을 변경하는 행위
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(5)</div>
                                        <div>차량의 주행거리를 조작하는 행위</div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(6)</div>
                                        <div>
                                          정상적인 도로 이외의 지역을 운행하거나 주·정차하는 행위, 기타 객관적으로 차량을 손상시킬 우려가
                                          있는 행위(정상적인 도로 이외 : 차량출입제한 표시구역, 토 사, 수분등 기타 이물질로 차량이 손상될 수
                                          있는 장소)
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(7)</div>
                                        <div>
                                          법규로 금지된 행위 (음주운전, 음주측정거부, 무면허 운전, 도주 (사고 후 미조치 포함), 뺑소니 등)
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(8)</div>
                                        <div>
                                          자동차관리법에 따른 점검·정비·검사 또는 원상복구 명령, 운행정지명령 등 행정명령, 행정조치,
                                          행정지도 등을 위반하는 행위
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(9)</div>
                                        <div>
                                          정상적 운행목적 외 다른 용도(화물수송, 위험물수송 등) 사업을 위해 좌석 등을 임의로 구조 변경
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(10)</div>
                                        <div>마약류 관리에 관한 법률상의 마약류, 각성제, 신나 등의 약물을 음용하고 운전하는 행위</div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(11)</div>
                                        <div>자동차손해배상보장법에서 보장하지 아니하는 행</div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(12)</div>
                                        <div>영업용 자동차 보험 보상규정에 준하여 “회사”가 보 상받지 못하는 금지행위</div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(13)</div>
                                        <div>
                                          대여차량 및/또는 대차제공 차량에 장착된 부분품(내 비게이션, 블랙박스 등)을 임의로 훼손 멸실하거나
                                          매 각, 임의전대, 담보제공 등 처분하는 행위
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(14)</div>
                                        <div>
                                          대여차량 및/또는 대차제공 차량에 장착된 블랙박스 에 기록된 영상을 해당 차량의 사고처리 목적 이외의
                                          용도로 저장, 배포, 편집, 제공, 판매하는 등 개인정보 보호법 등 관련 법령을 위반하는 일체의 행위
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(15)</div>
                                        <div>매각, 임의전대, 담보제공 등 대여차량에 대한 “회사” 의 소유권을 침해하는 일체의 행위</div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(16)</div>
                                        <div>
                                          기타 차량의 소유권 또는 이와 관련된 권리의 주장, 기타 “회사”의 정당한 권리를 침해할 수 있는 일체의
                                          행위
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  제&#9312;항의 금지행위를 위반할 시 “회사”는 계약해지 및 차 량의 반환을 청구하거나 직접 차량을 회수할 수
                                  있으며, 이 러한 계약해지는 “고객”의 위약금 지급, 손해배상, 기타 임 대차계약에 의한 의무에 아무런 영향을
                                  미치지 아니합니 다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9314;</div>
                                  “고객”이 본 조의 금지행위 기타 법령에 위반하는 행위를 한 경우(차량의 무단 담보제공, 무단 처분, 무단 해체,
                                  자동 차 등록번호판 교체, 차대번호 훼손 등) 형사처벌을 받을 수 있으며(차량을 횡령하는 경우 5년 이하의 징역
                                  또는 1,500만원 이하의 벌금에 처해지며, 이득액에 따라 특정 경제범죄 가중처벌 등에 관한 법률에 의해
                                  가중처벌됩니 다), 그 행위로 인하여 “회사”에게 손해(변호사 등 자문비 용, 차량 회수 및 “고 객” 또는 운전자의
                                  소재확인 등에 소 요된 비용 일체 포함)가 발생한 경우 손해 전부를 배상하여 야 합니다.
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제9조 차량 관리</div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                대여차량에 대한 법정검사 진행시 가입된 정비상품을 불문 하고 제7조 제3항의 대차차량은 제공되지 않습니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                <div>
                                  <div>“고객”은 대여차량으로 다음 각호의 행위를 하여서는 안됩 니다.</div>
                                  <div className={cx('pl-content-1')}>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      <div>차량의 법정검사에 관한 점검 및 정비료 일체는 ‘회사’ 가 부담합니다.</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      <div>
                                        “회사”는 “고객”이 방문정비 서비스를 요청한 경우 선 택한 서비스에 의거하여 방문정비를 실시하도록 하며
                                        이에 따른 이용 수수료는 “고객”이 건별로 부담하고, 차회 대여료 납부시 포함납부하여야 합니다. 다만, 부
                                        득이한 사정으로 방문일정을 준수하지 못하거나 방문 정비 실시가 어려울 것으로 예상되는 경우 “고객”과
                                        “회사”가 상호협의 하여 정비시기를 조정합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      <div>
                                        대여차량의 인도일로부터 대여차량에 관한 일상점검 은 “고객”이 책임지며 “고객”은 운전자에게 최소한의
                                        일상점검에 필요한 사항 (냉각수, 엔진오일의 점검 등) 을 주지시켜 이행하도록 합니다. 여기서 일상점검은
                                        취 급설명서를 참조로 엔진오일, 누유, 누수, 브레이크액, 파워스티어링오일, 냉각수, 타이어공기압,
                                        워셔액 등 의 점검을 말합니다. 특히, 엔진오일 교환시기가 도래 한 경우 고객은 즉시 최대한 가까운
                                        회사의 협력정비업 체에 입고하여 엔진오일을 교체 또는 회사에 협조할 의 무가 있습니다. 디젤연료 요소수
                                        분사 차량을 임차한 “고객”은 요소수를 상시 보충하여 레벨을 30%이상 유지하여야 하고, 계기판의 요소수
                                        관리 메세지 및 경 고를 충실히 이행하여 요소수가 고갈되지 않도록 자가 관리하여야 합니다. 만약
                                        엔진오일 관리 미흡(엔진오 일 미교체, 교체거부, 비협조, 불량 엔진오일 사용 등), 요소수 관리
                                        미흡(요소수 고갈, 계기판 경고 내용 불이 행, 불량 요소수 사용 등) 등 "고객"이 일상점검의무를 위반,
                                        이행지체 또는 달리 불이행하여 차량 고장이나 기 타 문제가 발생하는 경우 이에 소요되는 모든 비용은 “
                                        고객"이 부담하여야 합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(4)</div>
                                      <div>
                                        “고객”은 “회사”의 법정검사, 정기점검 및 계속 검사 를 위해 차량을 취급할 수 있는 충분한 시간을 할애하
                                        여야 합니다. “고객”의 정비 내지 관리 불량, 불법개조 등 “고객”의 사정 또는 귀책으로 검사 부적합
                                        판정을 받을 경우 “고객”은 즉시 정비하여 재검사를 받을 수 있도록 협조하여야 하고, 고객의 비용과
                                        책임으로 법정 검사 등에 합격할 수 있는 조치를 하여야 합니다. 고 객의 사정 또는 귀책사유로 인하여
                                        정기점검을 실시하 지 못한 경우 회사는 이에 대한 책임을 부담하지 아니 합니다. 고객이 변경된 연락처를
                                        회사에 통지하지 아니 하거나 고객의 사유로 대여차량에 대한 검사를 실시할 수 없게 되는 경우에 발생되는
                                        범칙금 등 일체의 비용 은 고객이 부담합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(5)</div>
                                      <div>
                                        “고객”은 임대차계약에 의한 차량을 인도받은 시점부 터 “회사”에 반환하는 시점까지 선량한 관리자의 주의
                                        의무를 다하여 당해 차량을 사용하고 보관 및 보전하여 야 하며 계약 기간 중 차량관리 소홀 또는 고객의
                                        과실 로 정비가 필요한 것을 알게 된 경우 해당 비용은 ‘고 객’
                                        <br />이 부담하게 됩니다 (제7조 제2항 6호 참조). 또한 기 능 고장 등 주요 정비 사항은 차량 반납 이후
                                        최장 30 일까지 검수 기간이 소요될 수 있습니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(6)</div>
                                      <div>‘고객’은 교환주기가 도래한 소모품에 대하여 “회사”에 교환·교체를 요청할 수 있습니다.</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(7)</div>
                                      <div>
                                        차량 정비 시 “회사”가 제휴한 협력정비업체로의 정비 입고 및 “회사”가 정한 규격부품 사용 수리를
                                        원칙으로 합니다. 단, 차량 정비가 필요하지 않거나 기능상 문제 가 없어 부품 수리나 교체가 필요하지
                                        않음에도 “고객”
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>9/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <div className={cx('form_content_1')}>
                        <div className={cx('form_content_1')}>
                          <div className={cx('pb-2')}>
                            <div>
                              <div className={cx('flex-start')}>
                                <div>
                                  <div className={cx('pl-content-1')}>
                                    <div className={cx('flex-start')}>
                                      <div className={cx('pl-content-1')}>이 이를 요구하는 경우 그 비용은 고객이 부담하여야 합니다.</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(8)</div>
                                      <div>
                                        정비 서비스 상품의 종류를 불문하고, 자연적인 마모 이외 이물질(토사, 수분 등)에 의한 차량고장이나
                                        세차, 청소 필요시 이에 소요되는 비용은 고객이 부담하여야 합니다. 또한 차량 파손 및 노후로 인한 변색,
                                        변질, 마 모는 수리 불가합니다
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(9)</div>
                                      <div>
                                        “회사”의 정비서비스 업무 중 차량 사고 발생시 “회사” 는 차량 사고로 인한 부분을 무상으로 수리하고,
                                        수리 기간 동안 “고객”에게 동종 혹은 동급(배기량) 차량을 무상으로 대차를 제공하며, 대차 제공 차량의
                                        옵션 및 편의 장치는 원래 대여차량과 다를 수 있습니다
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(10)</div>
                                      <div>
                                        (타이어 정상 마모로 인한 교체 관련) 자동차 출고시 장착된 타이어가 마모한계선에 도래하여 교체가 필요
                                        한 시점부터 교체됩니다. 단, 타이어의 제작사와 상세 패턴은 회사에서 호환되는 타이어로 선택 장착하며,
                                        고객은 타이어 제작사, 패턴, 등급등을 임의로 선택 및 교체 요청 할 수 없습니다
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(11)</div>
                                      <div>
                                        <div>
                                          긴급출동 서비스가 제공되는 경우 제공사의 기준 시간 초과 및 구난 난이도에 따라 발생하는 추가
                                          비용(추가 장비, 시간초과, 작업난이도, 등)은 “고객”이 부담합니 다. 사고로 인한 구난 시에는
                                          원칙적으로 자차손해면 책제도에 따라 처리 가능하나, 서비스 시간 외에는 “고객”이 추가 비용을
                                          부담하여야 합니다. 견인 서비 스는 10Km 이내 기본비용은 “회사”가 부담하며, 추 가 거리에(km 당) 대한
                                          비용은 “고객”이 부담합니다.
                                        </div>
                                        <div>
                                          <div className={cx('flex-start')}>
                                            <div className={cx('no_wrap')}>- 예시 : 1)</div>
                                            <div>
                                              구난 서비스 시간내 추가비용 없이 구난시 고객부담금 없음
                                              <br />
                                              (“회사”가 기본 구난비용 부담)
                                            </div>
                                          </div>
                                          <div className={cx('flex-start')}>
                                            <div className={cx('no_wrap')}>- 예시 : 2)</div>
                                            <div>구난 서비스 시간 내 처리 불가하여 추가 비용 발생시 (추가 구난비용은“고객”부담)</div>
                                          </div>
                                          <div className={cx('flex-start')}>
                                            <div className={cx('no_wrap')}>- 예시 : 3)</div>
                                            <div>
                                              구난 서비스 시간과 무관하게 난이도에 따 라 추가장비 및 추가비용 발생시 (추가
                                              구난비용은“고객”부담)
                                            </div>
                                          </div>
                                          <div className={cx('flex-start')}>
                                            <div className={cx('no_wrap')}>- 예시 : 4)</div>
                                            <div>
                                              견인 서비스 10km 초과하여 총 견인 서 비스 15km 이용 한 경우 (10km 기본비 용“회사”부담 / 5km
                                              추가비용“고객”부담)
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(12)</div>
                                      <div>
                                        “고객”의 과실로 차량 열쇠(리모컨 포함) 분실시 신 규 제작 비용과 긴급출동 추가비용은 “고객”이 부담
                                        합니다.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9314;</div>
                                <div>
                                  <div>응급처치</div>
                                  <div>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      <div>
                                        “고객”은 차량사용 중 응급조치 및 이에 따른 자체수리 가 불가피한 특별한 사정이 있는 경우 “회사”의
                                        사전 동의를 얻은 후 자체 처리할 수 있습니다. 다만, “회사” 가 이에 동의하지 않는 경우 “고객”은
                                        “회사”의 지정, 안내에 따라 차량을 수리하여야 합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      <div>
                                        “고객”이 본 항 제2호의 수리내역에 대한 증빙을 첨부 하여 “회사”에게 청구하면 “회사”는 이를 확인하고
                                        이 상이 없을 경우 동 비용을 지급합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      <div>“고객”이 “회사”의 동의 없이 임의로 수리한 경우, 해 당 비용은 “고객”의 부담으로 합니다.</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9315;</div>
                                <div>
                                  <div>사고처리</div>
                                  <div>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      <div>
                                        <div>사고발생시 “고객”과 “회사”는 다음 사항을 준수하여 사고해결을 위해 상호 협력하기로 합니다.</div>
                                        <div className={cx('pl-content-1')}>
                                          <div className={cx('flex-start')}>
                                            <div>가.</div>
                                            <div>
                                              “고객”은 “회사”가 요청하는 지정 양식의 사 고경위서를 지체없이 제출하여야 하며, “회사” 는
                                              관계법령이 요구하는 즉각적인 조치를 취 해야 합니다.
                                            </div>
                                          </div>
                                          <div className={cx('flex-start')}>
                                            <div>나.</div>
                                            <div>“고객”과 “회사”는 보험회사 또는 수사기관 에서 필요로 하는 서류 및 증거를 제출하여야</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div>
                                <div className={cx('pl-content-3')}>
                                  <div style={{ paddingLeft: 30 }}>합니다.</div>
                                  <div className={cx('flex-start')}>
                                    <div>다.</div>
                                    <div>
                                      “고객”과 “회사”는 다른 일방에게 불리한 합 의, 화해나 계약을 제3자와 체결 등 할 수 없 으며 상기 의무를
                                      고의, 과실로 태만히 함으로 써 발생하는 손해에 대해서는 상대방에게 배 상하기로 합니다.
                                    </div>
                                  </div>
                                </div>
                                <div className={cx('pl-content-1')}>
                                  <div className={cx('flex-start')}>
                                    <div>(2)</div>
                                    <div>
                                      “고객”은 차량에 블랙박스(영상기록장치)가 장착된 경 우, 해당 차량의 사고처리 목적으로 기록된 사고
                                      영상을 회사 및 자동차보험 가입 보험회사, 기타 관계 기관(경 찰서 등)에서 요청 시 그에 따라 지체 없이
                                      해당 사고 영 상을 제공하여야 합니다.
                                    </div>
                                  </div>
                                  <div className={cx('flex-start')}>
                                    <div>(3)</div>
                                    <div>
                                      차량사고로 부분품에 “경미한 손상”이 생긴 경우, “회 사”는 보험 개발원이 정한 경미 손상 수리 기준에 따라
                                      수리시행을 원칙으로 합니다.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div className={cx('flex-start')}>
                                <div>&#9316;</div>
                                정비 서비스 상품의 종류를 불문하고, 이종연료 및 불량연 료(석유 및 석유대체연료사업법상 유사석유제품, 수분
                                또는 이물질 등이 함유된 연료 등 포함) 주입으로 인한 수리비용 은 자차손해면책제도 가입여부와 무관하게
                                “고객”이 부담 하여야 합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9317;</div>
                                운전보조장치(하이패스, 내비게이션, 블랙박스등)의 고장수 리를 제외한 업데이트등의 유지보수는 (SD카드 포함)
                                “고 객”이 직접 수행하여야 합니다.
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제10조 계약의 중도 해지 및 종료</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                <div>
                                  <div>
                                    “회사”는 “고객”이 다음 각 호중 어느 하나라도 해당하는 경우 임대차계약을 해지하고 당해 차량의 반환을
                                    청구하거 나 회수할 수 있습니다.
                                  </div>
                                  <div className={cx('pl-content-1')}>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      <div>대여료를 2회 이상 연속적으로 납부를 지연하였을 때</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      <div>임대차계약 제2조의 [보증조건]을 이행하지 아니한 때</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      <div>계약체결 시 “고객”이 “회사”에 제공한 정보가 허위로 판명될 때</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(4)</div>
                                      <div>
                                        “고객”이 발행한 어음 또는 수표가 부도되어 은행의 거래정지 처분이 있거나 조세공과금의 체납으로 독촉
                                        또는 체납처분을 받을 때
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(5)</div>
                                      <div>
                                        사업이 휴·폐업되거나 회사가 해산한 때 또는 파산, 회 생 등을 신청, 기타 이에 준하는 절차가 개시되거나
                                        기 업구조조정촉진법 상 워크아웃 대상으로 지정된 때
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(6)</div>
                                      <div>
                                        “회사”의 사전 서면동의 없이 임대차계약의 목적물(차 량)을 제3자에게 양도, 담보제공, 임대 또는 점유를
                                        이 전하는 등 처분행위를 한 때
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(7)</div>
                                      <div>
                                        “고객”이 “회사”에 제공한 담보에 대하여 제3자로부 터 (가)압류, 가처분, 경매, 기타 강제집행을 당한 때
                                        또 는 “고객”의 일반 재산에 대하여 제3자로부터 (가)압 류, 가처분, 강제집행 개시 신청 등으로 현저하게
                                        신용 이 상실되었다고 인정되는 때
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(8)</div>
                                      <div>“고객”이 제8조 제1항의 금지행위를 위반한 때</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(9)</div>
                                      <div>“고객”이 차량인도일로부터 누적 10회 이상 보험사고 발생에 해당한 때</div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(10)</div>
                                      <div>
                                        “고객”이 임대차계약에 대한 중요한 사항을 위반하여 계약을 유지하기가 어려운 객관적인 사정이 존재할 때
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(11)</div>
                                      <div>
                                        “고객”이 개인(개인사업자 포함)인 경우에는 사망, 성 년후견선고 또는 한정후견선고를 받은 때 및“회사”가
                                        “고객”이 사망, 성년후견선고 또는 한정후견선고(구법 에 따른 금치산선고 또는 한정치산선고 포함)를 받은
                                        사실을 알게 된 때
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(12)</div>
                                      <div>
                                        한국거래소, 코스닥, 기타 시장에서의 관리종목 지정 또는 퇴출 시, 회계법인 감사의견 ‘거절/부적정/ 한정
                                        의견’ 표명 시, “고객”이 제3의 결손법인과의 합병, 노 사분규에 따른 사업장 폐쇄, 관련기업의 도산,
                                        “고객” 의 경영에 영향을 미칠 법적 분쟁의 발생 등으로 현저
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>10/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div></div>
                                  <div>
                                    <div className={cx('pl-content-1')}>
                                      <div className={cx('flex-start')}>
                                        <div className={cx('pl-content-1')}>
                                          하게 신용이 상실되었다고 인정되는 등 채권보전이 필 요하다고 인정되는 객관적으로 상당한 사유가
                                          발생한 때
                                        </div>
                                      </div>
                                      <div className={cx('flex-start')}>
                                        <div>(13)</div>
                                        <div>차량이 멸실되거나 차량의 수리비가 차량가액(중고차 시세)의 80%를 초과하는 경우</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  “회사”가 본 조 제1항의 사유로 임대차계약을 해지할 경우 “고객”은 “회사”에게 제6조 제1항 후문에 따라 차량을
                                  지 체 없이 반환하고, 해지일까지의 대여료를 완납하며 제3조 제②항에 따라 위약금을 지급하는 등 약정된 금액을
                                  모두 변제하여야 합니다. 이때 차량을 지체 없이 반환하지 아니 할 시는 제4조 제7항에 의해 해지일 다음
                                  날로부터 차량반 환일까지 [대당 월대여료(부가세 포함)]를 1일 단위로 환 산한 일평균요금(월대여료 x 12 /
                                  365)을 당해 기간에 적 용하여 계산한 금액을 추가로 지급하여야 합니다.
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9314;</div>
                                  제7조 제2항 제1호 단서 각 목의 행위 및 제8조 제1항의 금지행위로 인하여 ”회사”와 별도의 협의없이 차량을
                                  반환 하지 않고 운행하다 발생한 손해로 인하여 본 조 제1항 제 13호 사유 발생 시 고객은 본 조 제1항의
                                  금액과는 별도로 아래의 산식에 의한 차량손해를 배상하여야 합니다. *손해배상액 = 차량가액(해지일 기준
                                  중고차시세)
                                </div>
                                <div className={cx('flex-start')}>
                                  <div>&#9315;</div>
                                  “고객”이 ”고객”의 사정으로 인해 임대차계약을 중도해지 하고자 할 경우, “고객”은 “회사”에게 제6조 제1항
                                  후문에 따라 차량을 반환하고, 해지일까지의 대여료를 완납하며, 제3조 제2항에 따라 위약금을 지급하고, 해지일
                                  현재 임대 차계약에 의하여 “고객”이 이행하여야 할 일체의 채무 이 행을 완료하여야 해지할 수 있습니다.
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제11조 차량의 멸실/훼손에 따른 원상 회복의무</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                “고객”이 차량을 인수한 때부터 “회사”에 차량을 반환할 때까지 발생한 차량의 멸실, 훼손 등으로 인해 “회사”가 손
                                해를 입은 경우 “고객”은 이를 배상하여야 합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                <div>
                                  <div>차량 및 부분품(내비게이션, 블랙박스 등) 도난의 경우에 는 다음 각호에 따릅니다.</div>
                                  <div>
                                    <div className={cx('flex-start')}>
                                      <div>(1)</div>
                                      <div>
                                        차량도난 사고 발생시 “고객”은 즉시 관할관서에 도난 신고를 하여야 하며 도난신고일로부터 계약은 자동
                                        해 지됩니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(2)</div>
                                      <div>
                                        도난신고일자를 기준으로 1개월 이내에 차량이 회수되 지 아니한 경우 “고객”은 도난신고일로부터 계산한
                                        재 3조 2항 제1호에 의거한 위약금과 도난 당시의 차량장 부가액을 “회사”에 배상하여야 합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(3)</div>
                                      <div>
                                        부분품(내비게이션, 블랙박스 등) 도난의 경우 “고객” 은 도난 당시의 부분품 가액을 “회사”에 배상하여야
                                        합 니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(4)</div>
                                      <div>
                                        부분품(내비게이션, 블랙박스 등)의 일부 부품(메모리 카드 등) 도난, 분실, 훼손, 멸실 등의 경우에는
                                        “고객” 은 동일한 제품의 새 부품을 장착하는데 소요되는 비용 을 배상하여야 합니다.
                                      </div>
                                    </div>
                                    <div className={cx('flex-start')}>
                                      <div>(5)</div>
                                      <div>
                                        상기 제2호 본문에 의한 “고객”의 가액배상 후 차량이 회수된 때에는 “회사”는 차량원상복구비용, 도난
                                        당시 의 차량장부가액과 회수시점의 장부가액의 차액, 도난 신고일로부터 회수시점까지의 위약금 상당액을
                                        공제 한 잔액을 즉시 환급합니다.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9314;</div>
                                정상 마모분을 제외하고 “고객”의 귀책사유로 차량이 훼손 되었을 때에는 “고객”은 지체 없이 이를 완전한 상태로
                                수 리하여야 하며 이때 임대차계약은 아무런 변경 없이 존속 하나, 수리가 불가능(현저히 곤란한 경우 포함)하거나
                                예 상수리비가 장부가액의 80%를 초과한 때에는 임대차계 약은 차량의 손 망실 사유발생일(“고객”이 대차제공서비
                                스를 이용하는 경우에는 수리 불능 또는 수리비 초과 확정
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div className={cx('flex-start')}>
                                <div style={{}}></div>
                                <div className={cx('pl-content-1')}>
                                  일 내에서 대차제공 서비스가 종료되는 날)로부터 자동 해 지됩니다. 이 때 “고객”은 해지일까지의 대여료를
                                  완납하 고, 제3조 제&#9313;항에 따라 위약금을 지급하며, 해지일 현재 임대차계약에 의하여 “고객”이 이행하여야
                                  할 일체의 채무 이행을 완료하여야 하고, 자차손해면책제도가 적용되는 경 우에는 제7조 제&#9313;항 제6호에
                                  따라, 자차손해 면책제도가 적용되지 않는 경우에는 제10조 제&#9314;항에 따라 각 차량손 해를 처리하기로
                                  합니다.
                                </div>
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9315;</div>
                                “고객”의 제8조 제&#9312;항의 금지행위 위반 등 기타 귀책사유 로 인해 차량이 멸실된 때에는 계약은 자동
                                해지되며 “고 객”은 그로 인하여 “회사”가 입은 모든 손해를 제10조 제 ③항의 산식을 적용하여 배상하여야 합니다.
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제13조 상품별 제공 서비스의 범위</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                계약체결 시 임대차계약 제2조 [상품구분] 선택에 따라 대 여료, 부가서비스 및 각종 조건 등 상품별 제공되는
                                서비스 의 범위가 정해집니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                상품별 제공되는 서비스 및 부가서비스 항목은 “회사”와 “고객”의 개별 약정에 의하여 변동 될 수 있습니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9314;</div>
                                하이패스 단말기 사용을 위한 전용카드는 “고객”이 직접 구입/충전 사용하여야 합니다.
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제14조 초과운행 부담금</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                임대차계약 상 제2조에 [약정주행거리]에 관한 정함이 있 는 경우, 임대차계약이 종료(대여기간 만료, 해제 또는 해
                                지된 경우 포함)된 후 차량의 운행거리가 [약정주행거리] 를 초과한 경우에 초과운행부담금을 정산하여야 합니다.
                                (VAT 별도)
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                “고객”이 대여기간이 만료되기 이전에 임대차계약을 해지 한 경우에는 “고객”의 약정운행거리를 일단위로 환산하여
                                초과운행거리를 산정합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9314;</div>
                                초과운행거리 산정 시 500km를 뺀 값으로 산정합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9315;</div>
                                본 조 제&#9313;항 및 제&#9314;항에 따라 산정한 초과운행거리에 대 하여 다음과 같은 방식으로 초과운행 부담금을
                                산정합니 다.
                                <br />
                                초과운행료 = 국산차량 250원/km, 수입 외산차량 500 원/km(차종 및 배기량은 무관)
                                <br />
                                초과운행 부담금 = 초과운행 km × km당 초과운행료 초과운행 km = 실제 운행거리 - 일일 약정운행거리 × 운 행일수
                                - 500km
                                <br />
                                일일 약정운행거리 = 연 약정운행거리 / 365
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제15조 블랙박스(영상기록장치)</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                “회사”는 대여차량 및/또는 대차제공 차량에 블랙박스(영 상기록장치)를 기본으로 장착할 수 있습니다. 블랙박스는
                                교통사고 시 사고처리를 위한 정보(증거) 수집용으로만 사 용되며, “고객”은 해당 차량의 사고처리 목적으로 기록된
                                사고 영상을 “회사”, 자동차보험 가입 보험회사, 기타 관계 기관(경찰서 등)에서 요청한 경우 해당 사고 영상을
                                제공 하여야 합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                “고객”은 대여차량 및/또는 대차제공 차량에 장착된 블랙 박스에 기록된 영상을 해당 차량의 사고처리 목적 이외의
                                용도로 저장, 배포, 편집, 제공, 판매하는 등 개인정보보호 법 등 관련 법령을 위반하는 일체의 행위를 하여서는
                                안됩 니다.
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제16조 부속 약정</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                “고객”과 “회사”는 부속약정(특약 등)을 체결할 수 있으며 이 경우 부속약정의 내용은 임대차계약서의 일부로
                                간주합 니다.
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>

          <div className="page" style={{ backgroundColor: 'white' }}>
            <div className={cx('header')}>
              <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
              <p className={cx('header_text')}>11/11</p>
              <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
            </div>
            <div className={cx('form', 'div-two_col')}>
              <div className={cx('form_content')}>
                <div className={cx('form_background')}>
                  <div className={cx('flex-between')} style={{ justifyContent: 'start', alignItems: 'start' }}>
                    <div className={cx('div-50')}>
                      <>
                        <div className={cx('form_content_1')}>
                          <div className={cx('form_content_1')}>
                            <div className={cx('pb-2')}>
                              <div>
                                <div className={cx('flex-start')}>
                                  <div>&#9313;</div>
                                  임대차계약서 외에 연대보증인 설정과 관련한 연대보증서, 개인(신용)정보 등에 대한 동의서, 기타 “고객”이
                                  제출한 서류 등도 임대차계약서의 일부로 간주합니다.
                                </div>
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제17조 기타 약정</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                임대차계약서에 규정되지 않은 사항은 공정거래위원회가 제정 고시한 “자동차대여표준약관”에 준하여 이행하기로
                                합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                “고객”과 “회사”는 상호 합의하여 계약 갱신 및 기타 추가 약정을 위한 변경계약서를 체결할 수 있습니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9314;</div>
                                임대차계약이 해지되지 않는 한, “회사”의 귀책사유 없는 “고객”의 차량사용 및 점유의 중단은 본계약상의 “회사”에
                                대한 “고객”의 의무/채무이행에는 아무런 영향을 미치지 않습니다.
                              </div>
                            </div>
                            <div className={cx('pb-2')}>
                              <div>제18조 분쟁의 해결</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                임대차계약서에 규정되지 아니한 사항 또는 계약해석에 있 어 상호간 이견이 있을 경우에는 관계법령 및 규정과
                                일반 상 관례에 따라 상호 협의하여 조정하기로 합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                임대차계약에 관한 분쟁으로 인한 재판적 관할은 “회사”의 대여지점 또는 본점 소재지 관할법원으로 합니다.
                              </div>
                            </div>
                            <div>
                              <div>제19조 계약의 효력 및 보관</div>
                              <div className={cx('flex-start')}>
                                <div>&#9312;</div>
                                임대차계약은 상호간 서명 또는 기명 날인한 날로부터 유 효합니다.
                              </div>
                              <div className={cx('flex-start')}>
                                <div>&#9313;</div>
                                임대차계약의 유효함을 증빙하기 위하여 계약서 2부를 작 성하여 “고객”과 “회사”가 각각 서명 또는 기명 날인하고
                                이를 각 1부씩 보관합니다.
                              </div>
                            </div>
                            <Flex justify="center" style={{ marginTop: 15 }}>
                              <AutoSizeInput variant="filled" defaultValue="YYYY-MM-DD" />
                            </Flex>
                            <div className={cx('info__wrapper')}>
                              <div className={cx('company-info')}>
                                <div className="content-end">“회사”</div>
                                <div className="content-end" style={{ position: 'relative' }}>
                                  <img src={kolon_logo_1} alt="Logo" />
                                </div>
                                <div className="content-end">경기도 안양시 동안구 평촌대로212번길 55, 9층</div>
                                <div className="content-end">(관양동, 대고빌딩)</div>
                                <div className="content-end" style={{ gap: 8 }}>
                                  <div>대표이사</div>
                                  <div>전 철 원</div>
                                  <div className={cx('opacity-50')}>(직인생략)</div>
                                </div>
                                <div className={cx('flex-end')}>“고객”</div>
                              </div>
                              <div>
                                <div className={cx('customer-info')}>
                                  <div className={cx('flex-between')}>
                                    <div className={cx('pb-2')} style={{ flex: 1 }}>
                                      주소 : {data?.customers?.[0]?.['cust_address']}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ flex: 1 }}>연락처 : {data?.customers?.[0]?.['cust_phone_number']}</div>
                                  </div>
                                  <Flex wrap justify="space-between" align="center" className={cx('signature-wrapper')}>
                                    <div style={{}}>
                                      <span>
                                        고객(계약자) 성함 : <NameInput />
                                      </span>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--primary-color)' }} onClick={() => handleClick('sign_img11')}>
                                        {getSignImage('sign_img11') ? (
                                          <img
                                            src={getSignImage('sign_img11')?.signImage}
                                            alt="signature"
                                            style={{ maxWidth: '100%' }}
                                            width={window.innerWidth < 600 ? 80 : 160}
                                          />
                                        ) : (
                                          '(서명)'
                                        )}
                                      </span>
                                    </div>
                                  </Flex>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className={cx('div-50')}></div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>
        </div>
      </Spin>
      <Flex gap={15} justify="center" style={{ padding: 10, backgroundColor: 'white' }}>
        {/* <Button type="default" style={{ width: 200, height: 50, fontSize: 20 }} onClick={handleExportAsPDF} loading={exportLoading}>
          Export to PDF
        </Button> */}
        <Button type="primary" style={{ width: 200, height: 50, fontSize: 20 }} onClick={handleSubmitFinal} loading={submitLoading}>
          제출하기
        </Button>
      </Flex>
    </ConfigProvider>
  );
};

export default RentalAgreement;
