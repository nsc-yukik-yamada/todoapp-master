//アプリのコントロールをするクラス
class TodoController {
  constructor() {
    const btnRemoveItemId = "btn-delete-item";

    //document.querySelectorの仮名を作る
    let selector = document.querySelector.bind(document);

    //画面のインプットを呼び出してくる
    this.inputTodo = selector(".add-todo");
    this._ulTodos = selector("#sortable");
    this._ulDones = selector("#done-items");
    this._countTodos = selector(".count-todos");

    //画面のインプットにキーボードが押されたことを監視する。
    this.inputTodo.addEventListener(
      "keypress",
      function (event) {
        event.preventDefault;

        //押されたキーがEnterかどうかをチェック
        // if (event.key.toLowerCase() == 'enter') {

        if (isEquals("enter", event.key)) {
          //インプットの値が空ではないことをチェック
          if (event.target.value != "") {
            console.log(event.target.value);
            //TODOを追加するを呼び出す。
            this.addTodo(event.target.value);
          }
        }
      }.bind(this)
    );

    this._todoList = new TodoList();
    this._doneList = new DoneList();
    this._todoView = new TodoView(this._ulTodos);
    this._doneView = new DoneView(this._ulDones);

    this._ulDones.addEventListener(
      "click",
      function (event) {
        event.preventDefault;

        // console.log(event.target);
        // console.log(event.target.parentElement);
        let itemValue;

        if (isEquals(btnRemoveItemId, event.target.id)) {
          itemValue = event.target.value;
        } else if (isEquals(btnRemoveItemId, event.target.parentElement.id)) {
          itemValue = event.target.parentElement.value;
        }

        console.log(itemValue);

        if (itemValue) {
          this.deleteItem(itemValue);
        }
      }.bind(this)
    );

    // 画面を表示するときに、DBからデータを取得して表示する
    this._displayOpenTodos();

    // todoの数を数えて表示する
    this._updateTodosCount();
  }

  //TODO を追加する
  addTodo(inputValue) {
    //inputValueを使ってTodoオブジェクトを作成
    let todo = new Todo(inputValue);
console.log(`test`);
    // DBとの接続
    ConnectionFactory.getConnection()
      // todoDaoの作成
      .then((connection) => {
          console.log("maketodoDao");
        console.log(connection);  
        return new TodoDao(connection);
    }
      )
      // todoDaoを通して値を保存する
      .then((dao) => {
          console.log(todo);
        dao.storeTodo(todo);
      }) //todoDaoで保存を行う
      .catch((error) => {
        console.log(error);
        alert(`エラーが発生しました。ログを確認してください。`);
      });
    // データベースと接続し、TODOリストを取得する
    this._displayOpenTodos();

    //画面にリストを表示
    this._todoView.update(this._todoList.list);

    //インプットに入力されているものを消す。
    this.inputTodo.value = "";

    this._updateTodosCount();
  }

  //TODOを一つ完了状態にする
  finishTask(taskId) {
    let item = this._todoList.findItemById(taskId);

    if (item) {
      this._todoList.removeItem(item);

      item.done();

      this._doneList.addTodo(item);

      this._todoView.update(this._todoList.list);
      this._doneView.update(this._doneList.list);
    }

    this._updateTodosCount();
  }

  //TODOすべてを完了の状態にする
  allDone() {
    //_todoListの中に入っているTodoすべてをステータス１にする
    //Todoオブジェクトのdone()メソッドを呼ぶ
    this._todoList.list.forEach((todo) => {
      todo.done();
      //ステータス１のTodoを_doneListに追加する
      this._doneList.addTodo(todo);
    });

    //_todoListを空にする
    this._todoList.clearList();

    //_todoViewのupdateを呼ぶ
    this._todoView.update(this._todoList.list);

    //_doneViewのupdateを呼ぶ
    this._doneView.update(this._doneList.list);

    this._updateTodosCount();
  }

  deleteItem(itemId) {
    this._doneList.removeItemById(itemId);

    this._doneView.update(this._doneList.list);
  }

  _updateTodosCount() {
    this._countTodos.innerHTML = this._todoList.count;
  }

  // DBからデータを取得して表示する
  _displayOpenTodos() {
    // DBと接続をする
    ConnectionFactory.getConnection()
      // 成功した場合、TodoDaoを作成する
      .then((connection) => new TodoDao(connection))
      // DBからtodoリストを読み込む
      .then((dao) => dao.fetchOpenTodoAll())
      // TodoListに追加する
      .then((list) => {
        list.forEach((item) => this._todoList.addTodo(item));
        // 画面に_todoListの中身を表示させる
        this._todoView.update(this._todoList.list);
      })

      // エラーが発生したときはアラートメッセージを出す
      .catch((error) => {
        console.log(error);
        alert(`エラーが発生しました。ログを確認してください。`);
      });

    // 画面に表示する
  }
}
