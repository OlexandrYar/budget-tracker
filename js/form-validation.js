$(function(){
    $("#transactionField").validate({
        rules:{
            transactionName:"required",
            transactionDate:{
                required:true,
                min: "2025-01-01"
            },
            transactionAmmount:{
                required:true,
                step:0.01
            }

        },
        messages:{
            transactionName:"Transaction must have a name!",
            transactionDate:{
                required:"Transaction must have a date!",
                min: "Minimum year of transaction is 2025"
            },
            transactionAmmount:{
                required:"Transaction must have an amoutn of money spent or gained",
                step:"Amount can not exceed 2 decimal points"
            }
        },
        submitHandler: function(form){
            let name = $("#transactionName").val();
            let type = $("#typeOfTransaction").val();
            let date = $("#transactionDate").val();
            let ammount = $("#transactionAmmount").val();
            createTransaction(name, type, date, ammount);
            form.submit();
        }
    })
});