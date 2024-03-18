import SendRfqComponent from '../../components/pageComponents/Quotation/sendRfq';
import { useLocation } from 'react-router-dom';

const SendRfq = () => {
  const location = useLocation();
  const id = location.state?.id;
  const qId = location.state?.qId;
  const customerId = location.state?.customerId;
  const supplierId = location.state?.supplierId;
  const referenceNumber=location.state?.referenceNumber;
  const  requestedDate=location.state?.requestedDate;
  const customerName = location.state?.customerName;
  return (
    <div>
  <SendRfqComponent id={Number(id)} qId ={Number(qId)}  status="pending" customerId= {customerId} supplierId={Number(supplierId)} 
         referenceNumber={referenceNumber} requestedDate ={requestedDate} customerName = {customerName} />
    </div>
  );
};

export default SendRfq;