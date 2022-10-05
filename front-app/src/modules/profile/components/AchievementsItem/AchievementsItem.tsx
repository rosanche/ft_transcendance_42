interface Props {
  texte: string;

  isValidatetype: boolean;
}

export const AchievementsItem = ({ text, isValidate = false }): Props => {
  let color = isValidate
    ? " outline-white text-black bg-amber-500 outline  outline-4"
    : " text-white bg-black border-2  border-slate-400";

  return (
    <div
      className={
        "flex flex-col m-2 min-w-min rounded-xl  text-center justify-around " +
        color
      }
    >
      <span className="font-semibold text-xl ">{text}</span>
    </div>
  );
};
