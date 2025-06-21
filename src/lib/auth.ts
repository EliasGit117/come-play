import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '@/lib/prisma';
import { reactStartCookies } from 'better-auth/react-start';
import { Resend } from 'resend';

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await resend.emails.send({
        from: 'email@example.com',
        to: [user.email],
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}`
      });
    }
  },
  plugins: [
    reactStartCookies()
  ]
});