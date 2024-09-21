import { createReactInlineContentSpec } from "@blocknote/react";

export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return (
        <span style={{ backgroundColor: "#8400ff33" }}>
          @{props.inlineContent.props.user}
        </span>
      );
    },
  }
);
