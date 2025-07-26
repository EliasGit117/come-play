import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import Form from './form';
import { Building2, Lightbulb, Clock, Star } from 'lucide-react';


interface IProps extends ComponentProps<'section'> {
}

const WriteAMessageSection: FC<IProps> = ({ className, ...props }) => {

  return (
    <section className={cn('space-y-16', className)} {...props}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
          WRITE A MESSAGE
        </h2>
        <p className="mt-4 max-w-4xl mx-auto text-muted-foreground text-sm text-center">
          Guangzhou Baolun Electronic Co., Ltd(itc) was founded in 1993, with more
          than 7,000 staff in total. We are a professional manufacturer and LED
          display supplier of LED display visual products. Our products are exported
          all over the world with good reputation. itc successful cases exceed
          1,500,000.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {items.map(({ Icon, title }, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-4">
            <Icon className="size-8 sm:size-10 text-primary" />
            <p className="text-xs sm:text-sm text-foreground text-center">{title}</p>
          </div>
        ))}
      </div>

      <Form className="max-w-4xl mx-auto"/>
    </section>
  );
};

const items = [
  {
    Icon: Building2,
    title: '30+ years LED manufacturer',
  },
  {
    Icon: Lightbulb,
    title: 'LED display company Innovative R&D',
  },
  {
    Icon: Clock,
    title: '24h Zealous service',
  },
  {
    Icon: Star,
    title: 'Professional LED solution provider',
  },
];


export default WriteAMessageSection;