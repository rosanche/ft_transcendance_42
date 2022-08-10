import clsx from "clsx";
import CrossIcon from "modules/common/components/_icons/cross.svg";
import {
  FocusEventHandler,
  forwardRef,
  HTMLProps,
  useState,
} from "react";
import { Control, FieldError, useWatch } from "react-hook-form";

export interface TextFieldProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  control?: Control<any>;
  className?: string;
  inputClassName?: string;
  reset?: () => void;
  ref?: any;
  name: string;
}

export const TextField = forwardRef<any, TextFieldProps>(
  (
    {
      label,
      error,
      control,
      className,
      reset,
      inputClassName,
      type = "text",
      ...inputProps
    },
    ref
  ) => {
    const { disabled, id, onBlur, onChange, readOnly } = inputProps;
    const [isFocused, setIsFocused] = useState(false);

    const classNameInput = clsx([
      "border-0 ring-borders appearance-none rounded-lg w-full px-3 focus:outline-none focus:ring-0",
      (disabled || readOnly) &&
        "bg-backgrounds-disabled text-texts-disabled ring-borders-disabled pointer-events-none cursor-default",
      error || isFocused ? "ring-0" : "ring-1",
      isFocused && !error && "shadow-textfield-primary",
      error && "shadow-textfield-danger",
      inputClassName,
      label ? "py-4" : "py-3",
    ]);

    const onFocus: FocusEventHandler<HTMLInputElement> = (e) => {
      setIsFocused(true);
      inputProps.onFocus?.(e);
    };

    return (
      <div className={clsx("relative", className)}>
        {label && (
          <label
            htmlFor={id}
            className={clsx([
              "label absolute left-3 mt-4 leading-tighter text-base cursor-text origin-top-left transition-transform pointer-events-none",
              (disabled || readOnly) &&
                "text-texts-disabled pointer-events-none cursor-default",
              isFocused && !error && "text-primary",
              !!error && "text-danger",
            ])}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={classNameInput}
          {...inputProps}
          onFocus={onFocus}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
        />
      </div>
    );
  }
);
