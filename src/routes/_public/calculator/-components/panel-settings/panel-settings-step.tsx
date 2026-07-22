import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IPanelSettingsStepProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const PanelSettingsStep: FC<IPanelSettingsStepProps> = ({ title, children, className }) => (
  <section className={cn('space-y-4', className)}>
    <p className="text-base font-semibold">{title}</p>
    {children}
  </section>
);

export default PanelSettingsStep;
