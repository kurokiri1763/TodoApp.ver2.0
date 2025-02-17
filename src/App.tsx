import localforage from 'localforage';
import GlobalStyles from '@mui/material/GlobalStyles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo, pink } from '@mui/material/colors';
import { ToolBar } from './ToolBar';
import { useEffect,useState } from 'react';
import { isTodos } from './lib/isTodos';
import { FormDialog } from './FormDialog';
import { ActionButton } from './ActionButton';
import { SideBar } from './SideBar';
import { TodoItem } from './TodoItem';

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
      light: '757de8',
      dark: '#002984',
    },
    secondary: {
      main: pink[500],
      light: '#ff6090',
      dark: '#b0003a',
    },
  },
});

export const App = () => {
  const [text,setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter,setFilter] = useState<Filter>('all');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleToggleDrawer = () => {
    setDrawerOpen((drawerOpen) => !drawerOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  // Todo作成処理
  const handleSubmit = () => {
    if (!text) return;

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

  // フィルター処理
  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };  

    /**
   * キー名 'todo-20200101' のデータを取得
   * 第 2 引数の配列が空なのでコンポーネントのマウント時のみに実行される
  */
    useEffect(() => {
      localforage
        .getItem('todo-20200101')
        .then((values) => isTodos(values) && setTodos(values as Todo[]));
    }, []);
  
    /**
     * todos ステートが更新されたら、その値を保存
    */
    useEffect(() => {
      localforage.setItem('todo-20200101', todos);
    }, [todos]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: {margin :0, padding: 0 } }} />
      <ToolBar filter={filter} />
      <SideBar onFilter={handleFilter} />
      <FormDialog text={text} onChange={handleChange} onSubmit={handleSubmit} />
      <TodoItem todos={todos} filter={filter} onTodo={handleTodo} />
      <ActionButton todos={todos} onEmpty={handleEmpty} />
    </ThemeProvider>
  );
};