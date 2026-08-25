import { createFileRoute } from '@tanstack/react-router';
import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { Map as ContactMap, MapControls, MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map';
import { m } from '@/paraglide/messages';
import { seo } from '@/utils/seo';


export const Route = createFileRoute('/_public/contacts')({
  component: RouteComponent,
  head: () => ({
    meta: [
      ...seo({
        title: m['pages.public.contacts.title'](),
        description: m['pages.public.contacts.description']()
      })
    ]
  })
});

const offices = [
  {
    id: 'chisinau',
    phone: '078 770 779',
    phoneHref: 'tel:+37378770779',
    mapsHref: 'https://maps.app.goo.gl/j3J8LAtAE7c8X9pw8',
    longitude: 28.840586,
    latitude: 47.021793
  }
] as const;

function RouteComponent() {
  return (
    <main className="container mx-auto flex flex-col flex-1 p-4">
      <section aria-labelledby="contact-heading">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-3">
            <h1 id="contact-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
              {m['pages.public.contacts.title']()}
            </h1>
            <p className="text-muted-foreground text-lg/8 text-pretty">
              {m['pages.public.contacts.description']()}
            </p>
          </div>

          <div className="grid gap-5">
            {offices.map((office) => (
              <Card key={office.id} className="flex flex-col gap-6 p-5 md:flex-row md:gap-8 md:p-6">
                <div className="flex flex-col gap-4 md:w-72 md:shrink-0">
                  <h2 className="text-lg font-semibold">
                    {m['pages.public.contacts.offices.chisinau.title']()}
                  </h2>

                  <a className="flex items-center gap-3 hover:underline" href="mailto:project@exterior.md">
                    <span className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-md">
                      <IconMail className="text-primary size-3.5"/>
                    </span>
                    <span className="text-card-foreground text-base leading-5 font-medium">
                      {m['pages.public.contacts.email']()}
                    </span>
                  </a>

                  <a className="flex items-center gap-3 hover:underline" href={office.phoneHref}>
                    <span className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-md">
                      <IconPhone className="text-primary size-3.5"/>
                    </span>
                    <span className="text-card-foreground text-base leading-5 font-medium">{office.phone}</span>
                  </a>

                  <a
                    className="flex items-center gap-3 hover:underline"
                    href={office.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-md">
                      <IconMapPin className="text-primary size-3.5"/>
                    </span>
                    <span className="text-card-foreground flex-1 text-sm leading-5 font-medium">
                      {m['pages.public.contacts.offices.chisinau.address']()}
                    </span>
                  </a>

                  <p className="text-muted-foreground text-sm">
                    {m['pages.public.contacts.working_hours']()}
                  </p>
                </div>

                <div className="min-h-80 flex-1 overflow-hidden rounded-lg border md:min-h-0">
                  <ContactMap center={[office.longitude, office.latitude]} zoom={14} className="h-full min-h-80">
                    <MapControls showZoom/>
                    <MapMarker longitude={office.longitude} latitude={office.latitude}>
                      <MarkerContent>
                        <div className="bg-primary ring-background size-4 rounded-full ring-2"/>
                      </MarkerContent>
                      <MarkerPopup closeOnClick={false}>
                        <p className="font-medium">
                          {m['pages.public.contacts.offices.chisinau.city']()}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {m['pages.public.contacts.offices.chisinau.address']()}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {m['pages.public.contacts.phone_label']()}: {office.phone}
                        </p>
                      </MarkerPopup>
                    </MapMarker>
                  </ContactMap>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
