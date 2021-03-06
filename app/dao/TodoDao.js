// 特定クラスのオブジェクトとDBの間を取り持つクラス

class TodoDao {
  // データベースとの接続が必要
  constructor(connection) {
    this._connect = connection;
  }

  //   未完了TODOを獲得する
  fetchOpenTodoAll() {
    return new Promise((resolve, reject) => {
      this._connect.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM todo WHERE status = 0;`,
          [],
          // 成功したとき
          (tx, result) => {
            let todoList = [];
            for (let i = 0; i < result.rows.length; i++) {
              let data = result.rows.item(i);

              todoList.push(new Todo(data.name, data.id, data.status));
            }
            resolve(todoList);
          },

          // 失敗したとき
          (tx, error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    });
  }

  //   完了TODOを獲得する
  fetchCompleteTodoAll() {
    return new Promise((resolve, reject) => {
      this._connect.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM todo WHERE status = 1;`,
          [],
          // 成功したとき
          (tx, result) => {
            let doneList = [];
            for (let i = 0; i < result.rows.length; i++) {
              let data = result.rows.item(i);

              doneList.push(new Todo(data.name, data.id, data.status));
            }
            resolve(doneList);
          },

          // 失敗したとき
          (tx, error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    });
  }

  // todoをデータベースに登録する
  storeTodo(todo) {
    return new Promise((resolve, reject) => {
      // DBとの接続からトランザクションを作成する
      this._connect.transaction((tx) => {
        // テーブルにデータを登録するSQLコマンドを実行
        tx.executeSql(
          `INSERT INTO todo(name) VALUES($1)`,
          [todo.name], //パラメータとして名前を渡す
          // 成功したときの処理
          (tx, result) => {
            resolve();
          },
          // 失敗したときの処理（エラーログの書き出し）
          (tx, error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    });
  }

  // todoを完了にする
  completeTodo(taskId) {
    console.log(taskId);
    return new Promise((resolve, reject) => {
      this._connect.transaction((tx) => {
        tx.executeSql(
          `UPDATE todo SET status = 1 WHERE id = ${taskId}`,
          [],
          (tx, lesult) => resolve(),
          (tx, error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    });
  }

  deleteDoneItem(itemId) {
    return new Promise((resolve, reject) => {
      this._connect.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM todo WHERE id = ${itemId}`,
          [],
          (tx, lesult) => resolve(),
          (tx, error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    });
  }
}
