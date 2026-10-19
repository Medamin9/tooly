import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@tooly/contracts';

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
