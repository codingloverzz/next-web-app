import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
      <div>
        home page
        <Link href="/movies">Movies</Link>
      </div>
  );
}
