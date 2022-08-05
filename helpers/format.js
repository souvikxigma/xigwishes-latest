function customDateFormat(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}


function customDateAdd(date,adddate){  
    date.setDate(date.getDate() + adddate); // Set now + 7 days as the new date
    var dateSpilit = JSON.stringify(date);
    var dateAfterSplit  = dateSpilit.slice(1, -1);
    var accountExpireDate = dateAfterSplit.split('T')[0];
    return accountExpireDate;
}

module.exports = {
    customDateFormat: customDateFormat,
    customDateAdd:customDateAdd
};
