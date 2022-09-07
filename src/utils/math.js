export function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
export function sum(items, prop){
    return Math.round(items.reduce( function(a, b){
        return a + b[prop];
    }, 0));
  };
export function ConvertTOMillion(labelValue) 
    {
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? round(Math.abs(Number(labelValue)) / 1.0e+9,2) + "B"
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? round(Math.abs(Number(labelValue)) / 1.0e+6,2) + "M"
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? round(Math.abs(Number(labelValue)) / 1.0e+3,2) + "K"
    : Math.abs(Number(labelValue));
   }