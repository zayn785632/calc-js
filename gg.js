(function($) {

    function update(model) {
        var salKey = model.getFieldKey("AMOUNT"),
            total = 0;

        console.log(">> starting sum AMOUNT column")
        model.forEach(function(record, index, id) {
            var AMOUNT = parseFloat(record[salKey]), 
                meta = model.getRecordMetadata(id);

            if (!isNaN(AMOUNT) && !meta.deleted && !meta.agg) {
                total += AMOUNT;
            } 
        }); 
        console.log(">> setting sum AMOUNT column to " + total)
        $s("P17_AMOUNT", total),
        $s("P17_NET_AMOUNT", total);
    }


    $(function() {
       
        $("#PO").on("interactivegridviewmodelcreate", function(event, ui) {
            var sid,
                model = ui.model;

            if ( ui.viewId === "grid" ) {
                sid = model.subscribe( {
                    onChange: function(type, change) {
                        console.log(">> model changed ", type, change);
                        if ( type === "set" ) {
                             if (change.field === "AMOUNT" ) {
                                update( model );
                            }
                        } else if (type !== "move" && type !== "metaChange") {
                          update( model );
                        }
                    },
                    progressView: $("#P17_AMOUNT") 
                } );
                 update( model );           
                model.fetchAll(function() {});
            }
        });

    });

})(apex.jQuery);




function dis() {
    var amount, discount, subamt;
    
    amount = parseFloat($v("P17_AMOUNT"), 10) ? parseFloat($v("P17_AMOUNT"), 10) : 0;
    
    discount = parseFloat($v("P17_DISCOUNT"), 10) ? parseFloat($v("P17_DISCOUNT"), 10) : 0; 
    
    subamt = amount*discount/100;  
    
   $s("P17_DIS_AMT", parseFloat(subamt, 10));
}



function dis_sub() {
    var amount,dis,subamt;
    
    amount = parseFloat($v("P17_AMOUNT"), 10) ? parseFloat($v("P17_AMOUNT"), 10) : 0;
     
     dis = parseFloat($v("P17_DISCOUNT"), 10) ? parseFloat($v("P17_DISCOUNT"), 10) : 0; 
     
    
    subamt = amount-amount*dis/100; 

           $s("P17_NET_AMOUNT", parseFloat(subamt, 10));

}
