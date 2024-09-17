import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  PartialBlock,
} from "@blocknote/core";
import {
  GridSuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { EditorProps } from "@/interfaces/interface";
import { useEdgeStore } from "@/lib/edgestore";

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const uploadFile = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile,
    schema: BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        audio: undefined as any,
      },
    }),
  });

  return (
    <div>
      <BlockNoteView
        editable={editable}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => {
          onChange(JSON.stringify(editor.document, null, 2));
        }}
      >
        <GridSuggestionMenuController
          triggerCharacter={":"}
          columns={5}
          minQueryLength={2}
        />
      </BlockNoteView>
    </div>
  );
};

export default Editor;
