import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link, LinkOptions } from '@tanstack/react-router';
import conferenceRoomImg from '/images/home/solutions/conference-room.jpg';
import stadiumImg from '/images/home/solutions/stadium.jpg';
import advertisingImg from '/images/home/solutions/advertising.png';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'section'> {
}

const SolutionList: FC<IProps> = ({ className, ...props }) => {
  const imageLinks: IImageLinkProps[] = [
    {
      id: 'conferenceRoom',
      title: m['pages.public.home.solutions.conferenceRoom'](),
      img: conferenceRoomImg,
      className: 'md:row-span-2 max-h-32 md:max-h-none rounded-t-md md:rounded-t-none md:rounded-l-md',
      linkOptions: { to: '/' },
      thumbhash: '2PcRDYBId5iPhod7iIeHiPaAeA5n'
    },
    {
      id: 'stadium',
      title: m['pages.public.home.solutions.stadium'](),
      img: stadiumImg,
      className: 'max-h-32 md:max-h-none md:rounded-tr-md',
      linkOptions: { to: '/' },
      thumbhash: 'o8YNFYR3eIh5d3efd5d5iFiFn/an'
    },
    {
      id: 'advertising',
      title: m['pages.public.home.solutions.advertising'](),
      img: advertisingImg,
      className: 'md:col-start-2 max-h-32 md:max-h-none rounded-b-md md:rounded-b-none md:rounded-br-md',
      linkOptions: { to: '/' },
      thumbhash: 'DQgKBYJ5V2h/iIZ1eEd4eASVngiq'
    }
  ];

  const descriptions = [
    {
      id: 'stageEvents',
      title: m['pages.public.home.solutions.stageEvents.title'](),
      text: m['pages.public.home.solutions.stageEvents.text']()
    },
    {
      id: 'controlRoom',
      title: m['pages.public.home.solutions.controlRoom.title'](),
      text: m['pages.public.home.solutions.controlRoom.text']()
    },
    {
      id: 'scenicPublic',
      title: m['pages.public.home.solutions.scenicPublic.title'](),
      text: m['pages.public.home.solutions.scenicPublic.text']()
    },
    {
      id: 'transportation',
      title: m['pages.public.home.solutions.transportation.title'](),
      text: m['pages.public.home.solutions.transportation.text']()
    },
    {
      id: 'studio',
      title: m['pages.public.home.solutions.studio.title'](),
      text: m['pages.public.home.solutions.studio.text']()
    }
  ];

  return (
    <section className={cn('space-y-8', className)} {...props}>
      <div>
        <h2 className="text-3xl font-bold">
          {m['pages.public.home.solutions.title']()}
        </h2>
        <p className="text-muted-foreground mt-2">
          {m['pages.public.home.solutions.subtitle']()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-1 sm:gap-2 md:max-h-96">
        {imageLinks.map((linkProps) =>
          <ImageLink key={linkProps.id} {...linkProps}/>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {descriptions.map((desc) => (
          <div key={desc.id} className="space-y-2">
            <h3 className="font-semibold uppercase">
              {desc.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {desc.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};


interface IImageLinkProps {
  id: string;
  title: string;
  img: string;
  linkOptions: LinkOptions;
  className?: string;
  thumbhash?: string;
}

const ImageLink: FC<IImageLinkProps> = ({ linkOptions, img, title, className, thumbhash }) => {
  return (
    <Link
      className={cn('group relative h-full w-full overflow-hidden border border-border/50', className)}
      {...linkOptions}
    >
      <UnLazyImageSSR
        src={img}
        alt={title}
        thumbhash={thumbhash}
        className={cn(
          'h-full w-full object-cover brightness-75 group-focus:brightness-50 group-hover:brightness-50',
          'transition duration-400 ease-in-out group-hover:scale-125 group-focus:scale-125'
        )}
      />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p
          className="text-white text-center text-2xl font-bold uppercase">
          {title}
        </p>
      </div>
    </Link>
  );
};

export default SolutionList;