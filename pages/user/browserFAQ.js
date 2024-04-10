import React, { useState } from 'react';
import AuthProvider from '../../components/common/AuthProvider';
import ProfileLayout from '../../components/layout/ProfileLayout';
import Header from '../../components/common/Header';
import Link from 'next/link';
import ArrowLeftIcon from '../../components/common/icons/arrowlefticon';
import { Tab } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const BrowserFAQ = () => {
  const [categories] = useState({
    'Photoframe FAQ': [
      {
        id: 1,
        title:
          'Is it possible to use PhonePe for paying when I buy Photoframe on Clickezy?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title:
          'Can I pay for the Aegon Life Group Term Plus Insurance Plan with SuperCoins?',
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
      {
        id: 2,
        title:
          'Is there an option for fast delivery when ordering a photo frame?',
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
      {
        id: 2,
        title:
          'Is it possible to add more items to my Clickezy Quick order after I ve already placed it, specifically for a photo frame?',
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
      {
        id: 2,
        title:
          'Is it possible to add more items to my Clickezy Quick order after I ve already placed it, specifically for a photo frame?',
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
      {
        id: 2,
        title: 'Can I delete my saved cards?',
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
      {
        id: 2,
        title: 'How can I delete my saved card?',
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
      {
        id: 2,
        title: 'How are SuperCoins earned per order calculated?',
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    'Photography FAQ': [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
    ],
  });

  return (
    <ProfileLayout>
      <AuthProvider>
        <header className="flex flex-col justify-start items-start bg-[#010201] md:bg-transparent md:border-b md:border-white/10 min-h-[64px] md:min-h-0">
          <div className="flex flex-col justify-start items-start self-stretch">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 md:px-0 py-4 md:pt-0">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <Link href={'/user'} className="flex md:hidden">
                  <ArrowLeftIcon height={24} width={24} />
                </Link>
                <QuestionMarkCircleIcon className="hidden md:flex w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                  Browser Help
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 pb-4 w-screen md:w-full md:pb-28">
          <div className="flex flex-col px-6 md:p-0 gap-4">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {Object.values(categories).map((posts, idx) => (
                  <Tab.Panel
                    key={idx}
                    className={classNames(
                      'rounded-xl  p-3',
                      'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}
                  >
                    <span className="text-gray-400 text-sm">
                      Commonly searched FAQS
                    </span>

                    <ul className="text-white">
                      {posts.map((post) => (
                        <li key={post.id} className="relative rounded-md p-3 ">
                          <h3 className="text-sm font-medium leading-5">
                            {post.title}
                          </h3>

                          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                            <li>{post.date}</li>
                            <li>&middot;</li>
                            <li>{post.commentCount} asked</li>
                          </ul>

                          <Link
                            href="#"
                            className={classNames(
                              'absolute inset-0 rounded-md',
                              'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </AuthProvider>
    </ProfileLayout>
  );
};

export default BrowserFAQ;
