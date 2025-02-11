import { useState } from 'react';

// Todo型を定義
type Todo = {
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
};

// Filter型定義
type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

export const App = () => {

  const [text,setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter,setFilter] = useState<Filter>('all');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  // Todo作成処理
  const handleSubmit = () => {
    if (!text) return;
    // 新しいToDoを作成
    // Todo型に限定
    const newTodo: Todo = {
      value : text,
      id: new Date ().getTime(),
      checked: false,
      removed: false,
    };

    setTodos((todos) => [newTodo, ...todos]);
    setText('');
    };

    const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
      id: number,
      key: K,
      value: V,
    ) => {
      setTodos((todos) => {
        const newTodos = todos.map((todo) => {
          if (todo.id === id) {
            return {...todo, [key]: value };
          }
          else {
            return todo;
          }
        });
        return newTodos
      });
    };

    // Todo編集処理
  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {...todo, value};
      }
      return todo;
    });
      return newTodos;
    });
  };

    // Todo削除処理
    const handleRemove = (id: number, removed: boolean) => {
      setTodos((todos) => {
        const newTodos= todos.map((todo) => {
          if (todo.id === id) {
            return {...todo, removed };
          }
          return todo;
        });
        return newTodos;
      });
    };

  // チェックボックスのチェック処理
  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, checked };  
        }
        return todo;
      });
      return newTodos;
    });
  };

  // フィルター処理
  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const filterTodos = todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked && !todo.removed;
      case 'unchecked':
        return !todo.checked && !todo.removed
      case 'removed':
        return todo.removed;
      default:
        return todo;
    }
  });

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };  

  return (
    <div>
      <select defaultValue="all" onChange={(e) => handleFilter(e.target.value as Filter)}>
        <option value="all">全てのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="uncheked">現在のタスク</option>
        <option value="removed">ゴミ箱</option> 
      </select>

      {filter === 'removed' ? (
        <button onClick= {handleEmpty} disabled={todos.filter((todo) => todo.removed).length === 0}>ゴミ箱を空にする</button>
      ) : (
        filter !== 'checked' && (
          <form onSubmit={(e) => {e.preventDefault();handleSubmit();
          }}
      >
        <input type = "text" value={text} onChange={(e) => handleChange(e)} />
        <input type = "submit" value="追加" onSubmit={handleSubmit}/>
      </form>
        )
      )}

      <ul>
        {filterTodos.map((todo) => {
          return (
          <li key={todo.id}>
            <input type="checkbox" disabled={todo.removed} checked={todo.checked} onChange={() => handleTodo(todo.id, 'checked', !todo.checked)}/>
            <input type="text" disabled={todo.checked || todo.removed} value={todo.value} onChange={(e) =>handleTodo(todo.id, 'value', e.target.value)}/>
            <button onClick={() => handleTodo(todo.id, 'removed', !todo.removed)}>{todo.removed ? '復元' : '削除'}</button> 
          </li>
          );
        })}
      </ul>
    </div>
  );
};