//TodoList、DoneListのベースとなるクラス
class BaseList {

    constructor() {
        //TODOのリストを保持するための変数
        this._list = [];
    }

    get list() {
        return this._list;
    }


    //アイテムを追加する
    //パラメータで渡されたTodoをリストの最後に追加する
    addTodo(todo){
        this._list.push(todo);
    }


    //リストを空にするメソッド
    clearList() {
        this._list = [];
    }

    //アイテムのId使ってリスト内から検索するメソッド
    findItemById(itemId) {
        throw new Error('アイテムのIDを使ってリスト内のアイテムの検索する方法を実装してください');
    }

    //リスト内のアイテムを削除する
    removeItem(item) {
        //TODOがリストのどのポジションにいるのかを探す
        let position = this._list.indexOf(item); 

        //ポジションが0以上かどうかをチェック
        if(position >= 0) {
            //ポジションから1個データを削除
            this._list.splice(position, 1);
        }
    }

    addAll(newList) {
        
        this.clearList();
        this._list = newList;
      }
    
}