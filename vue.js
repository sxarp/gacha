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

//実はflatMapなんだよなぁ…
function map(array, fun){
  return foldl(array, [], function(accumulated, val){
    return accumulated.concat(fun(val));
  });
};

function filter(array, fun){
  return map(array, function(elm){
    return fun(elm) ? [elm] : [];
  })
};

function sum(a, b){
  return a+b;
};

function myround(x, accuracy){
  decimal = 10**accuracy;
  return Math.round(x * decimal)/decimal;
};

function create_category(category, number, probability) {
  return {category: category, number: number, probability: probability};
};
function probability_of_category(category){
  return category.number * category.probability;
}

new Vue({
  el: '#main',
  data: {
    categories: map([['SSR', 1, 0.1], ['レア', 1, 0.1], ['ハズレ', 1, 0.1]],
      function(args){return create_category(args[0], args[1], args[2])}),
    result: 0.0
  },
  methods: {
    add_category: function(){
      this.categories = this.categories.concat(create_category("カテゴリ"+this.category_num, 0, 0.0));
    },
   rounded_total: function(decimal){
      return myround(this.total_probability, decimal);
    }
  },
  computed: {
    total_probability: function(){
      return fold(map(this.categories, probability_of_category), sum);
    },
    category_num: function(){
      return this.categories.length;
    },
    is_total_one: function(){
      var total = this.rounded_total(2);
      return {exact: (total==1), lower: (total<1), higher: (total>1)};
    }
  }
});
