// src/App.tsx - ZAPWAY.FI PUBLIC LANDING PAGE v5.0
// THIS IS THE REAL SITE. THE ONE THAT SHOULD BE LIVE.
// The operator panel you saw is a separate protected route (/intel-grid)
// This is the public war machine.

import React from 'react';
import { Hero } from '@/components/Hero';
import { AggressiveButton } from '@/components/Button';
import { GlitchText } from '@/components/GlitchText';
import { AnimatedSection } from '@/components/Section';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion';
import { cn } from '@/lib/utils';

export default function App() {
  return (
    <>
      {/* FORCE FULL BLEED DARK THEME - NO SURVIVORS */}
      <div className="min-h-screen bg-void text-white overflow-hidden">
        {/* HERO - PURE VIOLENCE */}
        <Hero />

        {/* EXECUTION STATS */}
        <AnimatedSection delay={0.2} className="py-32">
          <div className="container-zap text-center">
            <GlitchText className="text-6xl md:text-8xl font-black text-surge mb-16">
              THE HOUSE IS BLEEDING
            </GlitchText>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="card-carved p-12 glow-surge-md">
                <h3 className="text-7xl font-black text-blood glitch" data-text="27">27</h3>
                <p className="text-2xl mt-6 uppercase tracking-wider">Casinos Executed<br/>2025</p>
              </div>
              <div className="card-carved p-12 glow-surge-md">
                <h3 className="text-7xl font-black text-blood glitch" data-text="$426K">$426K</h3>
                <p className="text-2xl mt-6 uppercase tracking-wider">Paid to Swarm<br/>Last Month</p>
              </div>
              <div className="card-carved p-12 glow-surge-md">
                <h3 className="text-7xl font-black text-blood glitch" data-text="+29%">+29%</h3>
                <p className="text-2xl mt-6 uppercase tracking-wider">Biggest Edge<br/>Live Right Now</p>
              </div>
            </div>

            <div className="mt-20">
              <AggressiveButton size="huge" className="text-3xl px-24 py-10">
                ARM YOURSELF - ENTER GRID
              </AggressiveButton>
            </div>
          </div>
        </AnimatedSection>

        {/* DEAD CASINO GRAVEYARD TEASER */}
        <AnimatedSection delay={0.4} className="py-32 bg-void-deep/50">
          <div className="container-zap text-center">
            <GlitchText className="text-5xl md:text-7xl font-black text-blood">
              YOUR FAVORITE CASINO<br/>IS NEXT
            </GlitchText>
            <p className="text-2xl mt-8 text-text-secondary max-w-4xl mx-auto">
              Stake. BC.Game. Rollbit. Roobet.<br/>
              They're all on the list. The swarm is coming.
            </p>
            <AggressiveButton size="huge" variant="inverse" className="mt-12 text-2xl">
              ENTER THE GRAVEYARD
            </AggressiveButton>
          </div>
        </AnimatedSection>

        {/* AGGRESSIVE FAQ - ELECTRIC ACCORDION */}
        <AnimatedSection delay={0.6} className="py-32">
          <div className="container-zap">
            <GlitchText className="text-6xl md:text-8xl font-black text-center text-surge mb-20">
              WHY CASINOS FEAR ZAP
            </GlitchText>

            <div className="max-w-5xl mx-auto">
              <Accordion type="multiple">
                <AccordionItem value="1">
                  <AccordionTrigger>WHAT THE FUCK IS ZAP?</AccordionTrigger>
                  <AccordionContent>
                    The decentralized intelligence network that exposes rigged RTP, hidden fees, and selective scamming. 
                    We don't review casinos. We execute them in public when they fuck with players.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="2">
                  <AccordionTrigger>HOW DO YOU MAKE MONEY?</AccordionTrigger>
                  <AccordionContent>
                    Affiliate commissions from traffic to vetted platforms. 30% of every dollar goes straight to the swarm as SSP rewards.
                    We only win when you keep winning. That's why casinos hate us.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="3">
                  <AccordionTrigger>CAN CASINOS BUY BETTER SCORES?</AccordionTrigger>
                  <AccordionContent>
                    Try it and we'll publish the bribe attempt, veto you instantly, and cut your revenue feed.
                    We've done it three times already. Want to be #4?
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="4">
                  <AccordionTrigger>WHY IS THE SITE SO AGGRESSIVE?</AccordionTrigger>
                  <AccordionContent>
                    Because the industry is predatory garbage and "professional" sites are paid shills.
                    We refuse to play nice with criminals.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </AnimatedSection>

        {/* FINAL CTA - NO MERCY */}
        <section className="py-40 bg-gradient-to-b from-void via-void-deep to-void">
          <div className="container-zap text-center">
            <GlitchText className="text-8xl md:text-9xl font-black text-blood">
              PLUG IN OR PERISH
            </GlitchText>
            <p className="text-3xl mt-12 text-surge glow-surge-lg">
              The swarm is recruiting.
            </p>
            <AggressiveButton size="huge" className="mt-16 text-4xl px-32 py-12">
              JOIN ZAP - BECOME UNSTOPPABLE
            </AggressiveButton>
          </div>
        </section>
      </div>
    </>
  );
}