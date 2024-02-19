import React from 'react';
import SendRfqComponent from '../../components/pageComponents/Quotation/sendRfq';
import { useLocation } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { RequestQuote } from '@mui/icons-material';

const SendRfq = () => {
  const location = useLocation();
  const id = location.state?.id;
  //const customerId = location.state?.customerId;
  return (
    <div>
    <PageHeader
    title="Quotation"
    icon={<RequestQuote/>}
    subTitle="please fill your price and send to the supplier"
    />
      <SendRfqComponent id={id} status="pending" customerId="1" supplierId={1} />
    </div>
  );
};

export default SendRfq;