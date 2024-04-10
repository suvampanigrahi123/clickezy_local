import { Menu, Transition } from '@headlessui/react';
import { Fragment, useCallback, useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import * as api from '../../services/userService'
import toast from 'react-hot-toast';
export const OptionModal = ({ is_public, selectedImages, setselected, mutate }) => {
    const [apiLoading, setapiLoading] = useState(false);
  
    const [isOpen, setisOpen] = useState(false);
    const popover = useRef();
    const close = useCallback(() => setisOpen(false), []);
    useClickOutside(popover, close);
    async function changeStatus(status) {
        try {
            setapiLoading(true);
          const data = await api.updateImageStatus(selectedImages?.map(({ id })=>id).join(','), status);
              if (data?.status === 'success') {
                  toast.success(data?.message || 'status updated successfully')
                if (mutate) {   
                  mutate();
                }
                  setapiLoading(false);
                  setisOpen(false);
                  setselected([])
              } else {
                  toast.error(data?.message)
                  setapiLoading(false);
              }
        } catch (error) {
            toast.error('Something went wrong...')
            setapiLoading(false);
      }
  }
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button  onClick={() => setisOpen(true)}>
            <OptionIcon />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            ref={popover}
            className="popover h-full w-full max-w-full  absolute z-10"
          >
            <Menu.Items className="absolute right-0 bottom-8 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[99]">

          {is_public===1?    <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => changeStatus(0)}
                                        disabled={apiLoading}
                    >
                      Make as Private
                    </button>
                  )}
                </Menu.Item>
              </div>:
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                 onClick={()=>changeStatus(1)}
                 disabled={apiLoading}
                    >
                      Make as Public
                    </button>
                  )}
                </Menu.Item>
              </div>}
            </Menu.Items>
          </div>
        </Transition>
      </Menu>
    );
}
  



export const ChangeStatusOfView = ({ status, setstatus, key_name }) => {
    const [isOpen, setisOpen] = useState(false);
    const popover = useRef();
    const close = useCallback(() => setisOpen(false), []);
    useClickOutside(popover, close);

    return (
        <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button onClick={() => setisOpen(true)}>
            <OptionIcon />
          </Menu.Button>
        </div>
        {/* <div ref={popover}> */}
        <Transition
          as={Fragment}
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            ref={popover}
            className="popover h-full w-full max-w-full  absolute z-10"
          >
            <Menu.Items className="absolute right-0 bottom-8 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[99]">

         <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => {
                                            setstatus({
                                        ...status,
                                        [key_name]:!status[key_name]
                                            })
                                            setisOpen(false);
                                    }}
                    >
                                    {
                                        status[key_name] ? 'Back to normal':'Change image status'
                      }
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </div>
        </Transition>
      </Menu>
    )
}


const OptionIcon = () => {
    return (
        <svg width="20" height="20" fill="white" viewBox="0 0 0.6 0.6" xmlns="http://www.w3.org/2000/svg" transform="matrix(0 1 1 0 0 0)"><path d="M.3.25A.05.05 0 1 1 .25.3.05.05 0 0 1 .3.25Zm-.2.1A.05.05 0 1 0 .05.3.05.05 0 0 0 .1.35Zm.4-.1A.05.05 0 1 0 .55.3.05.05 0 0 0 .5.25Z"/></svg>
    )
}