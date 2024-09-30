import { useTheme } from "next-themes";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  filterSuggestionItems,
  PartialBlock,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  GridSuggestionMenuController,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { EditorProps } from "@/interfaces/interface";
import { useEdgeStore } from "@/lib/edgestore";
import { Mention } from "@/app/(main)/(routes)/_components/mention";

const Editor = ({
  onChange,
  initialContent,
  editable,
  shared,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const uploadFile = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
    return response.url;
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile,
    schema: BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        audio: undefined as any,
      },
      inlineContentSpecs: {
        ...defaultInlineContentSpecs,
        mention: Mention,
      },
    }),
  });

  const getMentionMenuItems = (editor: any): DefaultReactSuggestionItem[] => {
    return shared.map((email) => {
      return {
        title: email,
        onItemClick: () => {
          editor.insertInlineContent([
            {
              type: "mention",
              props: {
                user: email,
              },
            },
            " ",
          ]);
        },
      };
    });
  };

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
        {shared.length >= 2 && (
          <SuggestionMenuController
            triggerCharacter={"@"}
            getItems={async (query) =>
              filterSuggestionItems(getMentionMenuItems(editor), query)
            }
          />
        )}
      </BlockNoteView>
    </div>
  );
};

export default Editor;
