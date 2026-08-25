import { IconMail, IconMessageCircle, IconPhone } from '@tabler/icons-react';
import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import Form from './form';
import { Button } from '@/components/ui/button';
import { m } from '@/paraglide/messages';



interface IProps extends ComponentProps<'section'> {
}

const WriteAMessageSection: FC<IProps> = ({ className, ...props }) => {

  return (
    <section id="contact" className={cn('grid lg:grid-cols-2 gap-4 md:gap-8', className)} {...props}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foregrounds uppercase">
          {m['pages.public.home.contact.title']()}
        </h2>

        <div className="mt-4 lg:max-w-xl text-muted-foreground text-sm">
          <p>
            {m['pages.public.home.contact.paragraph1']()}
          </p>
          <br/>
          <p>
            {m['pages.public.home.contact.paragraph2']()}
          </p>
        </div>

        <div className="flex flex-col gap-1 -ml-2.5 mt-4">
          <Button variant="link" className="gap-4 w-fit" asChild>
            <a href="mailto:project@exterior.md">
              <IconMail/>
              project@exterior.md
            </a>
          </Button>

          <Button variant="link" className="gap-4 w-fit" asChild>
            <a href="tel:+37378770779">
              <IconPhone/>
              +37378770779
            </a>
          </Button>

          <Button variant="link" className="gap-4 w-fit" asChild>
            <a>
              <IconMessageCircle/>
              {m['pages.public.home.contact.chat']()}
            </a>
          </Button>
        </div>
      </div>

      <Form className=""/>
    </section>
  );
};


export default WriteAMessageSection;