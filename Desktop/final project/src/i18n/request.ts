import { getRequestConfig } from 'next-intl/server';
import { Messages } from '@/messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'en';

  const validLocale = ['en', 'ar'].includes(locale) ? locale : 'en';

  const messages: Messages = (await import(`@/messages/${validLocale}.json`)).default;

  return {
    locale: validLocale,
    messages,
  };
});
