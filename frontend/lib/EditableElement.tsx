import React, { useEffect, useRef } from 'react';

export const EditableElement = ({
  onChange,
  children,
}: {
  onChange: (value: string) => void;
  children: React.ReactNode;
}) => {
  const element = useRef<HTMLElement>(null);
  let elements: React.ReactElement<any>[] = React.Children.toArray(children) as any;
  let debounceTimer: NodeJS.Timeout;
  if (elements.length > 1) {
    throw Error("Can't have more than one child");
  }
  const onMouseUp = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const value = element.current?.innerText;
      value && onChange(value);
    }, 1000);
  };
  useEffect(() => {
    const value = element.current?.innerText;
    value && onChange(value);
  }, []);
  elements = React.cloneElement(elements[0], {
    contentEditable: true,
    suppressContentEditableWarning: true,
    ref: element,
    onKeyUp: onMouseUp,
  }) as any;
  return elements as any;
};
