import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import styles from './TransferAgreement.module.css';

import logo_702 from './images/logo_702.png';
import kolon_logo_1 from './images/kolon_logo_1.png';
import kolon_logo_mini_red from './images/kolon_logo_mini_red.png';
import kolon_logo_background from './images/kolon_logo_background.png';
import classNames from 'classnames/bind';
import { Button, Checkbox, ConfigProvider, Flex, Input, Result, Select } from 'antd';
import customerServices from '@base/services/customerServices';
import { useParams, useSearchParams } from 'react-router-dom';
import Link from 'antd/es/typography/Link';
import { useSetRecoilState } from 'recoil';
import { signatureModalAtom } from '@base/store/atoms/modal';
import contractServices from '@base/services/contractServices';
import { AxiosProgressEvent } from 'axios';
import commonServices from '@base/services/commonServices';
import useToast from '@base/hooks/useToast';
import { getIMGFromHTML, moneyFormatter } from '@base/utils/helper';
import CustomResult from '../CustomResult';
import AutoSizeInput from '@base/components/AutoSizeInput/AutoSizeInput';
import ValueDisplay from '@base/components/ValueDisplay';

const cx = classNames.bind(styles);

interface TransferAgreementProps {
  active?: boolean;
  round?: boolean;
}

const TransferAgreement: React.FC<TransferAgreementProps> = () => {
  const pageRef = useRef<any>(null);
  const { temp_id } = useParams();
  const [searchParams] = useSearchParams();

  // const monthly_amount = searchParams.get('monthly_amount');
  // const monthly_pay_date = searchParams.get('monthly_pay_date');

  const [data, setData] = useState<any>({});
  const setOpenSignatureModal = useSetRecoilState(signatureModalAtom);
  const [submitLoading, setSubmitLoading] = useState(false);
  const showToast = useToast();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  useEffect(() => {
    const getData = async () => {
      if (temp_id) {
        const res = await commonServices.getTemp(temp_id);
        if (res?.success) {
          const resData = JSON.parse(res.row?.data);
          if (resData.customers?.[0]) {
            resData.customers[0].cust_address = resData?.payment?.customers?.[0]?.['cust_address']?.replace('[+]', ' ');
          }
          setData(resData);
        }
      }
    };
    getData();
  }, []);

  const handleExportAsImage = async () => {
    if (pageRef.current) {
      try {
        const imageDataUrl = await getIMGFromHTML(pageRef.current);
        var link = document.createElement('a');
        link.download = 'transfer_agreement.jpeg';
        link.href = imageDataUrl;
        link.click();
      } catch (error) {
        console.error('ERROR:', error);
      }
    }
  };
  const handleSubmitSignature = (sig: string) => {
    setData((prev: any) => ({ ...prev, signature: sig }));
    setOpenSignatureModal({ visible: false });
  };
  const handleSubmit = async () => {
    setSubmitLoading(true);
    if (pageRef.current) {
      try {
        const imageDataUrl = await getIMGFromHTML(pageRef.current);
        const blob = await fetch(imageDataUrl).then((res) => res.blob());
        const file_upload = new File([blob], '자동이체 신청서.jpg', { type: 'image/jpeg' });

        const body = {
          temp_id,
          file_upload
        };

        // Gửi POST request sử dụng dịch vụ contractServices
        const res = await contractServices.confirmAutoTransferAgreement(body);
        if (res?.success) {
          showToast({ content: '자동이체 신청서가 등록되었습니다', type: 'success' });
          setIsSubmitted(true);
          window.close();
        } else {
          showToast({ content: res?.message, type: 'error' });
        }
      } catch (error) {
        console.error('ERROR:', error);
      } finally {
        setSubmitLoading(false);
      }
    }
  };
  if (isSubmitted) return <CustomResult title="차량임대차(장기렌트) 자동이체 결제 변경 신청서가" />;
  return (
    <ConfigProvider theme={{ token: { controlInteractiveSize: 26 } }}>
      <div ref={pageRef} className={cx('container')}>
        <div className={cx('header')}>
          <img className={cx('header_logo_702')} src={logo_702} alt="Logo" />
          <p className={cx('header_text')}>1/1</p>
          <img className={cx('header_logo_kolon')} src={kolon_logo_1} alt="Logo" />
          {/* <img src={kolon_logo_mini_red} alt="Logo" /> */}
          {/* <img src={kolon_logo_background} alt="Logo" /> */}
        </div>
        <div className={cx('form')}>
          <div className={cx('form_heading')}>
            <h1 className={cx('form_heading_1')}>차량임대차(장기렌트) 자동이체</h1>
            <h1 className={cx('form_heading_2', 'text_center')}>신청서</h1>
          </div>
          <div className={cx('form_content')}>
            <div className={cx('form_title_1')}>
              <h2 className={cx('form_title_1_content')}>수납업체 및 목적</h2>
              <div className={cx('form_checkbox', 'form_title_1_checkbox')}>
                <Flex gap={5} align="center">
                  <label>신규</label>
                  <Checkbox id="vehicle1" name="vehicle1" value="Bike" />
                </Flex>
                <Flex gap={5} align="center">
                  <label>변경</label>
                  <Checkbox id="vehicle2" name="vehicle2" value="Car" defaultChecked />
                </Flex>
              </div>
            </div>

            <div className={cx('form_content_1')}>
              <table className={cx('form_content_1_table')}>
                <tr>
                  <th>수납업체</th>
                  <td className={cx('text_center')}>코오롱모빌리티그룹 주식회사</td>
                  <th>수납목적</th>
                  <td className={cx('text_center')}>렌탈료</td>
                </tr>
                <tr>
                  <th>대표자</th>
                  <td className={cx('text_center')}>전철원</td>
                  <th>사업자등록번호</th>
                  <td className={cx('text_center')}>833-87-02544</td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td className={cx('text_center')} colSpan={3}>
                    경기도 안양시 동안구 평촌대로212번길 55, 9층 (관양동)
                  </td>
                </tr>
              </table>
            </div>
            <div className={cx('form_background')}>
              <div className={cx('form_title_1')}>
                <h2 className={cx('form_title_1_content')}>자동이체 신청내용</h2>
              </div>

              <div className={cx('form_subtitle')}>
                <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
                <h3 className={cx('form_subtitle_content')}>신청정보</h3>
              </div>

              <div className={cx('form_content_1')}>
                <table className={cx('form_content_1_table')}>
                  <tr>
                    <th>신청인(예금주)</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                      <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                    </td>
                    <th>연락처</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                      <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                    </td>
                  </tr>
                  <tr>
                    <th>납부금액</th>
                    <td className={cx('text_center')}>
                      <ValueDisplay value={data['monthly_amount'] || 0} suffixes="원" formatFunction={[moneyFormatter]} />
                    </td>
                    <th>납부일</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
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
                    </td>
                  </tr>
                </table>
              </div>

              <div className={cx('form_subtitle')}>
                <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
                <h3 className={cx('form_subtitle_content')}>금융거래정보</h3>
              </div>

              <div className={cx('form_content_1')}>
                <table className={cx('form_content_1_table')}>
                  <tr>
                    <th>은행명</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                      <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                    </td>
                    <th>예금주</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                      <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                    </td>
                  </tr>
                  <tr>
                    <th>예금주 연락처</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                      <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                    </td>
                    <th>생년월일(사업자번호)</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')}>
                      <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                    </td>
                  </tr>
                  <tr>
                    <th>계좌번호</th>
                    <td style={{ backgroundColor: '#f1f1f1' }} className={cx('text_center')} colSpan={3}>
                      <Input variant="borderless" style={{ textAlign: 'center', paddingBlock: 0 }} />
                    </td>
                  </tr>
                </table>
              </div>

              <div className={cx('form_title_1')}>
                <h2 className={cx('form_title_1_content')}>개인정보 활용동의</h2>
              </div>

              <div className={cx('form_subtitle')}>
                <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
                <h3 className={cx('form_subtitle_content')}>개인정보 수집 및 이용 동의</h3>
              </div>
            </div>

            <div className={cx('form_rule')}>
              <ul className={styles.form_rule_ul}>
                <li className={cx('font_bold')}>수집 및 이용목적 : 효성CMS 자동이체를 통한 요금 수납</li>
                <li>
                  <div className={cx('form_rule_1')}>
                    <p>수집항목 : 성명, 생년월일, 연락처, 은행명, 예금주명, 계좌번호, 예금주 휴대전화번호</p>
                    <Flex gap={5} align="center" className={cx('form_checkbox')}>
                      <label className={cx('no_wrap')} htmlFor="vehicle3">
                        동의
                      </label>
                      <Checkbox id="vehicle3" name="vehicle3" value="Bike" />
                    </Flex>
                  </div>
                </li>
                <li>
                  <div className={cx('form_rule_1')}>
                    <p className={cx('font_bold')}>보유 및 이용기간 : 수집/이용 동의일부터 자동이체 종료일(해지일)까지</p>
                    <Flex gap={5} align="center" className={cx('form_checkbox')}>
                      <label className={cx('no_wrap')} htmlFor="vehicle4">
                        미동의
                      </label>
                      <Checkbox id="vehicle4" name="vehicle4" value="Bike" />
                    </Flex>
                  </div>
                </li>
                <li>신청자는 개인정보의 수집 및 이용을 거부할 수 있습니다. 단, 거부 시 자동이체 신청이 처리되지 않습니다.</li>
              </ul>
            </div>

            <div className={cx('form_note')}>
              * 위의 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으며, 동의한 이후에도 이를 철회할 수 있습니다. 그러나 동의를 거부할
              경우 렌트카 서비스 제공이 제한 될 수 있습니다.
            </div>

            <div className={cx('form_subtitle')}>
              <img className={cx('kolon_logo_mini_red')} src={kolon_logo_mini_red} alt="Logo" />
              <h3 className={cx('form_subtitle_content')}>개인정보 제3자 제공 동의</h3>
            </div>

            <div className={cx('form_rule')}>
              <ul className={styles.form_rule_ul}>
                <li>
                  <div className={cx('font_large')}>
                    개인정보를 제공받는 자: 효성에프엠에스㈜, 금융기관(하단 신청가능은행 참조), 통신사(SKT, KT LGU+, LG헬로비전)등, 자세한
                    내용은 홈페이지 게시(
                    <span className={cx('text_blue')}>www.hyosungfms.com</span> / 제휴사 소개 메뉴 내), ㈜케이소프트
                  </div>
                </li>
                <li>개인정보를 제공받는 자의 이용 목적: 자동이체서비스 제공 및 자동이체 동의 사실 통지</li>
                <li>제공하는 개인정보의 항목: 성명, 생년월일, 연락처, 은행명, 예금주명, 계좌번호, 예금주 휴대전화번호</li>
                <li>
                  <div className={cx('form_rule_1')}>
                    <p className={cx('word_break')}>
                      개인정보를 제공받는자의 개인정보 보유,이용기간: 동의일부터 자동이체의 종료일(해지일)까지. 단, 관계 법령에 의거
                      일정기간 동안 보관
                    </p>
                    <Flex gap={10} className={cx('form_checkbox')}>
                      <Flex gap={5} align="center">
                        <label htmlFor="vehicle5" className={cx('no_wrap')}>
                          동의
                        </label>
                        <Checkbox id="vehicle5" name="vehicle5" value="Bike" />
                      </Flex>
                      <Flex gap={5} align="center">
                        <label htmlFor="vehicle6" className={cx('no_wrap')}>
                          미동의
                        </label>
                        <Checkbox id="vehicle6" name="vehicle6" value="Bike" />
                      </Flex>
                    </Flex>
                  </div>
                </li>
                <li>신청자는 개인정보의 수집 및 이용을 거부할 수 있습니다. 단, 거부 시 자동이체 신청이 처리되지 않습니다.</li>
                <li className={cx('font_bold')}>
                  # 자동이체 동의여부 통지 안내 : 효성에프엠에스㈜ 및 금융기관은 안전한 서비스의 제공을 위하여 예금주 휴대전화번호로
                  자동이체 동의 사실을 SMS(또는 LMS)로 통지합니다.
                </li>
              </ul>
            </div>

            <div className={cx('form_footer')}>
              <h2>신청인(예금주)은 신청정보, 금융거래정보 등 개인정보의 수집·이용 및 제 3자 제공에 동의하며</h2>
              <h2>상기와 같이 효성CMS 자동이체를 신청합니다.</h2>
              <Flex justify="center" style={{ marginBlock: 10 }}>
                <Input variant="filled" className={cx('datetime-input')} />
              </Flex>
              <div className="content-end" style={{ paddingRight: '10%' }}>
                <Flex vertical align="center">
                  <p>
                    신청인(예금주) 성함 : <AutoSizeInput variant="filled" maxLength={50} />
                  </p>
                  <Link onClick={() => setOpenSignatureModal({ visible: true, onSubmit: handleSubmitSignature })}>
                    {data.signature ? <img src={data.signature} alt="signature" width={window.innerWidth < 600 ? 80 : 160} /> : '(서명)'}
                  </Link>
                </Flex>
              </div>

              <div>
                <ul>
                  <li>인감 또는 서명은 출금통장의 사용인감 또는 서명을 사용해야 합니다.</li>
                  <li>기존 신청내용을 변경하고자 하는 경우에는 자동이체신청서를 신규로 작성하셔야 합니다.</li>
                  <li>
                    신청가능은행: 카카오뱅크, 케이뱅크, 신한, KEB하나, 농협, 국민, 우리, 기업, 대구, 새마을, 부산, 신협, 우체국, 경남, 광주,
                    SC, 수협, 전북, 씨티, 제주, 산업, 유안타증권, 삼성증권
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Flex gap={10} justify="center" align="center" style={{ padding: 10, backgroundColor: 'white' }}>
        <Button type="default" style={{ width: 200, maxWidth: '100%', height: 50, fontSize: 20 }} onClick={handleExportAsImage}>
          Export to JPG
        </Button>
        <Button
          type="primary"
          style={{ width: 200, maxWidth: '100%', height: 50, fontSize: 20 }}
          onClick={handleSubmit}
          loading={submitLoading}
        >
          제출하기
        </Button>
      </Flex>
    </ConfigProvider>
  );
};

export default TransferAgreement;
