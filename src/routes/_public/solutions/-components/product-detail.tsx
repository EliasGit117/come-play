import { FC } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { tm } from '../-lib/get-message';

interface IProps {
  /** key under pages.public.products.{category}[.items.{sub}] */
  baseKey: string;
  showDescription?: boolean;
}

const SPEC_FIELDS = [
  'pixelPitch',
  'brightness',
  'refreshRate',
  'viewingAngle',
  'transparency',
  'protection',
  'format',
  'installation',
  'connection'
] as const;

const ProductDetail: FC<IProps> = ({ baseKey, showDescription = true }) => {
  const description = tm(`${baseKey}.description`);
  const applications = tm(`${baseKey}.applications`);
  const note = tm(`${baseKey}.specs.note`);

  const applicationsLabel = tm('pages.public.products.common.applicationsLabel');
  const specsLabel = tm('pages.public.products.common.specsLabel');

  const specs = SPEC_FIELDS
    .map((field) => ({
      label: tm(`pages.public.products.common.${field}Label`),
      value: tm(`${baseKey}.specs.${field}`)
    }))
    .filter((spec) => spec.value);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        {showDescription && description && (
          <div className="max-w-2xl space-y-3 text-sm md:text-base text-muted-foreground">
            {description.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {applications && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{applicationsLabel}</h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {applications.split('\n').map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <IconCircleCheck className="size-4 mt-0.5 shrink-0 text-primary"/>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {(specs.length > 0 || note) && (
        <Card className="h-fit p-6 gap-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">{specsLabel}</h2>

          {specs.length > 0 && (
            <dl className="space-y-1 text-sm">
              {specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-4 border-b border-border/50 py-2 last:border-0">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="font-medium text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {note && <p className="text-xs text-muted-foreground">{note}</p>}
        </Card>
      )}
    </div>
  );
};

export default ProductDetail;
