// function wrapAsync(fn){
//     return function(req , res , next){
//         fn(req , res , next).catch(next)
//     }
// }


module.exports = (fn) => {
    return (req , res , next) => {
        fn(req , res , next).catch(next)
    };
};

// iske andr ek function hota hai jo h (fn) woh return karta hai ek aur function
// function(req , res , next){
/* 
fn(req , res , next).catch(next)
*/
