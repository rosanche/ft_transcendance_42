import clsx from 'clsx'

export interface SpinnerProps {
  className?: string
  circleClassName?: string
  circleBgClassName?: string
}
export const Spinner: React.FC<SpinnerProps> = ({
  className,
  circleClassName = 'opacity-75',
  circleBgClassName = 'opacity-25',
}) => {
  return (
    <svg
      className={clsx('animate-spin h-5 w-5', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className={circleBgClassName}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className={circleClassName}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
