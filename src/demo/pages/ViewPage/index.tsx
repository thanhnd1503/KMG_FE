import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ViewContainer from '@base/containers/ViewContainer';
import { useGetDemoDetail } from '@demo/hooks/useGetDemoDetail';

import Left from './Left';
import Right from './Right';
import Top from './Top';

interface ViewPageProps {}
const ViewPage = (props: ViewPageProps) => {
  const {} = props;
  const [mainData, setMainData] = useState<any>({});

  const { id, subMenu } = useParams();

  const { data } = useGetDemoDetail({ id }, subMenu ?? undefined, { enabled: !!id });

  useEffect(() => {
    if (data) {
      setMainData(data);
    }
  }, [data]);

  console.log('mainData', mainData);

  return <ViewContainer viewData={mainData} Top={Top} Left={Left} Right={Right} />;
};

export default ViewPage;
