import React from 'react';
import { AmbientNotificationPill } from './AmbientNotificationPill';
import { BlogPost } from '../types/blog';
import { Language } from '../types/translations';

interface NotificationBannerProps {
  latestPost: BlogPost | null;
  onOpenPost: (post: BlogPost) => void;
  language?: Language;
}

/**
 * Re-exports AmbientNotificationPill for backwards compatibility.
 * The intrusive floating banner is replaced by the header ambient pill.
 */
export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  latestPost,
  onOpenPost,
  language = 'da',
}) => {
  return (
    <AmbientNotificationPill
      latestPost={latestPost}
      onOpenPost={onOpenPost}
      language={language}
    />
  );
};
