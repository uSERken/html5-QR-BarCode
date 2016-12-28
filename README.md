# html5-QR-BarCode
在Android或iOS的浏览器中呼起摄像头拍摄或选择二维码或条形码图片进行解析并返回结果。（尤其适用于动态添加dom时调用）


### 主要功能：
在Android或iOS的浏览器中呼起摄像头拍摄或选择二维码或条形码图片进行解析并返回结果。

### 说明：
1. 感谢[@zhiqiang21](https://github.com/zhiqiang21)提供的 [WebComponent/html5-Qrcode/ ](https://github.com/zhiqiang21/WebComponent/tree/master/html5-Qrcode)作为参考.
2. 此插件需要配合`zepto.js` 
3. 本例条形码支持 [quagga.min.js](https://github.com/serratus/quaggaJS)所提供的全部类型，详情请点击查看.
4. 在scanCode.js 以下代码 如有报错请注意
```javascript
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
		
// 这样判断是因为如果项目中引入了Fastclick时，Android中使用一次
//trigger("click")便能模拟一次真实点击，而iOS需要使用两次才能模拟一次真实点击。
```

### 使用方法：
#### 1 在需要使用的页面按照下面顺序引入`lib`目录下的 js 文件

```javascript
    <script src="lib/zepto.js"></script>
    <script src="lib/qrcode.lib.min.js"></script>
    <script src="lib/quagga.min.js"></script>
    <script src="lib/scanCode.js"></script>
```

#### 2 自定义按钮的 html 样式
为 input 按钮添加自定义的属性和值 `input-type="jsScan"`

>因为该插件需要使用`<input type="file" />` ，该 html 结构在网页上面是有固定的显示样式，为了能够自定义按钮样式，我们可以按照下面的示例代码结构嵌套代码

```html
    <div class="qr-btn" onclick="both(this)">二维码条码
        <input input-type="jsScan" type="file" name="jsScan" hidden/>
    </div>
```

#### 3 为如上div中添加onclick方法并传入 div自身——`this`


此方法可扫描二维码或条形码


```javascript
  function both(el) {
            SCAN.BOTHSCAN(el, function (data) {
                if (data) {
                    $(".result-qrcode").append("扫描结果—— " + data + "<br>");
                } else {
                    alert("图片不清晰或错误");
                }
            });
        }
```
