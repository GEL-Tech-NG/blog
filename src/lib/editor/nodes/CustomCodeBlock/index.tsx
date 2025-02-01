import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import styles from "./CodeBlock.module.css";
import { useClipboard } from "@chakra-ui/react";
export const CustomCodeBlock = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => {
  return (
    <NodeViewWrapper
      className={`code-block ${defaultLanguage || ""} ${styles["code-block"]}`}
    >
      <select
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang, index) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};
CustomCodeBlock.displayName = "CustomCodeBlock";
