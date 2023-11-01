export const logError = (e: any, custom_msg: string) => {
  console.log(e);
  console.log(`custom_msg : ${custom_msg}`);
  e.message = custom_msg + " |||| " + e.message;
  return e;
};
