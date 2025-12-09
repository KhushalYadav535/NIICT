import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, AlertCircle } from 'lucide-react';

function PrivacyPolicy() {
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
      title: '1. Introduction',
      content: `Welcome to NIICT (Nihanshi Institute of Information and Computer Technology). 
      We are committed to protecting your privacy and ensuring the security of your personal information. 
      This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
      visit our website or use our services. By using our services, you consent to the practices described 
      in this policy.`
    },
    {
      icon: <Eye size={24} />,
      title: '2. Information We Collect',
      content: `We collect information that you provide directly to us, including:
      
• Personal Information: Name, email address, phone number, postal address, date of birth, and other identification details
• Educational Information: Academic qualifications, course preferences, enrollment details, and educational records
• Payment Information: Billing address, payment method details (processed securely through third-party payment processors)
• Communication Data: Correspondence with us via email, phone, or chat
• Technical Information: IP address, browser type, device information, and usage patterns when you visit our website
• Cookies and Tracking: We use cookies and similar technologies to enhance your experience and analyze website traffic`
    },
    {
      icon: <Shield size={24} />,
      title: '3. How We Use Your Information',
      content: `We use the collected information for the following purposes:

• To provide and maintain our educational services and courses
• To process admissions, enrollments, and manage student records
• To communicate with you about courses, updates, and administrative matters
• To process payments and manage financial transactions
• To improve our website, services, and user experience
• To send promotional materials, newsletters, and updates (with your consent)
• To comply with legal obligations and resolve disputes
• To protect our rights and prevent fraudulent activities
• To analyze usage patterns and conduct research for service improvement`
    },
    {
      icon: <Lock size={24} />,
      title: '4. Information Sharing and Disclosure',
      content: `We do not sell your personal information. We may share your information only in the following circumstances:

• With your explicit consent
• With service providers who assist us in operating our website and conducting our business (payment processors, hosting services, email services)
• With educational partners and institutions for certification or accreditation purposes
• When required by law or to respond to legal processes
• To protect our rights, property, or safety, or that of our students and users
• In connection with a merger, acquisition, or sale of assets (with prior notice to users)`
    },
    {
      icon: <Shield size={24} />,
      title: '5. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information:

• Encryption of sensitive data during transmission (SSL/TLS)
• Secure storage of data with access controls
• Regular security assessments and updates
• Limited access to personal information on a need-to-know basis
• Employee training on data protection and privacy

However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`
    },
    {
      icon: <FileText size={24} />,
      title: '6. Your Rights and Choices',
      content: `You have the following rights regarding your personal information:

• Access: Request access to your personal information we hold
• Correction: Request correction of inaccurate or incomplete information
• Deletion: Request deletion of your personal information (subject to legal and contractual obligations)
• Objection: Object to processing of your personal information for certain purposes
• Data Portability: Request a copy of your data in a structured, machine-readable format
• Withdrawal of Consent: Withdraw consent for data processing where consent is the basis for processing
• Opt-out: Unsubscribe from marketing communications at any time

To exercise these rights, please contact us using the information provided in the Contact section.`
    },
    {
      icon: <Eye size={24} />,
      title: '7. Cookies and Tracking Technologies',
      content: `We use cookies and similar technologies to:

• Remember your preferences and settings
• Analyze website traffic and usage patterns
• Provide personalized content and advertisements
• Improve website functionality and user experience

You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.`
    },
    {
      icon: <FileText size={24} />,
      title: '8. Third-Party Links',
      content: `Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.`
    },
    {
      icon: <AlertCircle size={24} />,
      title: '9. Children\'s Privacy',
      content: `Our services are intended for individuals who are at least 13 years of age. We do not knowingly collect personal information from children under 13 without parental consent. If we become aware that we have collected information from a child under 13, we will take steps to delete such information promptly.`
    },
    {
      icon: <FileText size={24} />,
      title: '10. Data Retention',
      content: `We retain your personal information only for as long as necessary to:

• Fulfill the purposes for which it was collected
• Comply with legal, accounting, or reporting requirements
• Resolve disputes and enforce our agreements

Student records may be retained longer as required by educational regulations and accreditation requirements.`
    },
    {
      icon: <FileText size={24} />,
      title: '11. Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by:

• Posting the updated policy on our website with a revised "Last Updated" date
• Sending an email notification to registered users (where applicable)
• Displaying a prominent notice on our website

Your continued use of our services after such changes constitutes acceptance of the updated policy.`
    },
    {
      icon: <Lock size={24} />,
      title: '12. Contact Us',
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

NIICT (Nihanshi Institute of Information and Computer Technology)
Address: Janghai Station Road, Besides Nagrik Degree College, Janghai Jaunpur (U.P)
Email: niict01@gmail.com
Phone: +91 8182838680

We will respond to your inquiries within a reasonable timeframe.`
    }
  ];

  return (
    <motion.div 
      className="privacy-policy-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section className="privacy-hero" variants={itemVariants}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div className="hero-icon" variants={itemVariants}>
            <Shield size={48} />
          </motion.div>
          <motion.h1 className="hero-title gradient-text" variants={itemVariants}>
            Privacy Policy
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Your privacy and data security are our top priorities
          </motion.p>
          <motion.p className="hero-description" variants={itemVariants}>
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section className="privacy-content-section">
        <div className="section-container">
          <div className="privacy-content">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="privacy-section glass"
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
      <motion.section className="privacy-cta" variants={itemVariants}>
        <div className="cta-container glass">
          <div className="cta-content">
            <Shield size={40} className="cta-icon" />
            <h2 className="cta-title gradient-text">
              Questions About Privacy?
            </h2>
            <p className="cta-description">
              If you have any questions or concerns about our privacy practices, 
              please don't hesitate to contact us.
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

export default PrivacyPolicy;

