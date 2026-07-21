import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import YoutubeLogo from '@/assets/icons/socials/youtube.svg?react';
import FacebookLogo from '@/assets/icons/socials/facebook.svg?react';
import LinkedInLogo from '@/assets/icons/socials/linkedin.svg?react';
import TwitterLogo from '@/assets/icons/socials/twitter.svg?react';
import LogoFull from '@/assets/icons/logo/full.svg?react';
import { Button } from '@/components/ui/button';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'footer'> {}

const AppFooter: FC<IProps> = ({ className, ...props }) => {

  return (
    <footer
      className={cn(
        'bg-secondary-foreground dark:bg-muted text-secondary dark:text-foreground space-y-8',
        className)
      }
      {...props}
    >
      <div className="container mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 order-last md:order-first">
          <p className="text-xs md:text-sm text-center md:text-start">
            <b>{m['layout.footer.headquarters_label']()}:</b> {m['pages.public.contacts.offices.chisinau.address']()},
            {' '}<b>{m['layout.footer.phone_label']()}:</b> 078 770 779
          </p>

          <p className="text-xs md:text-sm text-center md:text-start">
            <b>{m['pages.public.contacts.offices.balti.title']()}:</b> {m['pages.public.contacts.offices.balti.address']()},
            {' '}<b>{m['layout.footer.phone_label']()}:</b> 078 608 068
          </p>

          <p className="text-xs md:text-sm text-center md:text-start">
            <b>{m['layout.footer.email_label']()}:</b> {m['pages.public.contacts.email']()},
            {' '}{m['pages.public.contacts.working_hours']()}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center md:items-end order-first md:order-last">
          <LogoFull className="h-10 w-42"/>

          <div className="flex gap-2 items-center">
            <Button variant='ghost' size='icon-sm' className={iconLinkClassName}>
              <LinkedInLogo className='size-3'/>
              <span className='sr-only'>{m['layout.footer.social.linkedin']()}</span>
            </Button>

            <Button variant='ghost' size='icon-sm' className={iconLinkClassName}>
              <YoutubeLogo className='size-3'/>
              <span className='sr-only'>{m['layout.footer.social.youtube']()}</span>
            </Button>

            <Button variant='ghost' size='icon-sm' className={iconLinkClassName}>
              <FacebookLogo className='size-3'/>
              <span className='sr-only'>{m['layout.footer.social.facebook']()}</span>
            </Button>

            <Button variant='ghost' size='icon-sm' className={iconLinkClassName}>
              <TwitterLogo className='size-3'/>
              <span className='sr-only'>{m['layout.footer.social.twitter']()}</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const iconLinkClassName = '!bg-muted/15 dark:!bg-primary/15 !text-white rounded-full';

export default AppFooter;