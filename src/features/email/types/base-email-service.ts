
export interface IBaseEmailService {

  sendVerificationEmail: (to: string, url: string) => Promise<void>;
  sendPasswordResetEmail: (to: string, url: string) => Promise<void>;
  sendChangeEmailVerification: (to: string, url: string) => Promise<void>;
}