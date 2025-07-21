'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import Link from 'next/link';
import { HeroPill } from './hero-pill';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

type Mode = 'light' | 'dark';

interface Props {
  mode: Mode;
}

export const Component = ({ mode }: Props) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handlePillClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === '' || !email.includes('@') || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        console.error('Failed to submit to waitlist');
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailValid = email.trim() !== '' && email.includes('@') && !isSubmitting;

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">

      {/* Header with Logo and Theme Toggle - Industry standard positioning */}
      <header className="relative z-20 w-full flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between py-2 sm:py-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex-shrink-0"
            >
              <Logo
                width={140}
                height={36}
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="flex-shrink-0"
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content - Centered with responsive spacing */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md mx-auto">

      {!showForm ? (
          // Initial state - show description and announcement button
          <div className="space-y-6">
            {/* Description Text */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="text-center space-y-3"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base sm:text-lg leading-relaxed`}
              >
                Thumboard is an AI-powered search and insights platform for YouTube thumbnails.
              </motion.p>
            </motion.div>

            {/* Hero Pill Button */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.6
              }}
              className="flex items-center justify-center"
            >
              <HeroPill
                href="#waitlist"
                label="Join the waitlist for early access"
                announcement="🚀 Beta"
                isExternal={false}
                onClick={handlePillClick}
              />
            </motion.div>
          </div>
      ) : (
          // Form state - show description, pill above form
          <div className="space-y-6">
            {/* Description Text */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="text-center space-y-3"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base sm:text-lg leading-relaxed`}
              >
                Thumboard is an AI-powered search and insights platform for YouTube thumbnails.
              </motion.p>

            </motion.div>

            {/* Hero Pill Button */}
            <motion.div
              initial={{ y: 0, scale: 1 }}
              animate={{ y: -20, scale: 0.95 }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 80,
                damping: 20
              }}
              className="mb-4 flex justify-center"
            >
              <HeroPill
                href="#waitlist"
                label="Join the waitlist for early access"
                announcement="🚀 Beta"
                isExternal={false}
              />
            </motion.div>

            <InView triggerOnce threshold={0.5}>
              {({ inView, ref }) => (
                <motion.div
                  id="waitlist-form"
                  ref={ref}
                  className={`${mode === 'dark' ? 'bg-black/80 border border-zinc-600 backdrop-blur-sm' : 'bg-white/80 border border-gray-200 backdrop-blur-sm'} w-full rounded-xl ${submitted ? 'p-1' : 'p-4'} shadow-2xl`}
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 1.0,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 0.3,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
            {!submitted ? (
              <div>
                <div className="text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className={`${mode === 'dark' ? 'text-white' : 'text-gray-800'} text-2xl font-bold mb-3`}
                  >
                    Join Thumboard Waitlist
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.7,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4`}
                  >
                    Be the first to access Thumboard&apos;s visual content discovery platform. Enter your email below to join the waitlist.
                  </motion.p>
                </div>
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.9,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="flex items-center justify-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 w-full bg-white appearance-none rounded-l-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button
                    type="submit"
                    disabled={!isEmailValid}
                    className={`bg-black text-white py-[6px] px-6 rounded-r-full focus:outline-none ${isEmailValid ? 'cursor-pointer hover:bg-opacity-90 border border-zinc-300' : 'cursor-not-allowed'} ${!isEmailValid && 'border border-zinc-300'}`}
                  >
                    {isSubmitting ? 'Joining...' : 'Join'}
                  </motion.button>
                </motion.form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <motion.h2
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`${mode === 'dark' ? 'text-white' : 'text-gray-800'} text-2xl font-bold mb-4 mt-8`}
                >
                  You are on the waitlist
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}
                >
                  Thank you for using Thumboard.<br /> We&apos;ll keep you updated.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`${mode === 'dark' ? 'text-gray-300' : 'text-slate-800'} size-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
              </motion.div>
            )}
          </InView>

          {/* Browse Content Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-4"
          >
            {/* <Link
              href="/search"
              className={`${mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-sm underline transition-colors duration-200`}
            >
              Or browse existing content →
            </Link> */}
          </motion.div>
        </div>
      )}
        </div>
      </main>

      {/* Footer with Credits */}
      <footer className="relative z-10 w-full py-4 px-4 sm:px-6 lg:px-8 flex-shrink-0">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>
              Fun Project by{' '}
              <a
                href="https://linkedin.com/in/-mihirjadhav"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} font-bold transition-colors duration-200`}
              >
                Mihir
              </a>
              {' '}&{' '}
              <a
                href="https://x.com/@heydebashis"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} font-bold transition-colors duration-200`}
              >
                Deb
              </a>
            </p>


          </motion.div>
        </div>
      </footer>
    </div>
  );
};
