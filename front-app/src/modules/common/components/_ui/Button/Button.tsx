import clsx from "clsx";
import { useTheme } from "./Button.theme";
import React, {
  forwardRef,
  MouseEvent,
  PropsWithChildren,
  useMemo,
} from "react";
import { Spinner } from "../Spinner/Spinner";

export const BUTTON_VARIANTS = [
  "contained",
  "outline",
  "link",
  'icon',
  "none",
] as const;
export const BUTTON_COLORS = ["active"] as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[number];
export type ButtonColor = typeof BUTTON_COLORS[number];

export type ButtonDesignOptionProps = {
  variant: ButtonVariant;
  color?: ButtonColor;
};

export type ButtonBaseProps = {
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
} & (
  | (React.ComponentProps<"button"> & {
      as?: "button";
      href?: never;
      target?: never;
      rel?: never;
    })
  | (React.ComponentProps<"a"> & {
      as: "a";
      href: string;
      type?: never;
      target?: string;
      rel?: string;
    })
) & {
    onClick?: (
      event:
        | MouseEvent<HTMLButtonElement, MouseEvent>
        | MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => void;
  };

export type ButtonProps = ButtonBaseProps & ButtonDesignOptionProps;

export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      as: AsElement = "button",
      color,
      children,
      disabled,
      isLoading,
      variant,
      icon,
      ...buttonProps
    }: ButtonProps,
    ref
  ) => {
    const { buttonClasses, spinnerClasses } = useTheme({
      color,
      variant,
      disabled,
      isLoading,
    });

    return (
      <AsElement
        disabled={disabled}
        // Button and Anchor props keep clashing, any was the only workaround I found
        {...(buttonProps as any)}
        className={clsx(buttonClasses, buttonProps.className)}
        ref={ref}
      >
        {isLoading && <Spinner className="absolute" {...spinnerClasses} />}
        <span
          className={clsx(
            "flex flex-row items-center justify-center gap-2",
            isLoading && "bg-transparent text-transparent",
          )}
        >
          {icon}
          {children}
        </span>
      </AsElement>
    );
  }
);
