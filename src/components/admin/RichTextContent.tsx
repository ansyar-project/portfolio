"use client";

import React from "react";

interface RichTextContentProps {
  content: string;
  className?: string;
}

/**
 * Renders rich text content (HTML) or plain text gracefully.
 * Detects if content is HTML and renders accordingly.
 */
export default function RichTextContent({
  content,
  className = "",
}: RichTextContentProps) {
  if (!content) {
    return null;
  }

  // Check if content looks like HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className={`prose dark:prose-invert prose-sm max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Plain text - wrap in paragraphs, preserving line breaks
  return (
    <div className={`prose dark:prose-invert prose-sm max-w-none ${className}`}>
      {content.split("\n\n").map((paragraph, index) => (
        <p key={index}>
          {paragraph.split("\n").map((line, lineIndex, arr) => (
            <React.Fragment key={lineIndex}>
              {line}
              {lineIndex < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
