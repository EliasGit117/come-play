import { FC } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { tm } from '../-lib/get-message';

interface IProps {
  /** key under pages.public.solutions.{category}[.items.{sub}] */
  baseKey: string;
  showDescription?: boolean;
}

const SolutionDetail: FC<IProps> = ({ baseKey, showDescription = true }) => {
  const description = tm(`${baseKey}.description`);
  const advantages = tm(`${baseKey}.advantages`);
  const advantagesLabel = tm('pages.public.solutions.common.advantagesLabel');

  return (
    <div className="space-y-8">
      {showDescription && description && (
        <div className="max-w-2xl space-y-3 text-sm md:text-base text-muted-foreground">
          {description.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}

      {advantages && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{advantagesLabel}</h2>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {advantages.split('\n').map((item) => (
              <li key={item} className="flex items-start gap-2">
                <IconCircleCheck className="size-4 mt-0.5 shrink-0 text-primary"/>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SolutionDetail;
