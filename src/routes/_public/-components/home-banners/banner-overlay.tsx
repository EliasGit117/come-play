import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { IBannerBriefDto } from '@/features/banners/dtos/banner-brief-dto';

interface BannerOverlayProps {
  banner: IBannerBriefDto;
  className?: string;
}

export const BannerOverlay: React.FC<BannerOverlayProps> = ({ banner, className }) => {
  const { title, text, path } = banner;

  return (
    <div className={cn('absolute z-20 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full', className)}>
      <div
        className="container mx-auto py-4 px-8 space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6 text-white whitespace-pre-line">
        {title && (
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
            {title}
          </p>
        )}

        {text && (
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            {text}
          </p>
        )}

        {path && (
          <Button className="text-xs sm:text-sm md:text-base h-fit lg:h-10 xl:h-12 !bg-white !text-black" asChild>
            <Link to={path}>
              Show details
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
