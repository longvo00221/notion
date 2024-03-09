import React from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarClock,
  Info,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { ConfirmModal } from "./modals/confirm-modal";
type DeleteEventModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: any;
  data: any;
  onCloseModal: () => void;
};

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  showModal,
  onClick,
  data,
  onCloseModal,
  setShowModal,
}) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const user = useUser();
  if (!data) return;
  const dateTimeString = data._def.extendedProps.daytime;
  const dateTime = new Date(dateTimeString);

  let hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  let meridiem = "AM";

  if (hour >= 12) {
    meridiem = "PM";
    if (hour > 12) {
      hour -= 12;
    }
  }

  const formattedTime = `${hour}:${minute}${meridiem}`;
  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShowModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-hidden rounded-lg
                     bg-white dark:bg-[#080808] text-left shadow-xl transition-all sm:my-8 w-full md:max-w-lg"
              >
                <div className="px-4 pt-3">
                  {/* <div className="sm:flex sm:items-start">
                    <div
                      className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                        justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10"
                    >
                      <InfoIcon
                        className="h-6 w-6 text-cyan-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Event info
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You can check the event info or delete it if you want.
                        </p>
                      </div>
                    </div>
                  </div> */}
                  <div className="group-btn flex items-center justify-end gap-2">
                    <Button className="" variant="ghost" size="icon">
                      <Pencil className="h-4 w-4"/>
                    </Button>
                    <ConfirmModal onConfirm={onClick}>
                      <Button className="hover:bg-red-500 hover:text-white" variant="ghost" size="icon">
                        <Trash className="h-4 w-4"/>
                      </Button>
                    </ConfirmModal>
                    <Button className="ml-3" variant="ghost" size="icon"   onClick={onCloseModal}>
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>
                </div>
                <div className="px-8 pb-7">
                  <div className="flex items-start gap-3">
                    <Info className="mt-1" />
                    <div className="flex justify-center flex-col gap-1">
                      <p className="capitalize text-lg font-medium">
                        {" "}
                        {data.title}
                      </p>
                      <p className="text-base text-gray-700 dark:text-gray-500 font-normal">
                        {formattedTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground ml-1 mt-4">
                    <CalendarClock className="h-4 w-4"/>{" "}
                    <p className=" text-sm text-inherit ml-[17px]">
                      {user?.user?.fullName}
                    </p>
                  </div>
                </div>
               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default DeleteEventModal;
