import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';

type Props = {
    text: string;
    date: string;
    dialogOpen: boolean;
    selectedDate: string; 
    isDateSelected: boolean;
    onSubmit: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleDialog: () => void;
};

export const FormDialog = (props: Props) => (
    <Dialog fullWidth open={props.dialogOpen} onClose={props.onToggleDialog}>
        <form
        onSubmit={(e) => {
            e.preventDefault();
        }}
        >
            <div style={{ margin: '1rem' }}>

            {props.isDateSelected && (
            <h3 style={{ textAlign: 'center' }}>{props.selectedDate}</h3>
            )}

                <TextField
                aria-label='todo-input'
                variant='standard'
                style={{
                    width: '100%',
                    fontSize: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif',
                }}
                label="タスクを入力"
                onChange={(e) => props.onChange(e)}
                value={props.text}
                autoFocus
                />

                <TextField
                aria-label='date-input'
                variant='standard'
                type='date'
                style={{
                    width: '100%',
                    marginTop: '1rem',
                    fontSize: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif',
                }}
                label="日付を選択"
                onChange={props.onDateChange}
                value={props.date}
                InputLabelProps={{
                    shrink: true,
                }}
                />

                <DialogActions>
                    <Button
                    aria-label='form-add'
                    color="secondary"
                    onClick={props.onSubmit}
                    >
                    追加
                    </Button>
                </DialogActions>
            </div>
        </form>
    </Dialog>
);