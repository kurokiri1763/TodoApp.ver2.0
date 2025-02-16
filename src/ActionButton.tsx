type Props = {
    todos: Todo[];
    onEmpty: () => void;
};

export const ActionButton = (props:Props) => (
    <button onClick={props.onEmpty} disabled={props.todos.filter((todo) => todo.removed).length === 0}>
        ゴミ箱を空にする
    </button>
)