export function formatDate(date){
    if(date === "" || date === undefined || date === null){
      return "";
    }
    var dt = date.split('T');
     var year = dt[0].split("-")[0];
     var month = dt[0].split("-")[1];
     var day = dt[0].split("-")[2];
     var min = dt[1].split(":")[0];
     var sec = dt[1].split(":")[1];

     return month+"/"+ day + "/" + year + " " + min +":" + sec;
  }