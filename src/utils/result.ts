export const getSuccess = (result: any) => {
  return {
    code: 200,
    content: result,
  };
};
export const getError = (errorMsg: string, code = 500) => {
  return {
    msg: errorMsg,
    code,
  };
};
