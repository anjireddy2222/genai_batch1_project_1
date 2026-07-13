import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const NAVY = '#1E3A5F'
const TEXT = '#111111'
const MUTED = '#3A3A3A'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: TEXT,
    lineHeight: 1.4,
  },
  header: { textAlign: 'center', marginBottom: 10 },
  name: { fontFamily: 'Times-Roman', fontSize: 18, color: TEXT },
  contact: { fontSize: 10.5, color: MUTED, marginTop: 4 },
  targetRole: { fontSize: 10.5, color: MUTED, marginTop: 2, fontStyle: 'italic' },
  sectionHeading: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
    paddingBottom: 2,
    marginTop: 12,
    marginBottom: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  jobTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10.5 },
  dates: { fontSize: 10.5, color: MUTED },
  bulletRow: { flexDirection: 'row', marginTop: 2, paddingLeft: 10 },
  bulletDot: { width: 10, fontSize: 10.5 },
  bulletText: { flex: 1, fontSize: 10.5 },
  jobBlock: { marginBottom: 8 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
})

function formatDateRange(start, end) {
  if (!start && !end) return ''
  if (start && end) return `${start} - ${end}`
  return start || end
}

export default function ResumePdfDocument({ resume }) {
  const contactParts = [resume.contact?.email, resume.contact?.phone, resume.contact?.location].filter(Boolean)

  return (
    <Document title={`${resume.name || 'Resume'} - Resume`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{resume.name || 'Your Name'}</Text>
          {contactParts.length > 0 && <Text style={styles.contact}>{contactParts.join('   ·   ')}</Text>}
          {resume.targetRole && <Text style={styles.targetRole}>{resume.targetRole}</Text>}
        </View>

        {resume.summary && (
          <View>
            <Text style={styles.sectionHeading}>Summary</Text>
            <Text>{resume.summary}</Text>
          </View>
        )}

        {resume.experience?.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Work Experience</Text>
            {resume.experience.map((job, index) => (
              <View key={index} style={styles.jobBlock}>
                <View style={styles.row}>
                  <Text style={styles.jobTitle}>
                    {job.title || 'Role'} — {job.company || 'Company'}
                  </Text>
                  <Text style={styles.dates}>{formatDateRange(job.startDate, job.endDate)}</Text>
                </View>
                {job.location && <Text style={styles.dates}>{job.location}</Text>}
                {(job.bullets || []).map((bullet, bulletIndex) => (
                  <View key={bulletIndex} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {resume.education?.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Education</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={styles.eduRow}>
                <Text style={styles.jobTitle}>
                  {edu.degree || 'Degree'} — {edu.school || 'School'}
                </Text>
                <Text style={styles.dates}>{formatDateRange(edu.startDate, edu.endDate)}</Text>
              </View>
            ))}
          </View>
        )}

        {resume.skills?.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Skills</Text>
            <Text>{resume.skills.join(', ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
