import React from 'react';
import { PDFDownloadLink, Document, Page, View } from '@react-pdf/renderer';
import PageHeader from '../../PageHeader';

// Define the styles for the PDF document using regular CSS
const styles = {
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
};

// Define the content for the PDF document
const TableDocument: React.FC<{ component: React.ReactNode }> = ({ component }) => (
  <Document>
    <Page size="A4">
      <View style={styles.section}>
        <PageHeader title="Send Order"/>
        <View>
          {component}
        </View>
      </View>
    </Page>
  </Document>
);

const PdfDownload: React.FC<{ component: React.ReactNode }> = ({ component }) => {
  return (
    <div>
      <PDFDownloadLink document={<TableDocument component={component} />} fileName="table.pdf">
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default PdfDownload;
