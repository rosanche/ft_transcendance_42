interface Props {
  title: string;
  info: number;
  type: string;
}

export const StatsItem = ({ title, info, type = "normal" }): Props => {
  let bgcolor =
    type == "positive"
      ? " bg-green"
      : type == "negative"
      ? " bg-pink-900"
      : "bg-pink";

  return (
    <div
      className={
        "flex flex-col m-2 min-w-min rounded-xl  text-center justify-around text-white " +
        bgcolor
      }
    >
      <span className="font-semibold text-xl ">{title}</span>
      <span className="font-semibold text-5xl ">{info}</span>
    </div>
  );
};
