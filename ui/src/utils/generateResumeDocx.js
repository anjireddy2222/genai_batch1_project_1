import { AlignmentType, BorderStyle, Document, Packer, Paragraph, TextRun } from 'docx'

const NAVY = '1E3A5F'
const MUTED = '3A3A3A'

function formatDateRange(start, end) {
  if (!start && !end) return ''
  if (start && end) return `${start} - ${end}`
  return start || end
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    border: {
      bottom: { color: NAVY, space: 2, style: BorderStyle.SINGLE, size: 6 },
    },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: NAVY, size: 21 })],
  })
}

export async function generateResumeDocx(resume) {
  const contactParts = [resume.contact?.email, resume.contact?.phone, resume.contact?.location].filter(Boolean)
  const children = []

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: resume.name || 'Your Name', size: 36 })],
    })
  )
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: contactParts.join('   ·   '), size: 21, color: MUTED })],
      })
    )
  }
  if (resume.targetRole) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: resume.targetRole, italics: true, size: 21, color: MUTED })],
      })
    )
  }

  if (resume.summary) {
    children.push(sectionHeading('Summary'))
    children.push(new Paragraph({ children: [new TextRun({ text: resume.summary, size: 21 })] }))
  }

  if (resume.experience?.length > 0) {
    children.push(sectionHeading('Work Experience'))
    resume.experience.forEach((job) => {
      children.push(
        new Paragraph({
          spacing: { before: 120 },
          children: [
            new TextRun({ text: `${job.title || 'Role'} — ${job.company || 'Company'}`, bold: true, size: 21 }),
          ],
        })
      )
      const dates = formatDateRange(job.startDate, job.endDate)
      if (dates || job.location) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: [dates, job.location].filter(Boolean).join('   ·   '), size: 20, color: MUTED }),
            ],
          })
        )
      }
      ;(job.bullets || []).forEach((bullet) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: bullet, size: 21 })],
          })
        )
      })
    })
  }

  if (resume.education?.length > 0) {
    children.push(sectionHeading('Education'))
    resume.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [new TextRun({ text: `${edu.degree || 'Degree'} — ${edu.school || 'School'}`, size: 21 })],
        })
      )
      const dates = formatDateRange(edu.startDate, edu.endDate)
      if (dates) {
        children.push(new Paragraph({ children: [new TextRun({ text: dates, size: 20, color: MUTED })] }))
      }
    })
  }

  if (resume.skills?.length > 0) {
    children.push(sectionHeading('Skills'))
    children.push(new Paragraph({ children: [new TextRun({ text: resume.skills.join(', '), size: 21 })] }))
  }

  const doc = new Document({ sections: [{ children }] })
  return Packer.toBlob(doc)
}
