import fw from '../framework/index.js';

const container = document.getElementById('app');

// set states
const todos = new fw.State([
  { id: 1, text: 'finish this task', completed: false },
  { id: 2, text: 'finish bomberman', completed: false },
  { id: 3, text: 'dont get expelled', completed: false },
]);

const currentFilter = new fw.State('all');

const completedCount = new fw.State(0);

// update completed count
todos.subscribe(updateCompletedCount);

// new Todo
let newTodo = '';
export const header = () => {
  return fw.header(
    { class: 'header' },
    fw.h1({}, 'todos'),
    fw.input({
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      oninput: (e) => {
        newTodo = e.target.value;
      },
      onkeydown: handleNewTodo,
    })
  );
};

const handleNewTodo = (e) => {
  if (e.key === 'Enter' && newTodo) {
    const id = Math.max(0, ...todos.getState().map((todo) => todo.id)) + 1;
    const newTodos = [
      ...todos.getState(),
      { id, text: newTodo, completed: false },
    ];
    todos.setState(newTodos);
    newTodo = '';
    e.target.value = '';
  }
};

// info section
const info = () => {
  return fw.footer(
    { class: 'info' },
    fw.p({}, 'Double-click to edit a todo'),
    fw.p(
      {},
      'Created by ',
      fw.a({ href: 'https://01.kood.tech/git/laurilaretei' }, 'larru')
    ),
    fw.p({}, 'Part of ', fw.a({ href: 'http://todomvc.com' }, 'TodoMVC'))
  );
};

// main section
const main = () => {
  return fw.section(
    { class: 'main' },
    fw.input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
    }),
    fw.label(
      { for: 'toggle-all', onclick: toggleAllTasks },
      'Mark all as complete'
    ),
    fw.bindToDOM(todosView, todos, keyFn)
  );
};

const toggleAllTasks = () => {
  const allCompleted = todos.getState().every((todo) => todo.completed);
  const newTodos = todos
    .getState()
    .map((todo) => ({ ...todo, completed: !allCompleted }));
  todos.setState(newTodos);
};

// todos view
const todosView = () => {
  const filteredTodos = todos.getState().filter((todo) => {
    if (currentFilter.getState() === 'active') {
      return !todo.completed;
    } else if (currentFilter.getState() === 'completed') {
      return todo.completed;
    } else {
      return true;
    }
  });

  return fw.ul(
    { class: 'todo-list' },
    ...filteredTodos.map((todo) =>
      fw.li(
        {
          id: `todo-${todo.id}`,
          class: todo.completed ? 'completed' : '',
        },
        todoItemView(todo)
      )
    )
  );
};

// todo item view
const todoItemView = (todo) => {
  const todoInputProps = {
    class: 'toggle',
    type: 'checkbox',
    onclick: (e) => {
      toggleCompleted(e, todo.id);
    },
  };

  if (todo.completed) {
    todoInputProps.checked = true;
  }

  return fw.div(
    { class: 'view' },
    fw.input(todoInputProps),
    fw.label({ ondblclick: (e) => handleEdit(e, todo.id) }, todo.text),
    fw.button({ class: 'destroy', onclick: (e) => destroyTodo(todo.id) })
  );
};

const toggleCompleted = (e, id) => {
  const updatedTodos = todos
    .getState()
    .map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  todos.setState(updatedTodos);
};

const handleEdit = (e, id) => {
  const listElement = e.target.closest('li');
  listElement.classList.add('editing');

  const todo = todos.getState().find((todo) => todo.id === id);
  const editor = fw.input({ id: 'edit', class: 'edit', value: todo.text });
  listElement.appendChild(editor);
  editor.focus();

  const onBlurred = () => {
    const newValue = editor.value.trim();

    if (newValue) {
      const updatedTodos = todos
        .getState()
        .map((todo) => (todo.id === id ? { ...todo, text: newValue } : todo));
      todos.setState(updatedTodos);
    }
    listElement.classList.remove('editing');
    editor.removeEventListener('blur', onBlurred);
    editor.removeEventListener('keydown', onKeydown);
    editor.remove();
  };

  const onKeydown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      const newValue = editor.value.trim();
      if (newValue) {
        const updatedTodos = todos
          .getState()
          .map((todo) => (todo.id === id ? { ...todo, text: newValue } : todo));
        todos.setState(updatedTodos);
      }
      listElement.classList.remove('editing');
      editor.removeEventListener('blur', onBlurred);
      editor.removeEventListener('keydown', onKeydown);
      editor.remove();
    }
  };

  editor.addEventListener('blur', onBlurred);
  editor.addEventListener('keydown', onKeydown);
};

const destroyTodo = (id) => {
  const updatedTodos = todos.getState().filter((todo) => todo.id !== id);
  todos.setState(updatedTodos);
};

const destroyTodoCompleted = () => {
  const updatedTodos = todos.getState().filter((todo) => !todo.completed);
  todos.setState(updatedTodos);
};

// footer
const footer = () => {
  const hasTodos = todos.getState().some((todo) => todo);
  return fw.footer(
    {
      class: 'footer',
      style: `display: ${hasTodos ? 'block' : 'none'}`,
    },
    fw.bindToDOM(itemCount, todos, keyFn),
    fw.bindToDOM(filters, todos, keyFn),
    fw.bindToDOM(clearCompleted, todos, keyFn)
  );
};

const itemCount = () => {
  return fw.span(
    { class: 'todo-count' },
    `${completedCount.getState()} items left`
  );
};

const filters = () => {
  if (todos.getState().length === 0) return null;

  const filterList = ['all', 'active', 'completed'];

  return fw.ul(
    { class: 'filters' },
    ...filterList.map((filter) =>
      fw.li(
        {},
        fw.a(
          {
            'data-use-router': 'true', // Add this line to the anchor tag
            class: currentFilter.getState() === filter ? 'selected' : '',
            href: filter === 'all' ? '/' : `/${filter}`,
            onclick: () => {
              currentFilter.setState(filter);
            },
          },
          filter
        )
      )
    )
  );
};

const clearCompleted = () => {
  const hasCompletedItems = todos.getState().some((todo) => todo.completed);
  return fw.button(
    {
      class: 'clear-completed',
      style: `display: ${hasCompletedItems ? 'block' : 'none'}`,
      onclick: destroyTodoCompleted,
    },
    'Clear completed'
  );
};

// app
const TodoApp = () => {
  updateCompletedCount();

  return [
    fw.section(
      { class: 'todoapp' },
      header(),
      fw.bindToDOM(main, todos, keyFn),
      fw.bindToDOM(footer, todos, keyFn)
    ),
    info(),
  ];
};

function updateCompletedCount() {
  completedCount.setState(
    todos.getState().filter((todo) => !todo.completed).length
  );
}

function keyFn(el) {
  return el.id;
}

const router = fw.createRouter(container);
router.registerRoute('/', TodoApp);
router.registerRoute('/active', TodoApp);
router.registerRoute('/completed', TodoApp);
router.navigate();
