import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from '@/services/locale';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});