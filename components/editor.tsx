"use client";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";
import LinkTool from "@editorjs/link";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import LinkAutocomplete from '@editorjs/link-autocomplete'
import EditorJS from "@editorjs/editorjs";
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import NestedList from '@editorjs/nested-list';
import Alert from 'editorjs-alert';
import BreakLine from 'editorjs-break-line';
import editorjsColumns from '@calumk/editorjs-columns'
import Strikethrough from '@sotaproject/strikethrough';
import ToggleBlock from 'editorjs-toggle-block';
import anyButton  from 'editorjs-button'
// import ImageGallery from '@rodrigoodhin/editorjs-image-gallery'
import AttachesTool from '@editorjs/attaches';
import CodeTool from '@editorjs/code';
import TextVariantTune from '@editorjs/text-variant-tune';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import Underline from '@editorjs/underline';
import ChangeCase from 'editorjs-change-case';
import { useEdgeStore } from "@/lib/edgestore";

import { useEffect, useRef } from "react";
import ImageTool from '@editorjs/image';
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Annotation } from "./dist/bundle";

interface EditorProps {
  onChange: any;
  initialContent?: string;
  editable?: boolean;
  holder: string;
};

const Editor = ({ onChange, holder, initialContent, editable }: EditorProps) => {

  const { edgestore } = useEdgeStore();
  let column_tools = {
    header: Header,
    alert: Alert,
    paragraph: BreakLine,
    delimiter: Delimiter
  }

  const { resolvedTheme } = useTheme()
  const ref = useRef<EditorJS | undefined>();
  useEffect(() => {

    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        placeholder: 'Use command / or click + icon to use tool',
        readOnly: editable,
        onReady: () => {
          new DragDrop(editor);
          new Undo({ editor });
        },
        
        tools: {
          textVariant: TextVariantTune,
          strikethrough: Strikethrough,
          table: Table,
         annotation:Annotation,
          warning: Warning,
          linkTool: LinkTool,
          code: CodeTool,
          quote: Quote,
          marker: Marker,
          delimiter: Delimiter,
          inlineCode: InlineCode,
          simpleImage: SimpleImage,
          raw: Raw,
          underline: Underline,
        
          AnyButton: {
            class: anyButton,
            inlineToolbar: false,
            config:{
              css:{
                "btnColor": "btn--gray",
              }
            }
          },
          checklist: {
            class: CheckList,
            inlineToolbar: true,
          },
          toggle: {
            class: ToggleBlock,
            inlineToolbar: true,
          },
          anyTuneName: {
            class: AlignmentTuneTool,
            config: {
              default: "left",
              blocks: {
                header: 'left',
                list: 'left'
              }
            }
          },
          paragraph: {
            tunes: ['textVariant', 'anyTuneName']
          },
          changeCase: {
            class: ChangeCase,
            config: {
              showLocaleOption: true,
              locale: 'tr'
            }
          },
          columns: {
            class: editorjsColumns,
            config: {
              EditorJsLibrary: EditorJS,
              tools: column_tools
            }
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
                codepen:true
              }
            }
          },
          list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            },
            tunes: ['anyTuneName']
          },
          link: {
            class: LinkAutocomplete,
            config: {
              endpoint: 'http://localhost:3000/',
              queryParam: 'search'
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */
                async uploadByFile(file: any) {
                  try {
                    const response = await edgestore.publicFiles.upload({
                      file
                    });
                    return {
                      success: 1,
                      file: {
                        url: response.url

                      }
                    }
                  } catch (error) {
                    toast.error("Something went wrong please try again")
                  }
                },
              }
            }
          },
          attaches: {
            class: AttachesTool,
            config: {
              uploader: {
                async uploadByFile(file: any) {
                  try {
                    const response = await edgestore.publicFiles.upload({
                      file
                    });
                    const urlParts = response.url.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const [name, ext] = fileName.split('.');
                    console.log(urlParts)
                    console.log(name)
                    return {
                      success: 1,
                      file: {
                        url: response.url,
                        size: response.size,
                        name: name,
                        extension: ext,
                        title: name
                      }
                    }
                  } catch (error) {
                    toast.error("Something went wrong please try again")
                  }
                }
              }
            }
          },
          header: {
            class: Header,
            inlineToolbar: true,

            tunes: ['anyTuneName'],
            config: {

              placeholder: 'Header'
            },
            shortcut: 'CMD+SHIFT+H'
          },
        },

        data: initialContent ? JSON.parse(initialContent) : undefined,
        async onChange(api, event) {
          if (editable) return
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