import { DB } from ".";
import { TUser } from "../Types";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import bcrypt from "bcryptjs";

const __instance = DB.getInstance();

const User = {
  getByAccount: (account: string) => {
    if (account) {
      return __instance._execute(
        "Select role, avatar, background_img, _account , _phoneNumber, _userId , _userName  From user Where _account = ?",
        [account]
      );
    }
    throw new ResponseError("Internal Server Error", 500);
  },
  getById: (id: string): Promise<Omit<TUser[], "otp">> => {
    if (id) {
      return __instance._query<TUser>(
        "Select _userId,_account,_name,_userName,_phoneNumber,avatar,background_img,role,_createAt   From user Where _userId = ?",
        [id]
      );
    }
    throw new ResponseError("userId is empty", 400);
  },
  getByUserName: (id: string): Promise<Omit<TUser[], "otp" | "_password">> => {
    if (id) {
      return __instance._execute<TUser>(
        "Select _userId,_account,_name,_userName,_phoneNumber,avatar,background_img,role  From user Where _userName = ?",
        [id]
      );
    }
    throw new ResponseError("userId is empty", 400);
  },
  getAll: (id?: string) => {
    return __instance._execute(
      "Select role, avatar, background_img, _account , _phoneNumber, _userId , _userName  From user"
    );
  },
  update: (field: string[], params: string[], id: string) => {
    let sql = `Update user set ${field.join(" = ?, ")} = ? where _userId = ?`;

    return __instance._execute(sql, [...params, id]);
  },
  updateInfo(params: Omit<TUser, "_userId">, _userId: string) {
    let queries = [];
    for (const key in params) {
      queries.push(`${key}= '${params[key as keyof Omit<TUser, "_userId">]}' `);
    }
    if (queries.length) {
      const query = queries.join(" and ");
      return __instance._query(`Update user set ${query} where _userId = ?`, [
        _userId,
      ]);
    }
  },
  checkExistedUserName({ _userName }: Pick<TUser, "_userName">) {
    return __instance._query<{ _userName: string }>(
      "Select _userName from user where _userName = ?",
      [_userName]
    );
  },
  async getPass({ UID }: { UID: string }): Promise<string | undefined> {
    const res = await __instance._query<{ _password: string }>(
      "Select _password from user where _userId = ?",
      [UID]
    );
    return res?.[0]._password;
  },
  async changePass({
    UID,
    newPass,
    oldPass,
  }: {
    UID: string;
    newPass: string;
    oldPass: string;
  }): Promise<{ err?: string }> {
    const pass = await __instance._query<{ _password: string }>(
      "Select _password from user where _userId = ?",
      [UID]
    );
    if (pass?.[0]._password) {
      const responseCompare = await bcrypt.compare(oldPass, pass[0]._password);
      if (responseCompare) {
        const hashPassword = await bcrypt.hash(newPass, 10);
        await __instance._query(
          "Update user set _password = ? where _userId = ? ",
          [hashPassword, UID]
        );
        return {};
      }
    }
    return { err: "The password is incorrect!" };
  },
  async searchUserByName({ userName }: { userName: string }) {
    return await __instance._query(
      "Select distinct _userId, _userName, avatar, _name, f._status from user as u left join Friends as f on  f._UID1 = u._userId or f._UID2 = u._userId where _name like ?",
      [`%${userName}%`]
    );
  },
};
export default User;
