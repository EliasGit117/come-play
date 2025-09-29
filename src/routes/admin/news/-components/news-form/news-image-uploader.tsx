import { FC } from 'react';
import { useSetNewsImageMutation } from '@/features/news/server-functions/admin/set-news-image';
import { toast } from 'sonner';


interface INewsImageUploaderProps {

}

export const NewsImageUploader: FC<INewsImageUploaderProps> = (props) => {

  const {} = useSetNewsImageMutation({
    onError: (e) => toast.error(e.message, { description: e.message }),
    onSuccess: () => {
      toast.success('Images has been set')
    }
  });

  return (
    <>
    </>
  );
};

export default NewsImageUploader;
