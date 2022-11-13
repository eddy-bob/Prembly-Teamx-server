import moment from "moment";
export const format = (data: any) => {
  return {
    data,
    time: moment().format("hh:mm:ss A"),
  };
};
