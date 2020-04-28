const ConnectionFactory = (function () {
  // dbサイズ
  const dbSize = 1024 * 1024 * 2; //2Mb

  //   db名前
  const dbName = `todo.db`;

  const dbVersion = `1`;
  const dbDisplayName = `tododb`;
  let connection = null;

  return class ConnectionFactory {
    constructor() {
      throw new Errow(`Can not create an instrance of ConnectionFactory`);
    }

    // データベースに接続するメソッド
    static getConnection() {
      return new Promise((resolve, reject) => {
        try {
          connection = openDatabase(dbName, dbVersion, dbDisplayName, dbSize);

          ConnectionFactory._migrateDb()
            .then(resolve(connection))
            .catch((error) => {
              console.log(error);
              reject(error);
            });
          // resolve(connection);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    }

    // DBのテーブルの作成更新を行う
    static _migrateDb() {
      return new Promise((resolve, reject) => {
        let sql = ``;
        // id:int(key) name:text status:intのDBを作成する
        sql += `CREATE TABLE IF NOT EXISTS todo(\
                    id INTEGER PRIMARY KEY AUTOINCREMENT,\
                    name TEXT,\
                    status INTEGER DEFAULT 0);`;
console.log(connection);

        // switch (dbVersion) {
        //   case `1`:
        //       console.log(`openDB`);
        //     sql += `CREATE TABLE IF NOT EXISTS todo(\
        //             id INTEGER PRIMARY KEY AUTOINCREMENT,\
        //             name TEXT,\
        //             status INTEGER DEFAULT 0);`;
        //     break;

        //   default:
        //     console.log(`letsError`);

        //     throw new Error(`get error`);
        // }

        // トランザクションを開く
        connection.transaction((tx) => {
          tx.executeSql(
            // SQLコマンド
            sql,
            // パラメーター
            [],
            // 成功したとき
            (tx, result) => resolve(result),
            // 失敗したとき
            (tx, error) => reject(error)
          );
        });
      });
    }
  };
})();
