//var api_endpoint = "http://localhost:8080";
var api_endpoint = "https://gacha-calculas.appspot.com";

function foldl(array, init, fun) {
  var ret_val = init;
  for (i = 0; i < array.length; i++) { 
    ret_val = fun(ret_val, array[i]);
  }
  return ret_val;
}

function head(array){
  return array[0];
}

function tail(array){
  return array.slice(1, array.length);
}

function fold(array, fun){
  return foldl(tail(array), head(array), fun);
}

//こう見えて実はflatMap...
function map(array, fun){
  return foldl(array, [], function(accumulated, val){
    return accumulated.concat(fun(val));
  });
}

function filter(array, fun){
  return map(array, function(elm){
    return fun(elm) ? [elm] : [];
  });
}

function sum(a, b){
  return a+b;
}

function myround(x, accuracy){
  decimal = 10**accuracy;
  return Math.round(x * decimal)/decimal;
}

//デバッグに便利
function ind(x){
  return x;
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
    categories: map([['SSR', 1, 0.02], ['レア', 2, 0.04], ['ハズレ', 9, 0.1]],
      function(args){return create_category(args[0], args[1], args[2])}),
    result: 66.934832989
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
    },
    json_data: function(){
      return JSON.stringify(
        map(filter(this.categories,
          function(c){return probability_of_category(c) > 0;}),
          function(c){return {number: Number(c.number), probability: Number(c.probability)}}
        ));
    },
    result_view: function(){
      return myround(this.result, 3)
    }
  },
  methods: {
    add_category: function(){
      this.categories = this.categories.concat(
        create_category("カテゴリ"+this.category_num, 0, 0.0));
    },
    rounded_total: function(decimal){
      return myround(this.total_probability, decimal);
    },
    categories_map: function(fun){
      this.categories = map(this.categories, fun);
    },
    normalize: function(){
      var total = this.total_probability;
      this.categories_map(function(c){
        return create_category(c.category, c.number, c.probability/total);})
    },
    calculate: function(){
      if(this.rounded_total(2) != 1.0){
        this.normalize();
      }
      console.log('post!');
      console.log(this.json_data);
      var main = this;
      $.ajax({
        type: 'post',
        url: api_endpoint,
        data: this.json_data,
        contentType: 'application/json',
        success: function(result, status){
          console.log(result)
          main.result = result;},
        error: function() {         // HTTPエラー時
          alert("Server Error. Pleasy try again later.");}});
    }
  }
});
