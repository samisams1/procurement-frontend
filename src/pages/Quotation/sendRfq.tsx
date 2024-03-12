import SendRfqComponent from '../../components/pageComponents/Quotation/sendRfq';
import { useLocation } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { RequestQuote } from '@mui/icons-material';

const SendRfq = () => {
  const location = useLocation();
  const id = location.state?.id;
  const qId = location.state?.qId;
  const customerId = location.state?.customerId;
  const supplierId = location.state?.supplierId;
  const referenceNumber=location.state?.referenceNumber;
  const  requestedDate=location.state?.requestedDate;
  return (
    <div>
    <PageHeader
    title="Quotation"
    icon={<RequestQuote/>}
    subTitle="please fill your price and send to the supplier"
    />
          <SendRfqComponent id={Number(id)} qId ={Number(qId)}  status="pending" customerId= {customerId} supplierId={Number(supplierId)} 
         referenceNumber={referenceNumber} requestedDate ={requestedDate} />
    </div>
  );
};

export default SendRfq;