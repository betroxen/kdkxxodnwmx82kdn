import React from 'react';

const CookiesPolicyPage: React.FC = () => {
    return (
        <div className="animate-fadeIn max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-foundation text-text-secondary">
            <header className="text-center mb-12 border-b border-neon-surge/30 pb-6">
                <h1 className="font-orbitron text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    ZAPWAY CORP. LTD. <span className="text-neon-surge">COOKIES POLICY</span>
                </h1>
                <p className="text-text-secondary text-lg sm:text-xl text-center mt-4 font-bold font-rajdhani max-w-3xl mx-auto">
                    Directive: Transparency is Trust. We only use data to power our security and enhance your tactical advantage.
                </p>
            </header>

            <div className="mt-12 space-y-10 text-sm sm:text-base leading-relaxed text-text-secondary font-rajdhani">
                
                <section>
                    <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 tracking-wider border-l-4 border-neon-surge pl-3">1. INFORMATION ABOUT OUR USE OF COOKIES</h2>
                    <p>We use cookies on this website to differentiate you from other users and enhance your browsing experience. This is a requirement for maintaining session integrity, processing transactions, and ensuring compliance with regulatory mandates (GDPR, MiCA, CCPA). For additional information about how we manage personal data, including the use of XAI and VASP data, please refer to our Privacy Policy.</p>
                </section>

                <section>
                    <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 tracking-wider border-l-4 border-neon-surge pl-3">2. WHAT ARE COOKIES?</h2>
                    <p>Cookies are small text files that a website stores on your computer or mobile device when you visit. These files may contain a unique identifier to distinguish your device from others. In this notice, the term "cookies" includes both traditional website cookies and similar technologies that collect information automatically when you visit our site, such as pixel tags and web beacons, which are essential for web service and security integrity.</p>
                </section>

                <section>
                    <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 tracking-wider border-l-4 border-neon-surge pl-3">3. SOURCES AND TYPES OF COOKIES</h2>
                    <p>Cookies are categorized based on placement and duration:</p>
                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Classification by Source */}
                        <div className="p-4 rounded-lg bg-foundation-light/20 border border-white/10">
                            <h3 className="font-bold text-white text-lg mb-2">3.1. Classification by Source</h3>
                             <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                                <li><strong className="text-white">First-Party Cookies:</strong> Set by us (ZapWay) and the information collected is received by us. These are primarily used for site functionality, login state, and security integrity.</li>
                                <li><strong className="text-white">Third-Party Cookies:</strong> Set by external partners we work with (e.g., analytics providers, advertising networks). They may collect data about your use of our website and other online activities across different platforms. These third parties manage their own data under their respective privacy policies.</li>
                            </ul>
                        </div>
                        {/* Classification by Duration */}
                        <div className="p-4 rounded-lg bg-foundation-light/20 border border-white/10">
                            <h3 className="font-bold text-white text-lg mb-2">3.2. Classification by Duration</h3>
                             <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                                <li><strong className="text-white">Persistent Cookies:</strong> These cookies remain on your device between browsing sessions and help remember your preferences or activities across websites. They may be used for purposes such as saving your settings or targeting advertising. They remain until their expiration date or manual deletion.</li>
                                <li><strong className="text-white">Session Cookies:</strong> These cookies are temporary and are deleted when you close your browser. They are critical for security and system efficiency, helping to manage your real-time session, ensuring consistent display, and verifying non-bot activity.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 tracking-wider border-l-4 border-neon-surge pl-3">4. COOKIE CATEGORIES AND PURPOSE</h2>
                    <p>In compliance with GDPR Article 32 and CCPA, we classify the cookies we deploy based on their necessity and function:</p>
                    <div className="mt-6 overflow-x-auto shadow-xl rounded-lg border border-white/10">
                        {/* Table is set to a minimum width to ensure good presentation on smaller screens, forcing horizontal scroll if necessary */}
                        <table className="w-full text-left font-rajdhani border-collapse table-auto min-w-[700px]">
                            <thead className="bg-foundation-light/50 border-b border-neon-surge/50">
                                <tr>
                                    <th className="p-4 text-xs text-white uppercase tracking-wider font-bold">Category</th>
                                    <th className="p-4 text-xs text-white uppercase tracking-wider font-bold">Purpose and Mandate</th>
                                    <th className="p-4 text-xs text-white uppercase tracking-wider font-bold">Necessity</th>
                                    <th className="p-4 text-xs text-white uppercase tracking-wider font-bold">Retention</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333]/50">
                                <tr className="hover:bg-foundation-light/20 transition duration-150">
                                    <td className="p-4 font-bold text-white align-top">Strictly Necessary</td>
                                    <td className="p-4 align-top">Essential for fundamental website operations, security integrity, and session state management (e.g., user authentication, MPC custody handshake, transaction verification).</td>
                                    <td className="p-4 align-top text-neon-surge font-semibold">Mandatory</td>
                                    <td className="p-4 align-top">Session to 1 year</td>
                                </tr>
                                <tr className="hover:bg-foundation-light/20 transition duration-150">
                                    <td className="p-4 font-bold text-white align-top">Performance/Analytics</td>
                                    <td className="p-4 align-top">Measures website performance, load times, and usage patterns. Used to optimize our ZK-Rollup proof submission efficiency and API calls.</td>
                                    <td className="p-4 align-top">Opt-in/Legitimate Interest</td>
                                    <td className="p-4 align-top">Up to 2 years</td>
                                </tr>
                                <tr className="hover:bg-foundation-light/20 transition duration-150">
                                    <td className="p-4 font-bold text-white align-top">Functionality</td>
                                    <td className="p-4 align-top">Remembers User preferences (e.g., language settings, dark/light mode) to enhance user experience and personalized dashboard views.</td>
                                    <td className="p-4 align-top">Opt-in</td>
                                    <td className="p-4 align-top">Up to 1 year</td>
                                </tr>
                                <tr className="hover:bg-foundation-light/20 transition duration-150">
                                    <td className="p-4 font-bold text-white align-top">Targeting/Advertising</td>
                                    <td className="p-4 align-top">Used to build a profile of your interests to show relevant advertisements or promotional content from us or third parties across other sites.</td>
                                    <td className="p-4 align-top">Opt-in/Consent</td>
                                    <td className="p-4 align-top">Up to 1 year</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 tracking-wider border-l-4 border-neon-surge pl-3">5. USER CONTROL AND YOUR RIGHTS</h2>
                    <p>We are committed to providing you with full control over your data, in alignment with global privacy regulations (GDPR, CCPA/CPRA, etc.).</p>
                    <ul className="list-disc list-inside mt-4 space-y-3 pl-4">
                        <li><strong className="text-white">Consent Management:</strong> Upon your first visit, you will be presented with a Consent Management Platform (CMP) allowing you to accept or decline cookies by category (excluding Strictly Necessary cookies).</li>
                        <li><strong className="text-white">Withdrawal of Consent:</strong> You have the right to withdraw your consent to the use of optional cookies at any time. This can typically be managed via the privacy settings link in the website footer or within your browser settings.</li>
                        <li><strong className="text-white">Browser Controls:</strong> You can adjust your browser settings to reject or delete cookies. Note that disabling **Strictly Necessary** cookies will prevent you from accessing secure areas of the ZapWay platform, as we cannot verify your session integrity.</li>
                    </ul>
                </section>

                <footer className="border-t border-neon-surge/50 pt-8 text-xs text-text-secondary font-jetbrains-mono">
                    <p className="font-bold text-white">Zapway Corp. LTD</p>
                    <p>Integrity is the Code. Last Updated: [Insert Date]</p>
                </footer>
            </div>
        </div>
    );
};

export default CookiesPolicyPage;

