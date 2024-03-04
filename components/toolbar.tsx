"use client";
import { Doc } from "@/convex/_generated/dataModel";
import React, { ElementRef, useRef, useState } from "react";
import IconPicker from "./icon-picker";
import { ImageIcon, Smile, X } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/useCoverImage";
type ToolbarProps = {
  initialData: Doc<"documents">;
  preview?: boolean;
};

const Toolbar: React.FC<ToolbarProps> = ({ initialData, preview }) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialData.title);
  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);
  const coverImage = useCoverImage()
  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };
  const disableInput = () => setIsEditing(false);
  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id
    })
  }

  return (
    <div className={`${!!initialData.icon && !preview ? "pl-[0px]" : "px-[54px]" } group relative`}>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>

      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">
          {initialData.icon}
        </p>
      )}

      {isEditing && !preview ? (
        <TextareaAutosize
          maxLength={60}
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
       
          <div className="flex items-center pb-[11.5px] pt-6">
            {!!initialData.icon && !preview && (
              <div className="flex flex-row-reverse justify-end items-center gap-x-1 group/icon ">
                <IconPicker onChange={onIconSelect}>
                  <p className="text-6xl hover:opacity-75 transition">
                    {initialData.icon}
                  </p>
                </IconPicker>
                <Button
                  onClick={onRemoveIcon}
                  className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground"
                  variant="outline"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>

              </div>

            )}
            <div
              onClick={enableInput}
              className=" text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
            >
              {initialData.title}
            </div>
          </div>

      )}
    </div>
  );
};
export default Toolbar;
