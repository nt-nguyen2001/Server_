import mysql, { Pool, RowDataPacket } from "mysql2";

export class DB {
  private static __instance: DB;
  private pool: Pool = mysql.createPool({
    host: process.env.HOST,
    // host: "aws.connect.psdb.cloud",
    user: process.env.USER,
    // user: "p9u7d63m8yua2fhac33t",
    password: process.env.PASSWORD,
    // password: "pscale_pw_EPFDye6jyCVc6wVbFQD6bLwnA9wtAEs6A14A5AKFI7j",
    database: process.env.DATABASE,
    // database: "social_network",
    // port: Number(process.env.PORT_DB),
    port: Number(process.env.PORT_DB),
    // connectionLimit: 10,
    // multipleStatements: true,
    // ssl: {
    //   rejectUnauthorized: true,
    // },
    // pool: process.env.PORT || 5000,
    // pool:
    // host: "mysql-122384-0.cloudclusters.net",
    // user: "admin",
    // password: "2YtjTjJE",
    // database: "social_network",
    // port: 17717,
  });
  //?
  private constructor() {
    this.pool.getConnection((err) => {
      if (err) {
        console.log("Connect DB failed", err);
        return;
      }
      console.log("Connect DB successfully");
    });
  }
  public static getInstance() {
    if (this.__instance == null) {
      return (this.__instance = new DB());
    }
    return this.__instance;
  }
  public _execute<T>(query: string, values?: any[]) {
    return new Promise<T[]>((resolve, reject) => {
      this.pool.execute<T[] & RowDataPacket[]>(
        query,
        values ?? [],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          const row = rows;
          resolve(row);
        }
      );
    });
  }
  public _query<T>(query: string, values?: any[]) {
    return new Promise<T[]>((resolve, reject) => {
      this.pool.query<T[] & RowDataPacket[]>(
        query,
        values ?? [],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          const row = rows;
          resolve(row);
        }
      );
    });
  }
}
