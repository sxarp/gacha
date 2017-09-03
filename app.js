function foldl(array, init, fun) {
  var ret_val = init;
  for (i = 0; i < array.length; i++) { 
    ret_val = fun(ret_val, array[i]);
  }
  return ret_val;
};

function head(array){
  return array[0];
};

function tail(array){
  return array.slice(1, array.length);
}

function fold(array, fun){
  return foldl(tail(array), head(array), fun);
};

function map(array, fun){
  return foldl(array, [], function(accumulated, val){
    return accumulated.concat(fun(val));
  });
};

function sum(a, b){
  return a+b;
}

function create_category(category, number, probability) {
  return {category: category, number: number, probability: probability};
};
function probability_of_category(category){
  return category.number * category.probability;
}

new Vue({
  el: '#main',
  data: {
    name: 'Sxarp',
    google: 'https://www.google.co.jp/',
    age: 26,
    flag: false,
    categories: map([['SSR', 1, 0.1], ['レア', 1, 0.1], ['ハズレ', 1, 0.1]],
      function(args){return create_category(args[0], args[1], args[2])})
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
