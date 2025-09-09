# (1) What is the difference between var, let, and const?

var: The scope of var is the function scope. It can be accessed within a function. The declaration of var is hoisted. Even if a variable is not declared before use, it can be retrieved at the beginning of the function when the code is run. A variable can be declared and assigned repeatedly within the same scope using the var keyword.

let: The scope of let is block scope. Let can only be accessed within the block in which it is declared. A variable cannot be redeclared within the same scope using let, but its value can be reassigned. The let declaration is hoisted, but unlike var, it is not incremented.

const: Like let, const is also block scoped. Const declarations are hoisted, but if they are not declared before use, an error is thrown. Variables using const cannot be re-declared or re-assigned. They are immutable.

# (2) What is the difference between map(), forEach(), and filter()?

map(): The map() method creates a new array by applying a specific function to each element of the array. It always returns a new array.

forEach(): The forEach() method applies a specific function to each element of an array but does not create a new array. It returns undefined.

filter(): The filter() method creates a new array by filtering the elements of an array according to a specified condition. It returns a new array with the elements that meet the condition.
