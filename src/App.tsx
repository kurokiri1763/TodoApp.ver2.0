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
import { QR } from './QR';


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

  const [qrOpen, setQrOpen] = useState(false);
  const handleToggleQR = () => {
    setQrOpen((qrOpen) => !qrOpen);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleToggleDrawer = () => {
    setDrawerOpen((drawerOpen) => !drawerOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleSubmit = () => {
    if (!text) return;

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

  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };  

    useEffect(() => {
      localforage
        .getItem('todo-20200101')
        .then((values) => isTodos(values) && setTodos(values as Todo[]));
    }, []);
  
    useEffect(() => {
      localforage.setItem('todo-20200101', todos);
    }, [todos]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: {margin :0, padding: 0 } }} />
      <ToolBar filter={filter} onToggleDrawer={handleToggleDrawer}/>
      <SideBar drawerOpen={drawerOpen} onFilter={handleFilter} onToggleQR={handleToggleQR} onToggleDrawer={handleToggleDrawer} />
      <QR open={qrOpen} onClose={handleToggleQR} />
      <FormDialog text={text} onChange={handleChange} onSubmit={handleSubmit} />
      <TodoItem todos={todos} filter={filter} onTodo={handleTodo} />
      <ActionButton todos={todos} onEmpty={handleEmpty} />
    </ThemeProvider>
  );
};