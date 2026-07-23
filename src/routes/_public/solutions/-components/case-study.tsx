import { FC, useEffect, useRef } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { CaseStudyConfig } from '../-consts/categories';
import { tm } from '../-lib/get-message';
import { Link } from '@tanstack/react-router';


interface IProps {
  baseKey: string;
  media: CaseStudyConfig;
}

const CaseStudy: FC<IProps> = ({ baseKey, media }) => {
  const label = tm('pages.public.solutions.common.caseStudyLabel');
  const client = tm(`${baseKey}.client`);
  const title = tm(`${baseKey}.title`);
  const description = tm(`${baseKey}.description`);
  const advantages = tm(`${baseKey}.advantages`);
  const cta = tm('pages.public.solutions.common.cta');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    const play = el.play();
    if (play) play.catch(() => {});
  }, []);

  return (
    <section className="space-y-6 rounded-xl border border-border/50 bg-muted/30 p-6 md:p-10">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{label}</p>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{client}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <video
            ref={videoRef}
            src={media.video}
            poster={media.photo}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="w-full h-full object-cover rounded-lg border border-border/50 bg-black aspect-video"
          />
        </div>

        <div className="space-y-4">
          {description && (
            <div className="space-y-3 text-sm md:text-base text-muted-foreground">
              {description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {advantages && (
            <ul className="grid gap-y-2 text-sm">
              {advantages.split('\n').map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <IconCircleCheck className="size-4 mt-0.5 shrink-0 text-primary"/>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}

          <Button className="w-fit" asChild>
            <Link to="/contacts">
              {cta}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
