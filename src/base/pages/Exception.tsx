import { Button, Result } from 'antd';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export interface IExceptionProps {
  status?: 403 | 404 | 500 | '403' | '404' | '500';
}

export default function Exception({ status }: IExceptionProps) {
  const navigate = useNavigate();
  let title, subTitle, extra;
  switch (status) {
    case 403:
    case '403':
      title = '403 Forbidden';
      subTitle = 'Sorry, you are not authorized to access this page.';
      break;
    case 404:
    case '404':
      title = '404 Not Found';
      subTitle = 'Sorry, the page you visited does not exist.';
      break;
    case 500:
    case '500':
      title = '500 Internal Server Error';
      subTitle = 'Sorry, something went wrong.';
      break;
    default:
      break;
  }
  return (
    <div style={{ paddingTop: 60 }}>
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Back Home
          </Button>
        }
      />
    </div>
  );
}
