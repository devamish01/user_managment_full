let counter = 1;

export const generateUserId = () => {
  const id = String(counter).padStart(5, "0");

  counter++;

  return `USR-${id}`;
};