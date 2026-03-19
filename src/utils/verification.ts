/**
 * Generates a mailto link for transcript verification
 * Opens the user's default email client with pre-filled content
 */
export const generateVerificationEmail = (options: {
  studentName: string;
  studentId: string;
  schoolEmail: string;
  schoolName: string;
  companyName: string;
  employerEmail: string;
  cvgaOrGrades?: string;
}) => {
  const {
    studentName,
    studentId,
    schoolEmail,
    schoolName,
    companyName,
    employerEmail,
    cvgaOrGrades = ''
  } = options;

  const subject = `Education Verification Request: ${studentName} - ${studentId}`;

  const body = `Dear Academic Affairs Officer,

${companyName} is considering ${studentName} (ID: ${studentId}) for employment. We wish to verify the academic transcript attached to this request.

STUDENT INFORMATION:
- Full Name: ${studentName}
- Student ID: ${studentId}
- School/University: ${schoolName}

The student has provided consent for verification of their academic records as required by your institution's policy. We request:

1. Confirmation that the student ${studentName} (ID: ${studentId}) exists in your records
2. Verification that the grades/CGPA on the provided transcript match your permanent records
3. Notification of any discrepancies found between the submitted and official records

EMPLOYER CONTACT:
- Company: ${companyName}
- Email: ${employerEmail}

Please find the student's consent letter attached. The student's transcript is also attached for cross-reference.

We appreciate your timely response to facilitate the hiring process.

Best regards,
Recruitment Department
${companyName}`;

  // Encode the email parameters for URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  // Create mailto link
  const mailtoLink = `mailto:${schoolEmail}?subject=${encodedSubject}&body=${encodedBody}`;

  return mailtoLink;
};

/**
 * Opens the verification email in the user's default client
 */
export const initiateVerificationEmail = (options: Parameters<typeof generateVerificationEmail>[0]) => {
  const mailtoLink = generateVerificationEmail(options);
  
  // Open the mailto link
  window.location.href = mailtoLink;
};
