import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from '@/services/locale';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../../messages/${locale}.json`)).default,
    formats: {
      dateTime: {
        fullShort: {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      },
    }
  };
});