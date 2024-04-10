import React, { useState } from 'react';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import AuthProvider from '../../../components/common/AuthProvider';
import { Header } from '../../../components/common';
import Link from 'next/link';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import { Tab } from '@headlessui/react';
import Reward from '../../../components/referAndEarn/Reward';
import Invite from '../../../components/referAndEarn/Invite';
import Coupon from '../../../components/referAndEarn/Coupons';
import useSWR from 'swr';
import * as api from '../../../services/userService';
import { useUser } from '../../../context/UserContext';
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// 7848837528
const Refer = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const { userId } = useUser();

    const changeTab = (index) => {
        setTabIndex(index);
    }

    // Get refer details
    const { data, error, mutate } = useSWR(userId && ['/refers?user_id=', userId], () =>
        api.getReferDetails(userId),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    );


    if (error) {
        toast.error('Failed to load rewards');
    }

    return (
        <PrimaryLayout>
            <AuthProvider>
                <Header>
                    <div className="flex flex-col justify-start items-start bg-[#010201]">
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
                            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                                <Link href="/user">
                                    <ArrowLeftIcon height={24} width={24} />
                                </Link>
                            </div>
                            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                                    Refer & Earn
                                </p>
                            </div>
                        </div>
                    </div>
                </Header>

                {/* Page Body */}
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191c] w-screen md:max-w-2xl md:m-auto">
                    <div className="w-full flex flex-col mb-7 mt-2">
                        <Tab.Group onChange={(i) => setTabIndex(i)}
                            selectedIndex={tabIndex}>
                            <Tab.List className="text-sm font-medium border-b text-gray-400 border-gray-700 bg-[#0F0F0F] flex justify-around items-center">
                                <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg  hover:border-gray-300 hover:text-gray-300">
                                    {({ selected }) => (
                                        <span
                                            className={selected ? ' text-white' : ' text-gray-400'}
                                        >
                                            Your Rewards
                                        </span>
                                    )}
                                </Tab>
                                <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg  hover:border-gray-300 hover:text-gray-300">
                                    {({ selected }) => (
                                        <span
                                            className={selected ? ' text-white ' : ' text-gray-400'}
                                        >
                                            Invited Friends
                                        </span>
                                    )}

                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="p-5">
                                        <Reward changeTab={changeTab} referDetails={data} userId={userId} mutate={mutate} />
                                    </div>
                                    <div className="">
                                        <hr className="h-px my-8 border-0 bg-gray-700" />
                                        <Coupon changeTab={changeTab} />
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="p-5">
                                        <Invite referDetails={data} />
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </AuthProvider>
        </PrimaryLayout>
    );
};

export default Refer;
