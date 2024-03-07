import React, { useContext,useEffect, useState } from 'react';
import { UserContext } from '../../auth/UserContext';
import { useQuery, gql } from '@apollo/client';
import Spinner from '../../components/Spinner';
import SentProformaComponent from '../../components/pageComponents/purchase/sentProforma';
const GET_SUPPLIER_ID = gql`
  query SupplierIdByUserId($userId: Int!) {
    supplierIdByUserId(userId: $userId) {
      id
    }
  }
`;

const SentProforma: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id ?? '';
  const role = currentUser?.role ?? '';
  const { loading, error, data } = useQuery(GET_SUPPLIER_ID, {
    variables: { userId:Number(userId) },
  });

  useEffect(() => {
    if (data && data.supplierIdByUserId) {
      // Perform any logic with the supplier ID here
      const supplierId = data.supplierIdByUserId.id;
      console.log('Supplier ID:', supplierId);
    }
  }, [data]);
  useEffect(() => {
    // Simulating API call delay
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(delay); // Clean up the timeout when the component unmounts
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (role === 'SUPPLIER') {
    if (data && data.supplierIdByUserId) {
      const supplierId = data.supplierIdByUserId.id;
      return <SentProformaComponent  supplierId= {supplierId}/>;;
    }
  } else {
    return null;
  }

  

  return <p>Supplier not available</p>;
};

export default SentProforma;