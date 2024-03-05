/* eslint-disable @next/next/no-img-element */
"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useNotification } from "@/hooks/useNotification";
import Image from "next/image";
type NotificationModalProps = {};

const NotificationModal: React.FC<NotificationModalProps> = () => {
  const notification = useNotification();
  return (
    <Dialog open={notification.isOpen} onOpenChange={notification.onClose}>
      <DialogContent className="dark:text-white/75 text-black md:max-w-2xl">
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">New Features</h2>
        </DialogHeader>

        <div className="md:max-w-2xl max-w-md mx-auto my-4  bg-white rounded-lg max-h-[500px] overflow-scroll scrollbar-none">
          
          <img src="/newfeature.jpg" alt="new feature" className="w-full md:h-[320px] object-cover"/>
          <div className="mt-10">
            <h3 className="text-base font-semibold mb-2">Calendar Schedule</h3>
            <p className="text-sm text-muted-foreground mb-10">
              This feature allows users to manage their schedules effortlessly.
              You can add events such as meetings, important appointments to
              your calendar. For example, you can set up a meeting at 2 PM on
              Monday. This feature helps users organize their time more
              efficiently.
            </p>
            <h3 className="text-base font-semibold mb-2">Todo App</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The Todo app is designed to help users manage tasks that need to
              be completed. It includes three main states: &quot;Todo&quot;
              (tasks to be done), &quot;Processing&quot; (ongoing tasks), and
              &quot;Success&quot; (completed tasks). Users can add new tasks,
              mark tasks as completed, and manage their task lists efficiently.
              Additionally, tasks in the Todo App can be dragged and dropped,
              providing users with an intuitive way to reorder and prioritize
              their tasks.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default NotificationModal;
