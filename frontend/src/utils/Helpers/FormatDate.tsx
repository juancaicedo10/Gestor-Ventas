export const formatDate = (date: string) => {
  const fecha = date.split("T")[0];

  const [year, month, day] = fecha.split("-");
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};
