"use client";

import { useState, useEffect, ReactNode, ReactElement, cloneElement, FC } from 'react';
import { cn } from '@/lib/utils';
import { VideoHTMLAttributes } from 'react';

export interface IVideoPlaceholderProps {
  placeholder: ReactNode;
  children: ReactElement<VideoHTMLAttributes<HTMLVideoElement>>; // strictly <video>
  transitionDuration?: number; // in ms
  background?: string; // optional container background color
};

const VideoPlaceholder: FC<IVideoPlaceholderProps> = (props) => {
  const {
    placeholder,
    children,
    transitionDuration = 300,
    background = 'black',
  } = props;

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return placeholder;


  const videoWithHandlers = cloneElement(children, {
    className: cn(
      'absolute inset-0 h-full w-full object-cover transition-opacity z-20',
      loading && 'opacity-0',
      children.props.className
    ),
    style: { transition: `opacity ${transitionDuration}ms ease` },
    onLoadedData: (event: any) => {
      setLoading(false);
      children.props.onLoadedData?.(event);
    },
  });

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background }}
    >
      <div
        className="absolute inset-0 h-full w-full z-10"
        style={{
          opacity: loading ? 1 : 0,
          transition: `opacity ${transitionDuration}ms ease`,
        }}
      >
        {placeholder}
      </div>
      {videoWithHandlers}
    </div>
  );
}

export default VideoPlaceholder;
