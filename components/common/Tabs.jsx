import { useRouter } from 'next/router';
import Link from 'next/link';
const Tabs = () => {
  const router = useRouter();
  const active =
    'text-white hover:text-white bg-blue-700 md:bg-blue-900/80 hover:bg-blue-700 md:hover:bg-blue-800/80 md:border-blue-800';
  const inActive =
    'text-white/50 md:text-slate-300 hover:bg-slate-800 md:hover:bg-blue-900/40 md:border-transparent';
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 px-4 pb-2 md:px-0">
        <nav className="flex justify-start items-start self-stretch md:self-auto flex-grow-0 flex-shrink-0 text-base relative gap-px md:gap-2 px-[3px] p-1 md:p-2 rounded-lg md:rounded-full bg-slate-900 md:bg-black/30">
          <Link
            href="/photography/category"
            className={`flex flex-1 md:flex-none justify-center items-center self-stretch px-3 md:px-6 py-1 md:py-2 rounded-lg md:rounded-full md:text-lg md:border hover:bg-slate-800 hover:text-white transition-all ${
              router.pathname === '/photography/category' ? active : inActive
            } `}
          >
            Photographs
          </Link>
          <Link
            href="/photography/places"
            className={`flex flex-1 md:flex-none justify-center items-center self-stretch px-3 md:px-6 py-1 md:py-2 rounded-lg md:rounded-full md:text-lg md:border hover:bg-slate-800 hover:text-white transition-all ${
              router.pathname === '/photography/places' ? active : inActive
            } `}
          >
            Places
          </Link>
          <Link
            href="/photography/studios"
            className={`flex flex-1 md:flex-none justify-center items-center self-stretch px-3 md:px-6 py-1 md:py-2 rounded-lg md:rounded-full md:text-lg md:border hover:bg-slate-800 hover:text-white transition-all ${
              router.pathname === '/photography/studios' ? active : inActive
            } `}
          >
            Studios
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Tabs;
