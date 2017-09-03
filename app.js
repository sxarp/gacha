new Vue({
  el: '#vue-app',
  data: {
    name: 'Sxarp',
    google: 'https://www.google.co.jp/',
    age: 26,
    flag: false,
    characters: [
      {name: 'chino', age: 14},
      {name: 'cocoa', age: 16},
      {name: 'syaro', age: 16}
    ]
  },
  methods: {
    greet: function(time){
      return 'Good ' + time + ', ' + this.name;
    },
    add_age: function(){
      this.age++;
    },
    toggle: function(){
      this.flag = !this.flag; 
    }
  },
  computed: {
    agepp: function(){
      return this.age+1;
    }
  }
});
