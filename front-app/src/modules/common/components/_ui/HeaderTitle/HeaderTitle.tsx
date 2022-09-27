interface Props {
  title: string;
}

export const HeaderTitle = ({ title }: Props) => {
  return (
    <span className="text-white text-5xl font-default font-bold mb-16 mt-6">
      {title}
    </span>
  );
};
