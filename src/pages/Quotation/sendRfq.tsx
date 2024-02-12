import React from 'react';
import SendRfqComponent from '../../components/pageComponents/Quotation/sendRfq';

const SendRfq = () => {
  return (
    <div>
      <SendRfqComponent id={1} status="pending" customerId="1" supplierId={1} />
    </div>
  );
};

export default SendRfq;