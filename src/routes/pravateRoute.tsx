import type { RouteProps } from 'react-router';

import { Button, Result } from 'antd';
import { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { useLocale } from '@/locales';
import { getSubscriptions } from '@/stores/subscriptions/subscriptions.action';

const PrivateRoute: React.FC<RouteProps> = props => {
  const { logged } = useSelector(state => state.user);
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const location = useLocation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if(logged){
  //     dispatch(getSubscriptions())
  //   }
  // }, [logged])
  return logged ? (
    (props.element as React.ReactElement)
  ) : (
    <Result
      status="403"
      title="403"
      subTitle={formatMessage({ id: 'gloabal.tips.unauthorized' })}
      extra={
        <Button
          type="primary"
          onClick={() => navigate(`/login${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true })}
        >
          {formatMessage({ id: 'gloabal.tips.goToLogin' })}
        </Button>
      }
    />
  );
};

export default PrivateRoute;
