//var api_endpoint = "http://localhost:8080";
var api_endpoint = "https://gacha-calculas.appspot.com";

function foldl(array, init, fun) {
  var ret_val = init;
  var i;
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
  var decimal = Math.pow(10, accuracy);
  return Math.round(x * decimal)/decimal;
}

//デバッグに便利
function ind(x){
  return x;
}

function create_category(category, number, probability) {
  return {category: category, number: number, probability: probability};
}
function probability_of_category(category){
  return category.probability;
}

function probability_per_item(category){
  return category.probability/category.number;
}

new Vue({
  el: '#main',
  data: {
    categories: map([['SSR', 1, 2], ['レア', 2, 8], ['ハズレ', 9, 90]],
      function(args){return create_category(args[0], args[1], args[2]);}),
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
      return {exact: (total===100), normalized: (total !== 100)};
    },
    json_data: function(){
      return JSON.stringify(
        map(filter(this.categories,
          function(c){return probability_of_category(c) > 0;}),
          function(c){return {number: parseInt(c.number, 10), probability: 0.01*Number(c.probability)/Number(c.number)};}
        ));
    },
    result_view: function(){
      var result = this.result;
      if(isNaN(result)){ return result;}
      return myround(result, 3);
    }
  },
  methods: {
    add_category: function(){
      this.categories = this.categories.concat(
        create_category("カテゴリ"+this.category_num, 1, 0.0));
    },
    rounded_total: function(decimal){
      return myround(this.total_probability, decimal);
    },
    categories_map: function(fun){
      this.categories = map(this.categories, fun);
    },
    normalize: function(){
      var total = this.total_probability/100.0;
      this.categories_map(function(c){
        return create_category(c.category, c.number, c.probability/total);});
    },
    debug: function(){
      console.log('hell');
      console.log(this.categories);
      console.log(this.categories_view);
    },
    calculate: function(){
      $('#cal').prop('disabled', true);
      this.result = '---------'

      if(this.rounded_total(2) !== 1.0){
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
          $('#cal').prop('disabled', false);
          console.log(status);
          console.log(result);
          main.result = result;},
        error: function() {
          $('#cal').prop('disabled', false);
          console.log('error');}});
    }
  }
});
