import clsx from "clsx";
import { useMemo } from "react";
import { SpinnerProps } from "../Spinner/Spinner";
import { ButtonColor, ButtonVariant } from "./Button";

type ButtonTheme = {
  [key in ButtonVariant]: { base: string } & {
    [key in ButtonColor]: {
      default: string;
      loading?: string;
    };
  };
};

type SpinnerTheme = {
  [key in ButtonVariant]?: {
    [key in ButtonColor]: Pick<
      SpinnerProps,
      "circleClassName" | "circleBgClassName"
    >;
  };
};

const BUTTON_THEME: ButtonTheme = {
  contained: {
    base: "inline-flex justify-center relative rounded-xl font-default font-bold text-sm border-3 border-solid px-4 py-3 appearance-none",
    active: {
      default:
        "text-white bg-pink border-pink hover:bg-pink-hover hover:border-pink-hover",
      loading: "bg-pink border-pink cursor-default",
    },
  },
  outline: {
    base: "inline-flex justify-center relative rounded-xl font-default font-bold text-sm border-3 border-solid p-4 appearance-none",
    active: {
      default:
        "border-texts-disabled hover:border-texts-placeholder text-texts",
      loading: "border-texts-disabled cursor-default",
    },
  },
  link: {
    base: "text-white hover:text-pink-pressed inline-flex justify-center relative font-default text-base italic appearance-none",
    active: {
      default: "text-pink hover:text-pink-pressed",
    },
  },
  icon: {
    base:
      'inline-flex justify-center items-center items-center relative rounded-md font-headings font-bold text-sm text-white border-solid appearance-none hover:text-pink',
    active: {
      default: 'hover:text-pink',
      loading: 'cursor-default pointer-events-none',
    },
  },
  none: {
    base: "relative appearance-none",
    active: {
      default: "text-pink hover:text-pink-pressed",
    },
  },
};

const SPINNER_THEME: SpinnerTheme = {
  contained: {
    active: {
      circleClassName: "text-white",
      circleBgClassName: "text-pink-pressed",
    },
  },
  outline: {
    active: {
      circleClassName: "text-borders-disabled",
      circleBgClassName: "text-texts-disabled",
    },
  },
};

interface Props {
  variant: ButtonVariant;
  color: ButtonColor | undefined;
  disabled?: boolean;
  isLoading?: boolean;
}

export const useTheme = ({ variant, color, disabled, isLoading }: Props) => {
  const buttonClasses = useMemo(() => {
    return clsx(
      BUTTON_THEME[variant].base,
      isLoading,
      !!color && {
        [BUTTON_THEME[variant][color]["default"]]: !isLoading && !disabled,
        [BUTTON_THEME[variant][color]["disabled"]]: !isLoading && disabled,
        [BUTTON_THEME[variant][color]["loading"] || ""]: isLoading,
      }
    );
  }, [variant, color, disabled, isLoading]);

  const spinnerClasses = useMemo(() => {
    if (color) {
      return SPINNER_THEME[variant]?.[color];
    }
  }, [color, variant]);

  return { buttonClasses, spinnerClasses };
};
