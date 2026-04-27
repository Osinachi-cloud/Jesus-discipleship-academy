import { Mark, mergeAttributes } from "@tiptap/core";

export interface ScriptureReferenceOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    scriptureReference: {
      setScriptureReference: (attributes: {
        reference: string;
        verseText: string;
      }) => ReturnType;
      toggleScriptureReference: (attributes: {
        reference: string;
        verseText: string;
      }) => ReturnType;
      unsetScriptureReference: () => ReturnType;
    };
  }
}

export const ScriptureReference = Mark.create<ScriptureReferenceOptions>({
  name: "scriptureReference",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      reference: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-reference"),
        renderHTML: (attributes) => {
          if (!attributes.reference) {
            return {};
          }
          return {
            "data-reference": attributes.reference,
          };
        },
      },
      verseText: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-verse-text"),
        renderHTML: (attributes) => {
          if (!attributes.verseText) {
            return {};
          }
          return {
            "data-verse-text": attributes.verseText,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-scripture-reference]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-scripture-reference": "",
        class: "scripture-reference",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setScriptureReference:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleScriptureReference:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetScriptureReference:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
