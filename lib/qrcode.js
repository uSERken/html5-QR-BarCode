(function ($) {
    var SCAN = {
        nativeReady:function (selector,success) {
            $(selector).unbind();
            var inputDiv = $(selector).find('input[input-type=jsScan]');
            $(inputDiv).unbind();
            $(inputDiv).on('click', function (e) {
                e.stopPropagation();
            });
            //setTimeout(function(){
            $(inputDiv).triggerFastClick();
           // },110);
            $(inputDiv).bind('change',function () {
                var inputDom = $(this);
                var imgFile = inputDom[0].files;
                var oFile = imgFile[0];
                var oFReader = new FileReader();
                var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
                if (imgFile.length === 0) {
                    return;
                }
                if (!rFilter.test(oFile.type)) {
                    alert("Error, please choose the correct picture!");
                    return;
                }
                $.showPreloader('Loading');
                oFReader.onload = function (oFREvent) {
                    var returnCode = null;
                    qrcode.decode(oFREvent.target.result);
                    qrcode.callback = function (data) {
                        //得到扫码的结果
                        if(data != "error decoding QR Code"){
                            console.log("二维码结果:  " + data);
                            returnCode = data;
                        }
                    };
                    //条形码
                    Quagga.decodeSingle({
                        decoder: {
                            readers: ["code_39_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"] // List of active readers
                        },
                        locate: true, // try to locate the barcode in the image
                        src: oFREvent.target.result // or 'data:image/jpg;base64,' + data
                    }, function (result) {
                        if (result) {
                            if(result.codeResult != null){
                                returnCode = result.codeResult.code;
                            }
                        } else {
                            console.log("not detected");
                        }
                    });
                    setTimeout(function () {
                        $.hidePreloader();
                        if (returnCode == null){
                            alert("Error, Picture is wrong, please try it again!");
                        }else{
                            success(returnCode);
                        }
                    },100);
                };
                oFReader.readAsDataURL(oFile);
            });
        }
    };
    window.SCAN = SCAN;
})(Zepto);
