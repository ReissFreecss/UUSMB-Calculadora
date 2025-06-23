import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});

interface PDFData {
  nombre: string;
  email: string;
  servicio: string;
  precio: number;
}

const PDFPreview = ({ data }: { data: PDFData }) => {
  return (
    <PDFViewer width="100%" height="500">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Cotización</Text>
            <Text>Nombre: {data.nombre}</Text>
            <Text>Email: {data.email}</Text>
            <Text>Servicio: {data.servicio}</Text>
            <Text>Total: ${data.precio}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFPreview;