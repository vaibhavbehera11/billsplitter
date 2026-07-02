function ParticipantChip({
  name,
  selected = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        px-4
        py-2
        rounded-full
        font-medium
        whitespace-nowrap
        cursor-pointer
        transition-colors

        ${
          selected
            ? "bg-indigo-600 text-white"
            : "bg-indigo-100 text-indigo-700"
        }
      `}
    >
      {name}
    </div>
  );
}

export default ParticipantChip;