export function getTkn(tkn:string): string {
    let date=new Date(tkn.split('_')[1]);
    let fulldate=date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear() + '' + date.getHours();
  let tokn = tkn.split("_")[0] + fulldate;    
return tokn || "";
}