import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { DB } from ".";
import { OTP, TUser } from "../Types";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

const __instance = DB.getInstance();

type LoginType = {
  role: string;
  _userName: string;
  _name: string;
  _userId: string;
  avatar: string;
  background_img: string;
};

const Authentication = {
  Login: async (account: string, password: string): Promise<LoginType> => {
    const rows = await __instance._execute<TUser>(
      "Select role, _userName,_name,_password , _userId, avatar, background_img From user where _account = ?",
      [account]
    );
    if (rows.length === 1) {
      const responseCompare = await bcrypt.compare(password, rows[0]._password);
      if (responseCompare) {
        const { _password, ...props } = rows[0];
        return {
          ...props,
        };
      }
    }
    throw new ResponseError("The user name or password is incorrect!", 401);
  },
  Logout: async (refreshToken: string) => {
    __instance
      ._execute("Delete from refreshToken where _token = ?", [refreshToken])
      .catch((err) => console.log(err));
  },
  Register: async ({
    _account,
    _password,
    otp,
    _phoneNumber,
    _name,
  }: Omit<TUser, "role" | "_userId">) => {
    const rows = await __instance._execute<OTP>(
      "Select * From otp where _account = ? and token = ? ",
      [_account, otp]
    );
    if (
      rows.length >= 1 &&
      new Date(rows[0]._expire).getTime() > new Date().getTime()
    ) {
      const hashPassword = await bcrypt.hash(_password, 10);
      await __instance._execute(
        "Insert into user values(?,?,?,?,?,?,?,?,?,?)",
        [
          uuidv4(),
          _account,
          uuidv4(),
          hashPassword,
          _phoneNumber,
          0,
          null,
          null,
          _name,
          new Date(),
        ]
      );
    } else {
      throw new ResponseError("OTP is expired", 408);
    }
  },
  RefreshToken: async (refreshToken: string) => {
    return __instance._execute("Select * from refreshToken where _token = ?", [
      refreshToken,
    ]);
  },
  CheckUserExists: async (account: string): Promise<TUser[]> => {
    return __instance._execute("Select * From user Where _account = ?", [
      account,
    ]);
  },
};
export default Authentication;
