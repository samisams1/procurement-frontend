import React from 'react';
import PdfDownload from './PdfDownload';
import ParentComponent from './parantComponet';


const BestQuotation: React.FC = () => {
    return( 
      <div>
         <PdfDownload component={<ParentComponent />} />
      </div>
  );
};

export default BestQuotation;