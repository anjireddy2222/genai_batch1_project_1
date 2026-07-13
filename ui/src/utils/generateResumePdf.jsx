import { pdf } from '@react-pdf/renderer'
import ResumePdfDocument from './ResumePdfDocument.jsx'

export async function generateResumePdf(resume) {
  return pdf(<ResumePdfDocument resume={resume} />).toBlob()
}
