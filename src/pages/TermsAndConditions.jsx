import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertTriangle, BookOpen, Users, CreditCard, Ban } from 'lucide-react';

function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const sections = [
    {
      icon: <FileText size={24} />,
      title: '1. Acceptance of Terms',
      content: `By accessing and using the NIICT (Nihanshi Institute of Information and Computer Technology) website and services, you accept and agree to be bound by the terms and conditions outlined in this document. If you do not agree with any part of these terms, you must not use our services.

These terms apply to all visitors, users, students, and others who access or use our services. We reserve the right to modify these terms at any time, and your continued use of our services constitutes acceptance of such modifications.`
    },
    {
      icon: <BookOpen size={24} />,
      title: '2. Services Description',
      content: `NIICT provides computer training and educational services, including:

• IT courses and certification programs
• Online and offline educational content
• Student portal access and resources
• Admission and enrollment services
• Competition and assessment programs
• Educational support and consultation

We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.`
    },
    {
      icon: <Users size={24} />,
      title: '3. Enrollment and Admission',
      content: `Enrollment Terms:

• All admissions are subject to availability and meeting eligibility criteria
• Submission of accurate and complete information is mandatory
• We reserve the right to reject any admission application without providing reasons
• Admission fees and course fees must be paid as per the prescribed schedule
• False or misleading information may result in immediate termination of enrollment
• Age restrictions may apply to certain courses; please check course-specific requirements

Students must provide valid identification documents and meet the prerequisites for their chosen course.`
    },
    {
      icon: <CreditCard size={24} />,
      title: '4. Fees and Payments',
      content: `Payment Terms:

• All fees are quoted in Indian Rupees (INR) unless otherwise stated
• Course fees must be paid in full or as per the selected payment plan before course commencement
• Admission fees are non-refundable except as specified in our refund policy
• Late payment may result in suspension of services or additional charges
• All payments should be made through authorized payment channels only
• Refund requests must be submitted in writing within the specified time period

Refund Policy:
• Refunds, if applicable, will be processed according to our refund policy
• Processing fees may apply to refund requests
• Refunds may take 15-30 business days to process
• No refunds will be provided after course completion or for downloaded course materials`
    },
    {
      icon: <BookOpen size={24} />,
      title: '5. Student Responsibilities',
      content: `Students are expected to:

• Attend classes regularly and participate actively
• Complete assignments and assessments within specified deadlines
• Maintain academic integrity and refrain from plagiarism or cheating
• Respect intellectual property rights of instructors and fellow students
• Follow the institute's code of conduct and disciplinary policies
• Keep login credentials secure and not share them with others
• Report any technical issues or concerns promptly
• Comply with all applicable laws and regulations

Violation of these responsibilities may result in disciplinary action, including suspension or termination of enrollment.`
    },
    {
      icon: <Scale size={24} />,
      title: '6. Intellectual Property Rights',
      content: `All content provided by NIICT, including but not limited to:

• Course materials, lectures, and educational content
• Website content, logos, and branding
• Software, tools, and applications
• Documentation and study materials

Are protected by copyright, trademark, and other intellectual property laws. Students are granted a limited, non-exclusive, non-transferable license to use the materials for personal educational purposes only.

Prohibited Activities:
• Copying, distributing, or sharing course materials without authorization
• Selling or commercializing institute content
• Removing copyright notices or proprietary markings
• Reverse engineering or decompiling any software or tools
• Using content for purposes other than personal education`
    },
    {
      icon: <AlertTriangle size={24} />,
      title: '7. Code of Conduct',
      content: `All students and users must:

• Treat instructors, staff, and fellow students with respect
• Maintain a professional and courteous demeanor
• Refrain from harassment, discrimination, or inappropriate behavior
• Not engage in any illegal activities
• Not use services for any unauthorized purposes
• Not disrupt classes or interfere with other students' learning
• Comply with all applicable laws and regulations

Violations of the code of conduct may result in immediate suspension or termination of access to services without refund.`
    },
    {
      icon: <FileText size={24} />,
      title: '8. Certificates and Qualifications',
      content: `Certificate Issuance:

• Certificates are issued upon successful completion of courses as per course requirements
• Completion criteria include attendance, assignments, assessments, and examinations
• Certificates are awarded based on merit and fulfillment of all course requirements
• NIICT reserves the right to withhold certificates if requirements are not met
• Replacement certificates may be subject to additional fees

Validity and Recognition:
• Certificates represent completion of NIICT courses but do not guarantee employment or recognition by third parties
• Students should verify recognition of certificates with employers or other institutions
• NIICT is not responsible for how certificates are perceived or valued by third parties`
    },
    {
      icon: <Ban size={24} />,
      title: '9. Prohibited Activities',
      content: `You are strictly prohibited from:

• Using our services for any unlawful purpose
• Attempting to gain unauthorized access to our systems or data
• Interfering with or disrupting the services or servers
• Transmitting viruses, malware, or harmful code
• Collecting or harvesting information about other users
• Impersonating any person or entity
• Engaging in fraudulent, deceptive, or misleading practices
• Violating any applicable laws or regulations
• Using automated systems to access our services without authorization

Violation of these prohibitions may result in immediate termination of access and legal action.`
    },
    {
      icon: <AlertTriangle size={24} />,
      title: '10. Limitation of Liability',
      content: `NIICT and its instructors, employees, and affiliates shall not be liable for:

• Any indirect, incidental, special, consequential, or punitive damages
• Loss of profits, data, or business opportunities
• Errors or omissions in course content or materials
• Technical failures, interruptions, or delays in service
• Actions or content of third-party websites or services
• Students' success or failure in careers or examinations
• Employment outcomes or job placements

Our total liability, if any, shall not exceed the amount paid by you for the specific service giving rise to the claim.`
    },
    {
      icon: <FileText size={24} />,
      title: '11. Disclaimer of Warranties',
      content: `Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to:

• Warranties of merchantability or fitness for a particular purpose
• Accuracy, completeness, or reliability of content
• Uninterrupted or error-free operation of services
• Correction of defects or errors
• Freedom from viruses or harmful components

While we strive to provide quality education and services, we do not guarantee specific outcomes, results, or job placements.`
    },
    {
      icon: <FileText size={24} />,
      title: '12. Termination',
      content: `NIICT reserves the right to:

• Suspend or terminate your access to services at any time, with or without cause
• Terminate accounts that violate these terms or engage in prohibited activities
• Remove or delete any content or information you submit

Upon termination:
• Your right to access and use services will immediately cease
• All outstanding fees remain due and payable
• We are not obligated to provide refunds for terminated accounts
• You remain responsible for any obligations incurred before termination`
    },
    {
      icon: <Scale size={24} />,
      title: '13. Governing Law and Dispute Resolution',
      content: `These terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.

Dispute Resolution:
• Any disputes arising from these terms or our services shall first be attempted to be resolved through good faith negotiations
• If negotiations fail, disputes shall be subject to the exclusive jurisdiction of the courts in Jaunpur, Uttar Pradesh, India
• You agree to waive any objections to the jurisdiction or venue of such courts`
    },
    {
      icon: <FileText size={24} />,
      title: '14. Changes to Terms',
      content: `We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after such changes constitutes acceptance of the modified terms.

We encourage you to review these terms periodically. Material changes will be communicated through:
• Email notifications to registered users
• Prominent notices on our website
• Updates to the "Last Updated" date`
    },
    {
      icon: <FileText size={24} />,
      title: '15. Contact Information',
      content: `For questions, concerns, or inquiries regarding these terms and conditions, please contact us:

NIICT (Nihanshi Institute of Information and Computer Technology)
Address: Janghai Station Road, Besides Nagrik Degree College, Janghai Jaunpur (U.P)
Email: niict01@gmail.com
Phone: +91 8182838680

We will respond to your inquiries within a reasonable timeframe.`
    }
  ];

  return (
    <motion.div 
      className="terms-conditions-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section className="terms-hero" variants={itemVariants}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div className="hero-icon" variants={itemVariants}>
            <Scale size={48} />
          </motion.div>
          <motion.h1 className="hero-title gradient-text" variants={itemVariants}>
            Terms and Conditions
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Please read these terms carefully before using our services
          </motion.p>
          <motion.p className="hero-description" variants={itemVariants}>
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section className="terms-content-section">
        <div className="section-container">
          <div className="terms-content">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="terms-section glass"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="section-header">
                  <div className="section-icon">{section.icon}</div>
                  <h2 className="section-title">{section.title}</h2>
                </div>
                <div className="section-content">
                  {section.content.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className="content-paragraph">
                      {line.trim() || '\u00A0'}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact CTA */}
      <motion.section className="terms-cta" variants={itemVariants}>
        <div className="cta-container glass">
          <div className="cta-content">
            <Scale size={40} className="cta-icon" />
            <h2 className="cta-title gradient-text">
              Questions About Terms?
            </h2>
            <p className="cta-description">
              If you have any questions or need clarification about our terms and conditions, 
              please feel free to contact us.
            </p>
            <div className="cta-contact">
              <p><strong>Email:</strong> niict01@gmail.com</p>
              <p><strong>Phone:</strong> +91 8182838680</p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default TermsAndConditions;

