import localforage from 'localforage';
import GlobalStyles from '@mui/material/GlobalStyles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import allLocales from '@fullcalendar/core/locales-all';

import { useEffect,useState } from 'react';
import { useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo, lightBlue, pink } from '@mui/material/colors';
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { ToolBar } from './ToolBar';
import { FormDialog } from './FormDialog';
import { SideBar } from './SideBar';
import { TodoItem } from './TodoItem';
import { QR } from './QR';
import { AlertDialog } from './AlertDialog';
import { ActionButton } from './ActionButton';
import { styled } from "@mui/material/styles";


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
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [isDateSelected, setIsDateSelected] = useState(false); // 日付が選択されたか


  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleDialog = () => {
    setDialogOpen(prev => !prev);
    setIsDateSelected(false); 
  
    if (!isDateSelected) {
      setDate(""); 
    }
  };
  
  const handleToggleAlert = () => {
    setAlertOpen((alertOpen) => !alertOpen);
  };

  const handleToggleQR = () => {
    setQrOpen((qrOpen) => !qrOpen);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen((drawerOpen) => !drawerOpen);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> 
  ) => { setText(e.target.value); };

  const handleSubmit = () => {
    if (!text) {
      setDialogOpen((dialogOpen) => !dialogOpen);
      return;
    };

    const newTodo: Todo = {
      value : text,
      id: new Date ().getTime(),
      checked: false,
      removed: false,
      date: date,
    };

    setTodos((todos) => [newTodo, ...todos]);
    setText('');
    setDate(new Date().toISOString().slice(0, 10));
    setDialogOpen((dialogOpen) => !dialogOpen);
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

  const handleDateClick = useCallback((arg: DateClickArg) => {
    setDate(arg.dateStr); 
    setSelectedDate(arg.dateStr);
    setIsDateSelected(true);
    setDialogOpen(true);  
  }, []);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);       // `date` を更新
    setSelectedDate(e.target.value); // `selectedDate` も更新してダイアログのタイトルを変更
  };
  
  const CalendarContainer = styled("div")({
    maxWidth: "1000px", 
    margin: "0 auto",
    width: "100%",
    overflow: "hidden",
  });

    useEffect(() => {
      localforage.getItem<Todo[]>('todo-list').then((savedTodos) => {
        if (savedTodos) {
          setTodos(savedTodos);
        }
      });
    }, []);
  
    useEffect(() => {
      localforage.setItem('todo-list', todos);
    }, [todos]);

  return (
    <ThemeProvider theme={theme}>

      <GlobalStyles 
      styles={{ body: {margin :0, padding: 0 } }} 
      />

      <ToolBar 
      filter={filter} 
      onToggleDrawer={handleToggleDrawer}
      />

      <SideBar 
      drawerOpen={drawerOpen} 
      onFilter={handleFilter} 
      onToggleQR={handleToggleQR} 
      onToggleDrawer={handleToggleDrawer} 
      />

      <QR 
      open={qrOpen} 
      onClose={handleToggleQR} 
      />

      <FormDialog
      text={text}
      date={date}
      isDateSelected={isDateSelected}
      dialogOpen={dialogOpen}
      selectedDate={selectedDate}
      onChange={handleChange} 
      onSubmit={handleSubmit}
      onDateChange={handleDateChange}
      onToggleDialog={handleToggleDialog}
      />

      <AlertDialog 
      alertOpen={alertOpen} 
      onEmpty={handleEmpty} 
      onToggleAlert={handleToggleAlert} 
      />

      <TodoItem 
      todos={todos} 
      filter={filter} 
      onTodo={handleTodo} 
      />

      <ActionButton
        todos={todos}
        filter={filter}
        alertOpen={alertOpen}
        dialogOpen={dialogOpen}
        onToggleAlert={handleToggleAlert}
        onToggleDialog={handleToggleDialog} 
        />

    <CalendarContainer>
      {filter !== 'removed' && (
        <FullCalendar 
        plugins={[dayGridPlugin, interactionPlugin]} 
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        locales={allLocales}
        locale="ja"
        height="700px"
        events={todos .filter(todo => !todo.removed).map(todo => ({
          id: todo.id,
          title: todo.value,
          start: todo.date,
          color: todo.checked ? pink.A200 : lightBlue[500],
        }))}
        />
      )}
    </CalendarContainer>

    </ThemeProvider>
    
  );
};