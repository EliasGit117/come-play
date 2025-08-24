import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import YoutubeLogo from '@/assets/icons/socials/youtube.svg?react';
import FacebookLogo from '@/assets/icons/socials/facebook.svg?react';
import LinkedInLogo from '@/assets/icons/socials/linkedin.svg?react';
import TwitterLogo from '@/assets/icons/socials/twitter.svg?react';
import LightLogo from '@/assets/icons/logo-white.svg?react';
import { Button } from '@/components/ui/button';


interface IProps extends ComponentProps<'footer'> {
}

const AppFooter: FC<IProps> = ({ className, ...props }) => {

  return (
    <footer
      className={cn(
        'bg-primary text-primary-foreground space-y-8',
        className)
      }
      {...props}
    >
      <div className="container mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 order-last md:order-first">
          <p className="text-xs md:text-sm text-center md:text-start">
            <b>itc Headquater:</b> Building NO. A13-1, Yiku Industrial Park, The Hills, Dongyi Road, Panyu District,
            Guangzhou,
            China 511492
          </p>

          <p className="text-xs md:text-sm text-center md:text-start">
            <b>Email:</b> info@itc-pa.com, <b>Phone:</b> +86-020-3567 2981
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center md:items-end order-first md:order-last">
          <LightLogo className="size-12"/>

          <div className="flex gap-2 items-center">
            <Button variant='ghost' size='smIcon' className='!bg-muted/15 !text-white rounded-full'>
              <LinkedInLogo/>
            </Button>

            <Button variant='ghost' size='smIcon' className='!bg-muted/15 !text-white rounded-full'>
              <YoutubeLogo/>
            </Button>

            <Button variant='ghost' size='smIcon' className='!bg-muted/15 !text-white rounded-full'>
              <FacebookLogo/>
            </Button>

            <Button variant='ghost' size='smIcon' className='!bg-muted/15 !text-white rounded-full'>
              <TwitterLogo/>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;