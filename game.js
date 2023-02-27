function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
const defaultButton = [
  { id: 1, value: "", isDisable: false },
  { id: 2, value: "", isDisable: false },
  { id: 3, value: "", isDisable: false },
  { id: 4, value: "", isDisable: false },
  { id: 5, value: "", isDisable: false },
  { id: 6, value: "", isDisable: false },
  { id: 7, value: "", isDisable: false },
  { id: 8, value: "", isDisable: false },
  { id: 9, value: "", isDisable: false },
];
const winCondition=[
    [1,2,3],[4,5,6],[7,8,9],
    [1,4,7],[2,5,8],[3,6,9],
    [1,5,9],[3,5,7]
]
const o = "O";
const x = "X";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
new Vue({
  el: "#app",
  data() {
    return {
      arrayButton: [],
      APoint: 0,
      BPoint: 0,
      AName: "Người chơi 1",
      BName: "Người chơi 2",
      flag:null,
      AChoice:new Set(),
      BChoice:new Set(),
      beginTurn:true,
      nowTurn:true,
    };
  },
  methods: {
    defaultButton: function () {
      this.arrayButton = [
        { id: 1, value: "", isDisable: false },
        { id: 2, value: "", isDisable: false },
        { id: 3, value: "", isDisable: false },
        { id: 4, value: "", isDisable: false },
        { id: 5, value: "", isDisable: false },
        { id: 6, value: "", isDisable: false },
        { id: 7, value: "", isDisable: false },
        { id: 8, value: "", isDisable: false },
        { id: 9, value: "", isDisable: false },
      ];
    },
    newGame:function(){
        this.AChoice=new Set();
        this.BChoice=new Set();
        this.defaultButton();
        this.beginTurn=!this.beginTurn;
        this.nowTurn=this.beginTurn;
        this.flag=null;
    },
    defaultGame: function () {
      this.APoint = 0;
      this.BPoint = 0;
      this.newGame();
    },
    fireToast: function (icon, title) {
      Toast.fire({
        icon: icon,
        title: title,
      });
    },
    clickHandler: function (index) {
      let location = this.arrayButton[index];
      if(this.nowTurn==true){
        location.value=x;
        this.AChoice.add(location.id);
        this.AConsider();
        this.nowTurn=!this.nowTurn;
      }else{
        location.value=o;
        this.BChoice.add(location.id);
        this.BConsider();
        this.nowTurn=!this.nowTurn;
      }
      location.isDisable=true;
      this.arrayButton[index]=location;
      if(this.flag!=null){
        this.fireToast('success','Xin chúc mừng: '+this.flag+"!")
        sleep(1000).then(() => {
            this.newGame();
        });
    }
      let filter=this.arrayButton.filter(t=>t.isDisable);
      if(filter.length==9){
        this.fireToast('success',"Hoà nha các bé!");
        this.APoint++;
        this.BPoint++;
        sleep(1000).then(() => {
            this.newGame();
        });
      }
    },
    AConsider:function(){
        for(let i=0;i<8;i++){
            let setConsider=new Set(this.AChoice);
            setConsider.add(winCondition[i][0]);
            setConsider.add(winCondition[i][1]);
            setConsider.add(winCondition[i][2]);
            if(setConsider.size==this.AChoice.size){
                this.flag=this.AName;
                this.APoint++;
            }
        }
    },
    BConsider:function(){
        for(let i=0;i<8;i++){
            let setConsider=new Set(this.BChoice);
            setConsider.add(winCondition[i][0]);
            setConsider.add(winCondition[i][1]);
            setConsider.add(winCondition[i][2]);
            if(setConsider.size==this.BChoice.size){
                this.flag=this.BName;
                this.BPoint++;
            }
        }
    }
  },
  computed: {
    getScore: function () {
      return this.APoint + " : " + this.BPoint;
    },
  },
  watch: {},
  async mounted() {
    const { value: formValues } = await Swal.fire({
      title: "Phải có tên mới xưng hô được chứ nhỉ?",
      html:
        "<h5>Người chơi 1:</h5>" +
        '<input id="swal-input1" class="swal2-input">' +
        "<h5>Người chơi 2:</h5>" +
        '<input id="swal-input2" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });
    if (formValues) {
      if (formValues[0].trim() != "") {
        this.AName = formValues[0].trim();
      }
      if (formValues[1].trim() != "") {
        this.BName = formValues[1].trim();
      }
    }
    this.arrayButton = [...defaultButton];
  },
});
