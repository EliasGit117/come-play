import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link, LinkOptions } from '@tanstack/react-router';
import conferenceRoomImg from '/images/home/solutions/conference-room.jpg';
import stadiumImg from '/images/home/solutions/stadium.jpg';
import advertisingImg from '/images/home/solutions/advertising.png';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { Building2, Clock, Lightbulb, Star } from 'lucide-react';


interface IProps extends ComponentProps<'section'> {
}

const SolutionList: FC<IProps> = ({ className, ...props }) => {

  return (
    <section className={cn('space-y-8', className)} {...props}>
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          SOLUTIONS
        </h2>
        <p className="text-muted-foreground mt-2">
          Global success LED screen display cases of over 1.5 million
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-0.5 sm:gap-1 md:max-h-96">
        {imageLinks.map((linkProps) =>
          <ImageLink key={linkProps.title} {...linkProps}/>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
        {descriptions.map((desc, i) => (
          <div
            key={desc.title}
            className={cn(
              'relative group p-2 md:p-4 overflow-hidden cursor-pointer rounded-md',
              i === descriptions.length - 1 && 'col-span-1 md:col-span-2 lg:col-span-1'
            )}
          >
            {/* Hidden red bar that slides in on hover */}
            <div
              className="absolute left-0 top-0 h-full w-0 bg-primary transition-all duration-400 group-hover:w-full z-0"></div>

            {/* Text content */}
            <h3
              className="font-bold uppercase mb-2 text-lg relative z-10 transition-colors duration-300 group-hover:text-primary-foreground">
              {desc.title}
            </h3>
            <p
              className="text-sm text-muted-foreground relative z-10 transition-colors duration-300 group-hover:text-primary-foreground">
              {desc.text}
            </p>
          </div>
        ))}
      </div>

      <div className="my-12 md:my-24 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {iconItems.map(({ Icon, title }, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-4">
            <Icon className="size-8 sm:size-10 text-primary"/>
            <p className="text-xs sm:text-sm text-foreground text-center">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const iconItems = [
  { Icon: Building2, title: '30+ years LED manufacturer' },
  { Icon: Lightbulb, title: 'LED display company Innovative R&D' },
  { Icon: Clock, title: '24h Zealous service' },
  { Icon: Star, title: 'Professional LED solution provider' }
];


interface IImageLinkProps {
  title: string;
  img: string;
  linkOptions: LinkOptions;
  className?: string;
  thumbhash?: string;
}

const imageLinks: IImageLinkProps[] = [
  {
    title: 'Conference Room',
    img: conferenceRoomImg,
    className: 'md:row-span-2 max-h-32 md:max-h-none rounded-t-md md:rounded-t-none md:rounded-l-md',
    linkOptions: { to: '/' },
    thumbhash: '2PcRDYBId5iPhod7iIeHiPaAeA5n'
  },
  {
    title: 'Races Stadium',
    img: stadiumImg,
    className: 'max-h-32 md:max-h-none md:rounded-tr-md',
    linkOptions: { to: '/' },
    thumbhash: 'o8YNFYR3eIh5d3efd5d5iFiFn/an'
  },
  {
    title: 'Advertising',
    img: advertisingImg,
    className: 'md:col-start-2 max-h-32 md:max-h-none rounded-b-md md:rounded-b-none md:rounded-br-md',
    linkOptions: { to: '/' },
    thumbhash: 'DQgKBYJ5V2h/iIZ1eEd4eASVngiq'
  }
];

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
          className={cn(
            'text-white text-center text-2xl font-bold uppercase',
            'transition-transform duration-400 ease-in-out group-hover:scale-125 group-focus:scale-125'
          )}>
          {title}
        </p>
      </div>
    </Link>
  );
};

const descriptions = [
  {
    title: 'Transportation',
    text: 'Transportation hubs have the challenge of needing to communicate with their travelers around the clock. itc provides advanced LED displays to convey traffic guidance information timely to travelers, ensuring their exciting and smooth journey.'
  },
  {
    title: 'Stage & Events',
    text: 'Based on cutting-edge core technologies and extensive experiences working with global clients, itc products realize various requirements for a huge show or event. We aim to create a memorable and engaging experience for the audience with itc LED screen.'
  },
  {
    title: 'Studio',
    text: 'As for the studio solution, our premium products bring your broadcasting stories to life by conveying vivid and dynamic visual performance to the audience.'
  },
  {
    title: 'Scenic Spot & Public',
    text: 'Dynamic LED displays for public spaces: High-brightness, weather-resistant screens delivering vibrant visuals and real-time information at tourist hubs.'
  },
  {
    title: 'Control Room',
    text: 'In terms of the control room solution, LED display technology enables users to interface with diverse information sources, and simultaneously process with mass of data efficiently. To help monitor multiple information flows effectively in a control room.'
  }
];

export default SolutionList;