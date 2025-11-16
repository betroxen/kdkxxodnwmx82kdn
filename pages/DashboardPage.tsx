import React from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES ---

// 1. Mock Icons (lucide-react equivalents)
const Icons = {
    Shield: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>),
    Users: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 17v-2a4 4 0 0 0-4-4h-2"/><path d="M20 7h-2"/></svg>),
    Zap: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    Target: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
    ArrowRight: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>),
    Activity: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>),
    Wallet: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v2a1 1 0 0 0 1 1h2"/><path d="M15 9h1"/></svg>),
    Gauge: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>),
    Check: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
    Info: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>),
};

// 2. Placeholder Button Component
const Button: React.FC<any> = ({ children, className, onClick, variant, size = 'md' }) => {
    const baseStyle = "font-bold rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50";
    const sizeStyle = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
    
    let colorStyle = 'bg-neon-surge text-black hover:bg-neon-surge/80 shadow-[0_0_10px_rgba(0,255,192,0.3)]';
    if (variant === 'ghost') {
        colorStyle = 'bg-transparent text-text-secondary hover:text-white hover:bg-foundation-light/50';
    } else if (variant === 'secondary') {
        colorStyle = 'bg-[#333] text-white hover:bg-[#444] border border-neon-surge/30';
    }

    return (
        <button
            type="button"
            className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// 3. Placeholder Card Component
const Card: React.FC<React.PropsWithChildren<{ className?: string, onClick?: () => void }>> = ({ children, className, onClick }) => (
    <div 
        className={`bg-foundation-dark/70 backdrop-blur-sm border border-neon-surge/20 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${onClick ? 'hover:shadow-[0_0_20px_rgba(0,255,192,0.5)] cursor-pointer' : ''} ${className}`}
        onClick={onClick}
    >
        {children}
    </div>
);

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---

// --- Dashboard Data ---

const coreProtocols = [
    { 
        icon: Icons.Shield, 
        title: "ZK-Rollup Security", 
        description: "Every result is secured and proven by zero-knowledge proofs on a Layer 2 solution. Trust the math, not the operator.",
        imgSrc: "https://placehold.co/800x400/0f172a/00FFC0?text=ZK-PROTOCOL+ONLINE",
    },
    { 
        icon: Icons.Users, 
        title: "XAI Ethical Compliance", 
        description: "Our Explainable AI (XAI) framework provides automated Responsible Gaming (RG) interventions and transparent risk scoring.",
        imgSrc: "https://placehold.co/800x400/0f172a/00FFC0?text=XAI+COMPLIANCE+ACTIVE",
    },
    { 
        icon: Icons.Zap, 
        title: "Degen Rewards Protocol", 
        description: "Earn Zap Points for network contribution, verifiable transparency checks, and mission completion. Loyalty is coded, not assumed.",
        imgSrc: "https://placehold.co/800x400/0f172a/00FFC0?text=DEGEN+REWARDS+LIVE",
    },
    { 
        icon: Icons.Target, 
        title: "Syndicate Missions", 
        description: "Access exclusive high-value contracts and collaborative tasks. Achieve verifiable objectives, earn crypto, and boost your Operator rank.",
        imgSrc: "https://placehold.co/800x400/0f172a/00FFC0?text=MISSION+CONTROL+READY",
    },
];

const activityLogs = [
    { time: '0m', message: 'System Health Check: OK', type: 'info' },
    { time: '1m', message: 'User 0x4B...B0 initiated ZK-Proof Request.', type: 'success' },
    { time: '3m', message: 'Mission [ALPHA-17] completed by Operator 0xCF...2A.', type: 'success' },
    { time: '5m', message: 'Warning: High latency detected in shard 3.', type: 'warning' },
    { time: '7m', message: 'Received 50 ZP reward for VPR contribution.', type: 'success' },
];

const pendingMissions = [
    { id: 1, title: 'Audit Protocol 7', reward: '750 ZP', difficulty: 'High' },
    { id: 2, title: 'Deploy Shard 9 Fix', reward: '1,200 ZP', difficulty: 'Critical' },
];


// --- Sub-Components ---

// Dashboard Widget (Large card for Protocols)
const DashboardWidget: React.FC<{ icon: React.FC<any>, title: string, description: string, imgSrc: string }> = ({ icon: Icon, title, description, imgSrc }) => (
    <Card className="p-0 overflow-hidden group relative flex flex-col h-[400px]">
        
        {/* Background Image (Replaces video) */}
        <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-110"
            style={{backgroundImage: `url(${imgSrc})`}}
            role="img"
            aria-label={`Visual representation of ${title}`}
        ></div>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-foundation-dark/90 via-foundation-dark/60 to-transparent z-10"></div>

        <div className="relative z-20 flex flex-col justify-end h-full p-6 text-white">
             <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neon-surge/10 border border-neon-surge/30 transition-colors duration-300 group-hover:bg-neon-surge/20">
                <Icon className="h-6 w-6 text-neon-surge transition-transform duration-500 group-hover:rotate-12" />
              </div>
            <h3 className="font-orbitron text-xl font-bold uppercase tracking-wider text-shadow-neon">{title}</h3>
            <p className="text-sm text-text-secondary mt-2 font-jetbrains-mono">{description}</p>
            <Button variant="ghost" size="sm" className="mt-4 self-start font-orbitron uppercase tracking-wider !px-0 text-neon-surge hover:text-white">
                View Protocol <Icons.ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </Card>
);

// Operator Status Widget (Small stats panel)
const OperatorStatusWidget: React.FC = () => (
    <Card className="p-6">
        <h2 className="font-orbitron text-lg font-bold uppercase tracking-wide text-white border-b border-[#333] pb-3 mb-4 flex items-center gap-2">
            <Icons.Gauge className="h-5 w-5 text-neon-surge" /> Operator Status
        </h2>
        
        <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-jetbrains-mono">
                <span className="text-text-secondary">RANK / LEVEL:</span>
                <span className="text-white font-bold text-lg text-neon-surge">LVL 42</span>
            </div>
            <div className="flex items-center justify-between text-sm font-jetbrains-mono">
                <span className="text-text-secondary">ZAP BALANCE:</span>
                <span className="text-white font-bold text-lg flex items-center gap-1">
                    12,400 <Icons.Zap className="h-4 w-4 text-neon-surge" />
                </span>
            </div>
            <div className="flex items-center justify-between text-sm font-jetbrains-mono">
                <span className="text-text-secondary">WALLET ID (TRUNC.):</span>
                <span className="text-white font-bold text-sm">0x4B...B07</span>
            </div>
        </div>

        <Button className="w-full mt-6 font-orbitron uppercase">
            Access Terminal
        </Button>
    </Card>
);

// Network Activity Feed Widget
const ActivityFeedWidget: React.FC = () => (
    <Card className="p-6 h-full">
        <h2 className="font-orbitron text-lg font-bold uppercase tracking-wide text-white border-b border-[#333] pb-3 mb-4 flex items-center gap-2">
            <Icons.Activity className="h-5 w-5 text-red-500" /> Network Activity
        </h2>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {activityLogs.map((log, index) => {
                let colorClass = 'text-neon-surge';
                let Icon = Icons.Info;

                if (log.type === 'success') {
                    colorClass = 'text-green-400';
                    Icon = Icons.Check;
                } else if (log.type === 'warning') {
                    colorClass = 'text-yellow-400';
                    Icon = Icons.AlertTriangle;
                }
                
                return (
                    <div key={index} className="flex justify-between items-center text-xs font-jetbrains-mono border-l-2 border-neon-surge/50 pl-3">
                        <div className="flex items-center gap-2">
                            <Icon className={`h-3 w-3 ${colorClass} flex-shrink-0`} />
                            <span className="text-text-secondary line-clamp-1">{log.message}</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold text-text-tertiary flex-shrink-0`}>{log.time} AGO</span>
                    </div>
                );
            })}
        </div>
    </Card>
);

// Pending Missions Widget
const PendingMissionsWidget: React.FC = () => (
    <Card className="p-6 h-full">
        <h2 className="font-orbitron text-lg font-bold uppercase tracking-wide text-white border-b border-[#333] pb-3 mb-4 flex items-center gap-2">
            <Icons.Target className="h-5 w-5 text-indigo-400" /> Pending Contracts
        </h2>
        
        <div className="space-y-4">
            {pendingMissions.map((mission) => (
                <div key={mission.id} className="flex items-center justify-between p-3 bg-foundation-light/20 rounded-lg border border-neon-surge/10">
                    <div>
                        <p className="font-orbitron text-sm font-bold text-white uppercase">{mission.title}</p>
                        <p className={`text-xs mt-1 font-jetbrains-mono ${mission.difficulty === 'Critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                            Difficulty: {mission.difficulty}
                        </p>
                    </div>
                    <Button size="sm" variant="secondary" className="flex items-center gap-2 flex-shrink-0">
                        ACCEPT ({mission.reward})
                    </Button>
                </div>
            ))}
        </div>
        
        <div className="mt-4 text-center">
             <Button variant="ghost" size="sm" className="font-orbitron uppercase text-text-secondary hover:text-white">
                View All Missions <Icons.ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </Card>
);


// --- Main Component ---
const DashboardPage: React.FC = () => {
  return (
    <>
      {/* Custom CSS for neon text shadow and scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-shadow-neon {
            text-shadow: 0 0 5px rgba(0, 255, 192, 0.5), 0 0 10px rgba(0, 255, 192, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #00FFC0;
            border-radius: 10px;
            border: 2px solid #1e293b;
        }
      `}} />
      
      <div className="animate-fadeIn pb-12">
        <h1 className="font-orbitron text-4xl font-extrabold text-white mb-2 uppercase tracking-widest text-shadow-neon">Command Center</h1>
        <p className="text-neon-surge mb-8 font-jetbrains-mono text-sm">// Welcome back, Operator. Systems are online and nominal. Target acquisition is ready.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Sidebar / Status Column (Col span 12 / md:span 4) */}
            <div className="lg:col-span-4 space-y-6">
                <OperatorStatusWidget />
                
                <Card className="p-6">
                    <h2 className="font-orbitron text-lg font-bold uppercase tracking-wide text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="text-center font-orbitron">DEPOSIT</Button>
                        <Button variant="secondary" className="text-center font-orbitron">WITHDRAW</Button>
                        <Button variant="secondary" className="col-span-2 font-orbitron">VIEW WALLET <Icons.Wallet className="ml-2 h-4 w-4 inline" /></Button>
                    </div>
                </Card>
            </div>
            
            {/* Main Protocols / Feature Cards (Col span 12 / md:span 8) */}
            <div className="lg:col-span-8">
                <h2 className="font-orbitron text-2xl font-bold uppercase tracking-wide text-white mb-4">Core Protocols</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {coreProtocols.map(protocol => (
                        <DashboardWidget 
                            key={protocol.title}
                            icon={protocol.icon}
                            title={protocol.title}
                            description={protocol.description}
                            imgSrc={protocol.imgSrc}
                        />
                    ))}
                </div>
            </div>
            
            {/* Bottom Row / Feed & Missions (Full Width) */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#333333]">
                <div className="md:col-span-1">
                    <ActivityFeedWidget />
                </div>
                <div className="md:col-span-1">
                    <PendingMissionsWidget />
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

