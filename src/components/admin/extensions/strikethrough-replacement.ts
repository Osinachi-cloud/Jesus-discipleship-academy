import { Mark, mergeAttributes } from "@tiptap/core";

export interface StrikethroughReplacementOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    strikethroughReplacement: {
      setStrikethroughReplacement: (replacement: string) => ReturnType;
      toggleStrikethroughReplacement: (replacement: string) => ReturnType;
      unsetStrikethroughReplacement: () => ReturnType;
    };
  }
}

export const StrikethroughReplacement = Mark.create<StrikethroughReplacementOptions>({
  name: "strikethroughReplacement",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      replacement: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-replacement"),
        renderHTML: (attributes) => {
          if (!attributes.replacement) {
            return {};
          }
          return {
            "data-replacement": attributes.replacement,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-strikethrough-replacement]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-strikethrough-replacement": "",
        class: "strikethrough-replacement",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setStrikethroughReplacement:
        (replacement: string) =>
        ({ commands }) => {
          return commands.setMark(this.name, { replacement });
        },
      toggleStrikethroughReplacement:
        (replacement: string) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, { replacement });
        },
      unsetStrikethroughReplacement:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
