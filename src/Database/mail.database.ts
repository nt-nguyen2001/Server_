import { DB } from ".";
const __instance = DB.getInstance();

const Mail = {
  CreateOTP: async (token: string, account: string) =>
    __instance._execute("Insert into otp values(?,?,?)", [
      token,
      account,
      new Date(new Date().getTime() + 600000),
    ]),
};
export default Mail;
