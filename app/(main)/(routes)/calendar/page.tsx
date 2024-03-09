"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import AddNewEventModal from "@/components/AddNewEventModal";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import DeleteEventModal from "@/components/DeleteEventModal";

export interface Event {
  title: string;
  daytime: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  idc?: any;
}

type CalendarPageProps = {};
const parseEventsFromData = (calendarSchedule: any): Event[] => {
  const events: Event[] = [];
  calendarSchedule.forEach((item: any) => {
    const schedules = JSON.parse(item.schedule);
    schedules.forEach((schedule: any) => {
      events.push({
        title: schedule.title,
        daytime: schedule.daytime,
        start: schedule.start,
        allDay: schedule.allDay,
        id: item._id,
      });
    });
  });

  return events;
};
const CalendarPage: React.FC<CalendarPageProps> = () => {
  const calendarSchedule = useQuery(api.calendar.getSchedule, {});
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<any>();
  const [scheduleData,setScheduleData] = useState<any>();
  const createSchedule = useMutation(api.calendar.createCalendarSchedule);
  const deleteSchedule = useMutation(api.calendar.removeSchedule);
  const [submitHandled, setSubmitHandled] = useState<boolean>(false);
  useEffect(() => {
    if (calendarSchedule) {
      const events = parseEventsFromData(calendarSchedule);
      setEvents(events);
    }
  }, [calendarSchedule]);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    daytime: "",
    start: "",
    allDay: false,
    id: 0,
  });

  useEffect(() => {
    let draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let id = eventEl.getAttribute("data");
          let start = eventEl.getAttribute("start");
          return { title, id, start };
        },
      });
    }
  }, []);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
    setShowModal(true);
  }
  // function handleEditEventTitle(id: string, value: string) {
  //   setEvents(
  //     events.map((event) =>
  //       event.id === id ? { ...event, title: value } : event
  //     )
  //   );
  // }
  // function addEvent(data: DropArg) {
  //   const event = {
  //     ...newEvent,
  //     start: data.date.toISOString(),
  //     title: (data.draggedEl as HTMLInputElement).value,
  //     allDay: data.allDay,
  //     id: new Date().getTime(),
  //   };
  // }
  // const inputRefs = useRef<RefsArray>([]);

  // const handleInputClick = (index: number) => {
  //   if (inputRefs.current[index]) {
  //     inputRefs.current[index]?.focus();
  //   }
  // }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(data.event.id);
    setScheduleData(data.event)
  }

  function handleDelete() {
    const promise = deleteSchedule({ id: idToDelete });
    toast.promise(promise, {
      loading: "Deleting schedule...",
      success: "Delete schedule success!",
      error: "Failed to delete schedule.",
    });
    setShowDeleteModal(false);
    setIdToDelete("");
  }

  function handleCloseModal() {
    setShowModal(false);
    setNewEvent({
      title: "",
      daytime: "",
      start: "",
      allDay: false,
      id: 0,
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }
  const onCreate = () => {
    const Event = [newEvent];
    const promise = createSchedule({ schedule: JSON.stringify(Event) });
    setNewEvent({
      title: "",
      daytime: "",
      start: "",
      allDay: false,
      id: 0,
    });
    toast.promise(promise, {
      loading: "Creating a new schedule...",
      success: "New schedule created!",
      error: "Failed to create a new schedule.",
    });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowModal(false);
    setSubmitHandled(true);
  }
  useEffect(() => {
    if (submitHandled) {
      onCreate();
      setSubmitHandled(false);
    }
  }, [submitHandled]);
  // type RefsArray = Array<HTMLInputElement | null>;
  function renderEventContent(eventInfo: any) {
    const dateTimeString = eventInfo.event._def.extendedProps.daytime;
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
      <div className="px-2 flex items-center">
        <p>{formattedTime}</p>
        <span className="ml-1 mr-2">|</span>
        <p className="w-full truncate">{eventInfo.event.title}</p>
      </div>
    );
  }

  return (
    <>
      <nav className="flex justify-between mb-12 shadow-md border-violet-100 dark:bg-[#161616] px-2 py-[5px]">
        <h1 className="font-bold pl-10 text-2xl text-gray-700 dark:text-white">
          Calendar
        </h1>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-10">
        <div className="w-full">
          <div className="col-span-8">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              events={events as EventSourceInput}
              eventContent={renderEventContent}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              // drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
            />
          </div>
          {/* <div
            id="draggable-el"
            className="ml-8 border p-2 md:w-[200px] w-full rounded-md mt-16 lg:h-1/2 bg-white shadow-lg dark:bg-[#161616]"
          >
            <h1 className="font-bold text-lg text-center">Drag Event</h1>

            {events.map((event, index) => (
              <input
                type="text"
                ref={(el) => (inputRefs.current[index] = el)}
                onClick={() => handleInputClick(index)}
                key={event.id}
                value={event.title}
                className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-[#272727] dark:hover:bg-black relative bg-transparent text-muted-foreground  border-none outline-none"
                onChange={(e) => handleEditEventTitle(event.id, e.target.value)}
              />
            ))}
          </div> */}
        </div>

        {/* <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={setShowDeleteModal}
          >
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
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                     bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div
                          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                        justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                        >
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Delete Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                        font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                        shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root> */}
        <DeleteEventModal
          onClick={handleDelete}
          onCloseModal={handleCloseModal}
          setShowModal={setShowDeleteModal}
          showModal={showDeleteModal}
          data={scheduleData}
        />
        <AddNewEventModal
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          onClick={handleSubmit}
          onCloseModal={handleCloseModal}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      </main>
    </>
  );
};
export default CalendarPage;
