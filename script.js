const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 750,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
const url = "https://63f827b91dc21d5465ba39d0.mockapi.io/api/v1/";
new Vue({
  el: "#app",
  data() {
    return {
      user: null,
      placeholderCreate: "Nhập công việc cần làm...",
      todos: [],
      todoShow: [],
      filterValue: "",
      todoInput: "",
      updateFlag: null,
    };
  },
  methods: {
    changeFilter: function () {
      let value = this.filterValue;
      if (value === "" || value == null || value == undefined) {
        this.todoShow = this.todos;
      } else {
        this.todoShow = this.todos.filter((t) => String(t.isNotDone) === value);
      }
    },
    addNewTodo: function () {
      if (this.updateFlag == null) {
        let todo = {
          userId: 1,
          value: this.todoInput,
          isNotDone: true,
        };
        if (this.todoInput == "") {
          this.fireToast("error", "Không bỏ trống tên công việc!");
        } else {
          axios.post(url + "todos", todo).then((response) => {
            this.todos.push(response.data);
            this.fireToast("success", "Thêm công việc thành công");
            this.todoInput = "";
            this.changeFilter();
          });
        }
      } else {
        this.updateFlag.value = this.todoInput;
        if (this.todoInput == "") {
          this.fireToast("error", "Không bỏ trống tên công việc!");
        } else {
          axios
            .put(url + "todos/" + this.updateFlag.id, this.updateFlag)
            .then((response) => {
              axios
                .get("https://63f827b91dc21d5465ba39d0.mockapi.io/api/v1/todos")
                .then((response) => {
                  this.todos = response.data;
                  this.fireToast("success", "Sửa công việc thành công");
                  this.todoInput = "";
                  this.changeFilter();
                  this.updateFlag = null;
                });
            });
        }
      }
    },
    fireToast: function (icon, title) {
      Toast.fire({
        icon: icon,
        title: title,
      });
    },
    complateTodo: function (index) {
      let todo = this.todoShow[index];
      todo.isNotDone = !todo.isNotDone;
      axios.put(url + "todos/" + todo.id, todo).then((response) => {
        todo = response.data;
        axios
          .get("https://63f827b91dc21d5465ba39d0.mockapi.io/api/v1/todos")
          .then((response) => {
            this.todos = response.data;
            this.changeFilter();
          });
      });
    },
    update: function (index) {
      this.todoInput = this.todoShow[index].value;
      this.updateFlag = this.todoShow[index];
    },
    cancelUpdate: function (index) {
      this.updateFlag = null;
      this.todoInput = "";
    },
    deleteTodo: function (id) {
      axios
        .delete(
          "https://63f827b91dc21d5465ba39d0.mockapi.io/api/v1/todos/" + id
        )
        .then((response) => {
          axios
            .get("https://63f827b91dc21d5465ba39d0.mockapi.io/api/v1/todos")
            .then((response) => {
              this.todos = response.data;
              this.changeFilter();
              this.fireToast('success','Xoá thành công')
            });
        });
    },
  },
  computed: {
    getTodoCount: function () {
      return this.todoShow.length + "/" + this.todos.length;
    },
  },
  watch: {},
  async mounted() {
    await axios
      .get("https://63f827b91dc21d5465ba39d0.mockapi.io/api/v1/users/1")
      .then((response) => {
        this.user = response.data.username;
      });
    await axios
      .get("https://63f827b91dc21d5465ba39d0.mockapi.io/api/v1/todos")
      .then((response) => {
        this.todos = response.data;
      });
    await Swal.fire({
      title: "Chào mừng bạn đã quay trở lại!",
      icon: "info",
      confirmButtonText: "Bắt đầu nào",
    });
    this.todoShow = this.todos;
  },
});
