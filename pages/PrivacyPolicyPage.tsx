import React, { useState, useEffect } from 'react';

// Define the structure for the sections to create the TOC and link IDs easily.
const privacySections = [
    { id: 'introduction', title: '1. INTRODUCTION & DATA CONTROLLER' },
    { id: 'grounds', title: '2. LAWFUL GROUNDS FOR PROCESSING' },
    { id: 'collection', title: '3. DATA COLLECTION: WHAT WE TRACK' },
    { id: 'rights', title: '4. DATA SUBJECT RIGHTS (GDPR)' },
    { id: 'automated', title: '5. AUTOMATED DECISION-MAKING & XAI AUDIT' },
    { id: 'security', title: '6. DATA SECURITY, RETENTION & IMMUTABILITY' },
    { id: 'transfer', title: '7. INTERNATIONAL DATA TRANSFERS' },
];

// Helper component for the TOC link list
const PrivacyTOC: React.FC<{ activeId: string }> = ({ activeId }) => (
    <nav className="p-4 bg-foundation-light rounded-xl border border-neon-surge/20 shadow-neon-card custom-scrollbar overflow-x-auto whitespace-nowrap">
        <p className="font-orbitron text-sm font-bold text-neon-surge mb-3 uppercase tracking-wider hidden md:block">Document Index</p>
        <div className="flex space-x-4 md:space-x-0 md:flex-col md:space-y-2">
            {privacySections.map((section) => (
                <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block text-xs font-jetbrains-mono transition-colors duration-200 p-1 md:p-0.5 rounded-md ${
                        activeId === section.id
                            ? 'text-neon-surge font-bold underline underline-offset-4 decoration-2 decoration-neon-surge'
                            : 'text-text-secondary hover:text-white/80'
                    }`}
                    // Ensure smooth scrolling behavior
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    {section.title.split('. ')[0]}. {section.title.split('. ')[1]}
                </a>
            ))}
        </div>
    </nav>
);

const PrivacyPolicyPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        // Observer to track which section is currently in the viewport for the TOC highlighting
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                // The root margin pulls the trigger point slightly above the center
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0, // Even a tiny bit of the element in the rootMargin box will trigger
            }
        );

        privacySections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-foundation p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* -------------------- Fixed/Sticky TOC on Desktop -------------------- */}
                <div className="md:col-span-1 hidden md:block sticky top-8 h-fit animate-fadeIn">
                    <PrivacyTOC activeId={activeSection} />
                </div>

                {/* -------------------- Main Content Area -------------------- */}
                <div className="md:col-span-3 animate-fadeIn text-text-secondary space-y-10">

                    {/* Header */}
                    <header className="pb-4 border-b border-neon-surge/30">
                        <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-white text-center md:text-left">
                            PRIVACY AND <span className="text-neon-surge">GDPR COMPLIANCE POLICY (v2.0)</span>
                        </h1>
                        <p className="text-text-tertiary text-sm text-center md:text-left mt-2 font-jetbrains-mono">Effective Date: 2025-11-13</p>
                        <p className="text-text-secondary text-lg text-center md:text-left mt-4 font-bold max-w-2xl mx-auto md:mx-0">
                            Mandate: Ethical Practices & Verifiable Trust. Player data is sacrosanct.
                        </p>
                    </header>
                    
                    {/* TOC on Mobile (appears below header) */}
                    <div className="md:hidden">
                        <PrivacyTOC activeId={activeSection} />
                    </div>

                    <div className="mt-12 space-y-8 text-sm leading-relaxed">
                        
                        <section id="introduction" className="pt-4">
                            <h2 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wider">1. INTRODUCTION & DATA CONTROLLER</h2>
                            <p>ZapWay Corp. LTD. (the "Data Controller") is committed to protecting your personal data with the same rigor we apply to our ZK-Rollups. This Policy outlines our data processing practices in compliance with the EU General Data Protection Regulation (GDPR) and other relevant privacy laws.</p>
                             <div className="mt-4 bg-foundation-light border border-neon-surge/30 rounded-lg p-4 text-xs font-jetbrains-mono shadow-neon-card">
                                <p><span className="font-bold text-neon-surge">Name:</span> ZapWay Corp. LTD.</p>
                                <p><span className="font-bold text-neon-surge">Registered Address:</span> San Isidro de El General Costa Rica 11901 San José</p>
                                <p><span className="font-bold text-neon-surge">Data Protection Officer (DPO) Email:</span> dpo@zapway.corp</p>
                            </div>
                        </section>

                         <section id="grounds" className="pt-4">
                            <h2 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wider">2. LAWFUL GROUNDS FOR PROCESSING</h2>
                            <p>We only process your data when we have an explicit, recognized legal basis. No exceptions.</p>
                            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                                <li><strong className="text-neon-surge">Contractual Necessity (GDPR Art. 6(1)(b)):</strong> Data processing essential to deliver the Services (e.g., account management, wallet connectivity, transaction finality).</li>
                                <li><strong className="text-neon-surge">Legal Obligation (GDPR Art. 6(1)(c)):</strong> Mandatory processing for compliance with legal mandates (e.g., KYC/AML checks, tax reporting, regulatory record-keeping).</li>
                                <li><strong className="text-neon-surge">Legitimate Interests (GDPR Art. 6(1)(f)):</strong> Processing necessary for our business operations, provided your rights and freedoms are not overridden (e.g., network security, service optimization, internal auditing).</li>
                                <li><strong className="text-neon-surge">Consent (GDPR Art. 6(1)(a)):</strong> Processing for specific activities, like non-essential marketing communications, where explicit, informed consent is obtained and can be easily withdrawn.</li>
                            </ul>
                        </section>

                        <section id="collection" className="pt-4">
                            <h2 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wider">3. DATA COLLECTION: WHAT WE TRACK</h2>
                            <p>We collect and process the following categories of data, which are necessary to power our verifiable, compliant platform:</p>
                            <div className="mt-4 overflow-x-auto border border-foundation-lighter rounded-lg">
                                <table className="w-full text-left font-jetbrains-mono border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="border-b-2 border-neon-surge/50 bg-foundation-light">
                                            <th className="p-3 text-xs text-white uppercase tracking-wider">Data Category</th>
                                            <th className="p-3 text-xs text-white uppercase tracking-wider">Examples of Data Collected</th>
                                            <th className="p-3 text-xs text-white uppercase tracking-wider">Primary Purpose</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-foundation-lighter">
                                        <tr className="hover:bg-foundation-lighter/50">
                                            <td className="p-3 font-bold align-top text-neon-surge">Identity & Contact</td>
                                            <td className="p-3 align-top">Full Name, Date of Birth, Address, Email, KYC/AML documents.</td>
                                            <td className="p-3 align-top">Legal Obligation (KYC/AML), Contractual Necessity.</td>
                                        </tr>
                                        <tr className="hover:bg-foundation-lighter/50">
                                            <td className="p-3 font-bold align-top text-neon-surge">Blockchain/Financial</td>
                                            <td className="p-3 align-top">Public Wallet Address, Deposit/Withdrawal History, L2 Transaction Logs.</td>
                                            <td className="p-3 align-top">Contractual Necessity, Legal Obligation (AML).</td>
                                        </tr>
                                        <tr className="hover:bg-foundation-lighter/50">
                                            <td className="p-3 font-bold align-top text-neon-surge">Behavioral/Gaming</td>
                                            <td className="p-3 align-top">Wager amounts, Game results, Loss limits, Session duration, Time stamps.</td>
                                            <td className="p-3 align-top">Responsible Gaming (XAI), Service Improvement.</td>
                                        </tr>
                                        <tr className="hover:bg-foundation-lighter/50">
                                            <td className="p-3 font-bold align-top text-neon-surge">Technical/Device</td>
                                            <td className="p-3 align-top">IP Address, Device Fingerprint, Browser Type, Geolocation Data.</td>
                                            <td className="p-3 align-top">Security, Fraud Prevention, Legal Obligation (Jurisdiction Checks).</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="rights" className="pt-4">
                            <h2 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wider">4. DATA SUBJECT RIGHTS (GDPR)</h2>
                            <p>You retain full control over your data. To exercise any of these rights, contact our DPO using the details in Section 1.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                                <li><strong className="text-text-primary">Right to Access:</strong> You can request confirmation of the data we hold and receive a copy.</li>
                                <li><strong className="text-text-primary">Right to Rectification:</strong> You can correct inaccurate or incomplete non-transactional data.</li>
                                <li className="text-warning-low/90 p-2 bg-foundation-lighter/50 rounded-md border border-warning-low/30">
                                    <strong className="text-warning-low">Right to Erasure ('Right to be Forgotten'):</strong> You may request the deletion of your data. Crucially, this right is overridden by legal and regulatory retention requirements (e.g., AML mandates require data retention for a minimum of five (5) years). Data recorded on a public blockchain (L1/L2) **cannot be erased** due to the immutable nature of the ledger.
                                </li>
                                <li><strong className="text-text-primary">Right to Restriction of Processing:</strong> You can restrict how we use your personal data.</li>
                                <li><strong className="text-text-primary">Right to Data Portability:</strong> You can request your data in a structured, commonly used, machine-readable format.</li>
                                <li><strong className="text-text-primary">Right to Object:</strong> You can object to processing based on our legitimate interests or for direct marketing.</li>
                            </ul>
                        </section>

                        <section id="automated" className="pt-4">
                            <h2 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wider">5. AUTOMATED DECISION-MAKING & XAI AUDIT (GDPR ART. 22)</h2>
                            <p>We use automated decision-making to protect You and maintain compliance. This is non-negotiable.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                                <li><strong className="text-text-primary">Profiling Criteria:</strong> Our Explainable AI (XAI) system profiles risk based on your Behavioral/Gaming Data (e.g., rapid consecutive wagers, high loss rate relative to deposits, sudden changes in session duration).</li>
                                <li><strong className="text-text-primary">Interventions:</strong> Automated decisions include real-time RG interventions such as: mandatory deposit limits, cooling-off periods, and temporary account suspension.</li>
                                <li className="text-neon-surge/90 p-2 bg-foundation-lighter/50 rounded-md border border-neon-surge/30">
                                    <strong className="text-neon-surge">Audit and Appeal:</strong> Every automated decision is auditable, transparent, and explained to the User upon request. You have the **absolute right** to request human intervention, express your point of view, and contest the automated decision.
                                </li>
                            </ul>
                        </section>

                        <section id="security" className="pt-4">
                            <h2 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wider">6. DATA SECURITY, RETENTION & IMMUTABILITY</h2>
                             <div className="mt-4 space-y-3 border-l-2 border-neon-surge/50 pl-4">
                                <div>
                                    <h3 className="font-bold text-text-primary">6.1. Security</h3>
                                    <p>We employ advanced technical and organizational security measures. This includes end-to-end encryption, secure data compartmentalization, and the use of cutting-edge Multi-Party Computation (MPC) protocols to secure sensitive data handling.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">6.2. Data Retention</h3>
                                    <p>We retain data only as long as necessary. Due to global regulatory requirements (e.g., AML), financial and identity data must be retained for a minimum of five (5) years after account closure.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">6.3. Blockchain Immutability</h3>
                                    <p className="font-bold text-warning-low">You acknowledge that data committed to the underlying Layer 2 ZK-Rollup, including transaction details and outcome proofs, cannot be deleted, modified, or permanently removed from the chain due to the fundamental, immutable nature of blockchain technology.</p>
                                </div>
                            </div>
                        </section>

                        <section id="transfer" className="pt-4">
                            <h2 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wider">7. INTERNATIONAL DATA TRANSFERS</h2>
                            <p>As a global platform, your data may be transferred to and processed in countries outside the European Economic Area (EEA). We ensure that any such transfers comply with GDPR by implementing appropriate safeguards, such as Standard Contractual Clauses (SCCs), to guarantee that your data is treated securely and in accordance with this Policy.</p>
                        </section>

                         <div className="border-t border-neon-surge/30 pt-6 text-xs text-text-tertiary font-jetbrains-mono">
                            <p className="font-bold">Zapway Corp. LTD</p>
                            <p>Registered Address: San Isidro de El General Costa Rica 11901 San José</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;

