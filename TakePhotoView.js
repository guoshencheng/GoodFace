/** * Created by guoshencheng on 7/7/15. */// Request animation frame shimwindow.requestAnimFrame = (function() {    return  window.requestAnimationFrame       ||        window.webkitRequestAnimationFrame ||        window.mozRequestAnimationFrame    ||        window.oRequestAnimationFrame      ||        window.msRequestAnimationFrame     ||        function(callback, element){            window.setTimeout(callback, 1000 / 60);        };})();var maskImage = document.getElementById("mask_image");var zoomControl = document.getElementById("zoom-control");var dragable = document.getElementById("dragable");var line = document.getElementById("line");var cropView = document.getElementById("crop-view");var canvas = document.getElementById("canvas");var uploadPhotoBtn = document.getElementById("upload-button");var realUploadBtn = document.getElementById("real-upload-button");var confirmBtn = document.getElementById("confirm-button");canvas.height = canvas.width;var canvasWidth = canvas.width;var canvasHeight = canvas.height;var uploadPhoto;var ctx = canvas.getContext('2d')var uploadPhotoX = 0;var uploadPhotoY = 0;var canvasX = getLeft(cropView);var canvasY = getTop(cropView);var lineX = getLeft(line);var ratio = 1;var zoom = 1;var imgRotation = 0;var addEvent = (function () {    if (document.addEventListener) {        return function (el, type, fn) {            if (el && el.nodeName || el === window) {                el.addEventListener(type, fn, false);            } else if (el && el.length) {                for (var i = 0; i < el.length; i++) {                    addEvent(el[i], type, fn);                }            }        };    } else {        return function (el, type, fn) {            if (el && el.nodeName || el === window) {                el.attachEvent('on' + type, function () { return fn.call(el, window.event); });            } else if (el && el.length) {                for (var i = 0; i < el.length; i++) {                    addEvent(el[i], type, fn);                }            }        };    }})();var loadUpLoadImage = function loadImage() {    var file = realUploadBtn.files[0];    EXIF.getData(file, function() {        var orientation = EXIF.getTag(this, 'Orientation');        switch(orientation) {            case 3:                imgRotation = 180;                break;            case 6:                imgRotation = 90;                break;            case 8:                imgRotation = 270;                break;        }    });    var fr = new FileReader();    fr.readAsDataURL(file);    fr.onload = function(fe){        var result = this.result;        uploadPhoto = new Image();        uploadPhoto.onload = function() {            caculateDefault();            console.info(imgRotation);            drawUpLoadPhoto();        };        uploadPhoto.src = result;        maskImage.style.display = 'block';        uploadPhotoBtn.style.display = 'none';        realUploadBtn.style.display = 'none';    };}function caculateDefault() {    if(uploadPhoto.width > uploadPhoto.height) {        ratio = canvasWidth / uploadPhoto.width;    } else {        ratio = canvasHeight / uploadPhoto.height;    }    uploadPhotoX = (canvasWidth - uploadPhoto.width * (ratio * zoom)) / 2;    uploadPhotoY = (canvasHeight - uploadPhoto.height * (ratio * zoom)) / 2;}//获取元素的纵坐标function getTop(e){    var offset=e.offsetTop;    if(e.offsetParent!=null) {        return offset + getTop(e.offsetParent);    }    return offset;}//获取元素的横坐标function getLeft(e){    var offset=e.offsetLeft;    if(e.offsetParent!=null) {        return offset + getLeft(e.offsetParent);    } else {        return offset;    }}function drawUpLoadPhoto() {    ctx.save();    ctx.clearRect(0, 0, canvasWidth, canvasHeight);    ctx.scale((ratio * zoom), (ratio * zoom));    ctx.translate(uploadPhotoX / (ratio * zoom) + uploadPhoto.width / 2, uploadPhotoY / (ratio * zoom) + uploadPhoto.height / 2);    ctx.rotate( (Math.PI / 180) * imgRotation);    ctx.translate(-(uploadPhotoX / (ratio * zoom) + uploadPhoto.width / 2), -(uploadPhotoY / (ratio * zoom) + uploadPhoto.height / 2));    ctx.drawImage(uploadPhoto, uploadPhotoX / (ratio * zoom), uploadPhotoY / (ratio * zoom));    ////console.info(touch);    ctx.restore();}function move(touch) {    uploadPhotoX = (touch.pageX - canvasX) * canvasWidth / canvas.offsetWidth - uploadPhoto.width * (ratio * zoom)  / 2;    uploadPhotoY = (touch.pageY - canvasY) * canvasHeight / canvas.offsetHeight - uploadPhoto.height * (ratio * zoom) / 2;    drawUpLoadPhoto();}function drag(touch) {    var dragX = touch.pageX - lineX;    console.info(dragX);    if (dragX >= line.offsetLeft && dragX <= line.offsetLeft + line.offsetWidth) {        console.info(dragX);        zoom = 1 + 0.5 * ((dragX - line.offsetLeft) / line.offsetWidth);        drawUpLoadPhoto();        dragable.style.left = dragX + "px";    }}addEvent(cropView, 'touchmove', function(e) {    e.preventDefault();    var touches = e.changedTouches;    if(touches && touches.length == 1) {        requestAnimFrame(function() {            move(touches[0]);        });    }});addEvent(zoomControl, 'touchmove', function(e) {    e.preventDefault();    var touches = e.changedTouches;    if(touches && touches.length == 1) {        requestAnimFrame(function() {           drag(touches[0]);        });    }});confirmBtn.onclick = function clickConfirm() {    console.info("confirm");    var data = canvas.toDataURL();    var  base64Data = data.substr(22)    console.info(data);}