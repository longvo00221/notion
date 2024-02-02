"use client";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock
} from "@blocknote/core";
import {
  BlockNoteView,
  useBlockNote
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { createReactEditorJS } from "react-editor-js";
import { useEdgeStore } from "@/lib/edgestore";
import { EDITOR_JS_TOOLS } from "./tools";
import { useCallback, useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";

import ImageTool from '@editorjs/image';
interface EditorProps {
  onChange: any;
  initialContent?: string;
  editable?: boolean;
  holder:string;
};

const Editor = ({  onChange, holder ,initialContent,editable}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }

  const ref = useRef<EditorJS | undefined>();
  useEffect(() => {
   
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        readOnly:editable,
        tools: {
          embed: Embed,
          table: Table,
          list: List,
          warning: Warning,
          code: Code,
          linkTool: LinkTool,
          image: {
            class: ImageTool,
            config: {
            
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */
                async uploadByFile(file:any){
                  const response = await edgestore.publicFiles.upload({ 
                    file
                  });
              
                  return {
                    success: 1,
                    file: {
                      url: response.url
                      // any other image data you want to store, such as width, height, color, extension, etc
                    }}
                  // your own uploading logic here
                  // return MyAjax.upload(file).then(() => {
                  //   return {
                  //     success: 1,
                  //     file: {
                  //       url: 'https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg',
                  //       // any other image data you want to store, such as width, height, color, extension, etc
                  //     }
                  //   };
                  // });
                },
      
             
              }
            }
          },
          raw: Raw,
          header: {
            class: Header,
            inlineToolbar: [ 'link' ],
            config: {
                placeholder: 'Header'
            },
            shortcut: 'CMD+SHIFT+H'
        },
          quote: Quote,
          marker: Marker,
          checklist: CheckList,
          delimiter: Delimiter,
          inlineCode: InlineCode,
          simpleImage: SimpleImage
        },
        data: initialContent ? JSON.parse(initialContent) : undefined,
        async onChange(api, event) {
          if(editable) return
          const data = await api.saver.save();
          onChange(JSON.stringify(data));
        },
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return (
    
    <div id={holder} className="prose  max-w-full" />

   
  );
};

export default Editor;