function ParticipantChip({ name }) {
  return (
    <div
      className="
        px-4
        py-2
        rounded-full
        bg-indigo-100
        text-indigo-700
        font-medium
        whitespace-nowrap
      "
    >
      {name}
    </div>
  );
}

export default ParticipantChip;