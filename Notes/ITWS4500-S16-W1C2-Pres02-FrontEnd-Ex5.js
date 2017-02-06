// In this example we will create a new object called XDate which will inherit from the built in Date object and add some extra methods - to add days, and to calculate the difference between two dates in days and business days. By doing this instead of directly augmenting the Date object we allow the Date object to retain its original functionality and allow for if a browser later implements one of the methods we are adding but in a different way to how we have done it. With the following code in place we can just change any "new Date" references to "new XDate" in order to make available these extra methods without having changed the way Date works.


var XDate = {};
XDate.prototype = Date;
XDate.prototype.constructor = XDate;

XDate.prototype.addDays = function(days) {   
   this.setDate(this.getDate()+days);
};

XDate.prototype.dayDiff = function(d2) {   
   return Math.floor(Math.abs(this-d2)/(24*60*60*1000));
};

XDate.prototype.busDayDiff = function(d2) {   
   var d, t, w1, w2; 
   d = this.dayDiff(d2); 
   t= d%7; 
   if (this < d2) {
      w1= this.getDay(); 
      w2= d2.getDay();
   } else {
      w2= this.getDay(); 
      w1= d2.getDay();
   }  
   if (w1 > w2) t-=2;
   if ((w1 === 0 && w2 === 6) || w1 === 6) t--; 
   return Math.abs((Math.floor(d/7)*5)+t);
};
