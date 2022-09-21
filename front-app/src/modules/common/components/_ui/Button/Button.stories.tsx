// import CrossIcon from 'modules/common/components/_icons/cross.svg'
import * as React from "react";
import { Button, ButtonProps, BUTTON_COLORS, BUTTON_VARIANTS } from "./Button";

export default {
  title: "Common/UI/Button",
  component: Button,
  argTypes: {
    color: {
      defaultValue: "active",
      control: { type: "select", options: BUTTON_COLORS },
    },
    disabled: {
      defaultValue: undefined,
      control: "boolean",
    },
    isLoading: {
      defaultValue: false,
      control: "boolean",
    },
    variant: {
      defaultValue: "contained",
      control: {
        type: "select",
        options: BUTTON_VARIANTS,
      },
    },
    label: {
      defaultValue: "Click me",
      control: "text",
    },
  },
};

type DemoProps = ButtonProps & { label: string };

export const Demo = ({
  variant,
  color,
  disabled,
  label,
  isLoading,
}: DemoProps) => {
  return (
    <Button
      variant={variant}
      color={color}
      disabled={disabled}
      isLoading={isLoading}
    >
      {label}
    </Button>
  );
};

export const Variants = () => {
  return (
    <div>
      {BUTTON_VARIANTS.map((variantName) => (
        <div key={variantName} className="flex flex-col mb-20 space-y-4">
          <h2 className="font-bold">{variantName}</h2>
          <div className="flex items-center space-x-4">
            <p className="w-20">Plain</p>
            {BUTTON_COLORS.map((colorName) => {
              const buttonContent = `${variantName} ${colorName}`;
              return (
                <Button
                  key={`${variantName}${colorName}`}
                  variant={variantName as any}
                  color={colorName as any}
                >
                  {buttonContent}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <p className="w-20">Disabled</p>
            {BUTTON_COLORS.map((colorName) => {
              const buttonContent = `${variantName} ${colorName}`;
              return (
                <Button
                  key={`${variantName}${colorName}`}
                  variant={variantName as any}
                  color={colorName as any}
                  disabled
                >
                  {buttonContent}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <p className="w-20">Loading</p>
            {BUTTON_COLORS.map((colorName) => {
              const buttonContent = `${variantName} ${colorName}`;
              return (
                <Button
                  key={`${variantName}${colorName}`}
                  variant={variantName as any}
                  color={colorName as any}
                  isLoading
                >
                  {buttonContent}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
