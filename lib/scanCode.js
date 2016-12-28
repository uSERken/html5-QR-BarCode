(function ($) {
    var SCAN = {
        BOTHSCAN: function (selector, success) {
            scanProcessing(selector, "both", function (data) {
                success(data);
            });
        },
        QR: function (selector, success) {
            scanProcessing(selector, "qr", function (data) {
                success(data);
            });
        },
        BARCODE: function (selector, success) {
            scanProcessing(selector, "barcode", function (data) {
                success(data);
            });
        }
    };

    function scanProcessing(selector, type, success) {
        $(selector).unbind();
        var inputDiv = $(selector).find('input[input-type=jsScan]');
        $(inputDiv).unbind();
        $(inputDiv).val();
        $(inputDiv).on('click', function (e) {
            e.stopPropagation();
        });

        if (window.FastClick) {
            var notNeed = FastClick.notNeeded(document.body);
            if (notNeed) {
                $(inputDiv).trigger("click");
            } else {
                $(inputDiv).trigger("click");
                $(inputDiv).trigger("click");
            }
        } else {
            $(inputDiv).trigger("click");
        }

        $(inputDiv).bind('change', function () {
            var inputDom = $(this);
            var imgFile = inputDom[0].files;
            var oFile = imgFile[0];
            var oFReader = new FileReader();
            var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
            if (imgFile.length === 0) {
                return;
            }
            if (!rFilter.test(oFile.type)) {
                //再次更改错误图片格式的提示
                alert("图片格式错误，请重新选择！");
                return;
            }
            //可在此增加等待效果动画
            var returnCode = null;
            oFReader.onload = function (oFREvent) {
                if (type == "qr") {
                    Qr(oFREvent, function (data) {
                        returnCode = data;
                    });
                } else if (type == "barcode") {
                    barCode(oFREvent, function (data) {
                        returnCode = data;
                    });
                } else {
                    both(oFREvent, function (data) {
                        returnCode = data;
                    });
                }
                //延迟等待扫码处理完成
                setTimeout(function () {
                    success(returnCode);
                }, 1000);
            };
            oFReader.readAsDataURL(oFile);
        });
    }

    function Qr(oFREvent, success) {
        qrcode.decode(oFREvent.target.result);
        qrcode.callback = function (data) {
            if (data != "error decoding QR Code") {
                success(data);
            }
        };
    }

    function barCode(oFREvent, success) {
        //条形码
        Quagga.decodeSingle({
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"] // List of active readers
            },
            locate: true, // try to locate the barcode in the image
            src: oFREvent.target.result // or 'data:image/jpg;base64,' + data
        }, function (result) {
            if (result) {
                if (result.codeResult != null) {
                    success(result.codeResult.code);
                }
            } else {
                console.log("not detected");
            }
        });
    }

    function both(oFREvent, success) {
        //二维码
        var returnCode = null;
        qrcode.decode(oFREvent.target.result);
        qrcode.callback = function (data) {
            //得到扫码的结果
            if (data != "error decoding QR Code") {
                returnCode = data;
            }
        };
        //条形码
        Quagga.decodeSingle({
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"] // List of active readers
            },
            locate: true, // try to locate the barcode in the image
            src: oFREvent.target.result // or 'data:image/jpg;base64,' + data
        }, function (result) {
            if (result) {
                if (result.codeResult != null) {
                    returnCode = result.codeResult.code;
                }
            }
        });
        //延迟返回，否则为空
        setTimeout(function () {
            success(returnCode);
        }, 800);
    }

    window.SCAN = SCAN;
})(Zepto);

