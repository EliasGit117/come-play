import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import Form from './form';
import { Button } from '@/components/ui/button';
import { MailIcon, PhoneIcon } from 'lucide-react';
import { ChatBubbleIcon } from '@radix-ui/react-icons';


interface IProps extends ComponentProps<'section'> {
}

const WriteAMessageSection: FC<IProps> = ({ className, ...props }) => {

  return (
    <section className={cn('grid lg:grid-cols-2 gap-4 md:gap-8', className)} {...props}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foregrounds uppercase">
          Have a question?
        </h2>

        <div className="mt-4 lg:max-w-xl text-muted-foreground text-sm">
          <p>
            We’re here to help! Fill out the form or reach us via email or phone. Our Customer Care Team is available to
            help you get the best experience out of K18 Hair whether you have an issue about your order or looking for
            helpful hair tips.
          </p>
          <br/>
          <p>
            Everyone gets a personalized response, so please allow 24 hours during business hours for a reply. Our
            business hours are M-F from 9am to 5pm PT.
          </p>
        </div>

        <div className="flex flex-col gap-1 -ml-2.5 mt-4">
          <Button variant="link" className="gap-4 w-fit" asChild>
            <a href="mailto:some@email.com">
              <MailIcon/>
              some@email.com
            </a>
          </Button>

          <Button variant="link" className="gap-4 w-fit" asChild>
            <a href="tel:+37360900001">
              <PhoneIcon/>
              +37360900001
            </a>
          </Button>

          <Button variant="link" className="gap-4 w-fit" asChild>
            <a>
              <ChatBubbleIcon/>
              Chat with us
            </a>
          </Button>
        </div>
      </div>

      <Form className=""/>
    </section>
  );
};


export default WriteAMessageSection;