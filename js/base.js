/********************
 * localStorage初始化*
 * ******************/
if (localStorage.length === 0) {
    var foo = [];
    foo = JSON.stringify(foo);
    localStorage.setItem("todo", foo);
    localStorage.setItem("completed", foo);
}

var who = "todo";//当前是查看todo界面还是completed界面

$(document).ready(function () {

    appendToDOM(who);


    var inputInterface = $(".inputNewItem");
    var inputTitle = $("#inputTitle");
    var inputContent = $("#inputContent");

    inputInterface.hide();

    /********
     * 侧边栏*
     * ******/
    $(".menuBtn").click(switchSidebar);//点击主菜单按钮,切换sidebar
    $(".sidebar ul").click(switchSidebar);//侧边栏,关闭sidebar
    function switchSidebar(event) {
        var sidebar = $(".sidebar");
        if (sidebar.css("left") === "-260px") {
            sidebar.css("left", 0);
            $(".menuBtn").css("transform", "rotate(180deg)");
        } else {
            sidebar.css("left", "-260px");
            $(".menuBtn").css("transform", "rotate(0deg)");
        }
    }

    /************
     * 已完成界面*
     * *********/
    $("#completed").click(function () {//显示已完成的事项
        who = "completed";
        appendToDOM(who);
    });
    $("#todo").click(function () {
        who = "todo";
        appendToDOM(who);
    });

    /*****************
     * ****换肤界面****
     * ***************/
    $("#changeSkin").click(function () {
        $(".changeSkin").css("display", "block");
    });
    $(document).click(function (e) {
        // console.log( $("#changeSkin") + "是ch[0]的值");
        if ($(".changeSkin").css("display") === "block") {
            if (e.target === $("#changeSkin")[0]) {
                // $(".changeSkin").css("display", "block");
                // console.log(e.target.value + "是e.target的值");
            } else {
                $(".changeSkin").css("display", "none");
            }
        }
        if ($(".about").css("display") === "block") {
            if (e.target === $("#about")[0]) {
                // $(".changeSkin").css("display", "block");
                // console.log(e.target.value + "是e.target1的值");
            } else {
                // console.log(e.target.value + "是e.target2的值");
                $(".about").css("display", "none");
            }
        }
        if ($(".sidebar").css("left") !== "-260px") {
            switchSidebar();
            // console.log(e.target.value + "是e.target3的值");

        }

    });
    $(".changeSkin").on("click", ".colorBlock", function () {
        var color = $(this).css("background-color");
        $(".nav").css("background-color", color);
    });

    /************
     * 关于界面***
     * **********/
    $("#about").click(function () {
        $(".about").css("display", "block");

    });

    var okBtn = $(".okBtn");
    var addBtn = $(".addNewBtn");
    addBtn.click(function (event) {//点击添加按钮时
        switchBtnStatus();
    });

    okBtn.click(function (event) {//点击确认按钮时
        if (inputTitle.val()) {

            writeToTODOLocalStorage();
            inputTitle.val("");
            inputContent.val("");
            switchBtnStatus();
            appendToDOM(who);
        }
    });

    /************************
     * 为完成和删除按钮绑定事件*
     * **********************/
    var list = $(".list");
    list.on("click", ".clear", function () {
        /*****
         * 遇到的问题:
         * 绑定的事件只执行1次
         * 原因:
         * 使用的是$(".list-item").on("click", ".clear", function ()...
         * 在dom重载后,$(".list-item")已经是新的了,原来的$(".list-item")消失,绑定的事件也随之消失
         * 解决方法:
         * $(".list-item")的父级元素没重载,用$(".list")
         * ******/
        var nowClickIndex = $(this).parent().find("i").text();
        deleteLS(who, nowClickIndex);
        appendToDOM(who);
    });
    list.on("click", ".finish", function () {
        var nowClickIndex = $(this).parent().find("i").text();
        writeToCompletedLocalStorage(nowClickIndex);
        appendToDOM(who);
    });


});

/******************************
 * 切换添加按钮的状态,开关添加界面*
 * ****************************/
function switchBtnStatus() {
    var inputInterface = $(".inputNewItem");
    var inputTitle = $("#inputTitle");
    var okBtn = $(".okBtn");
    var addBtn = $(".addNewBtn");
    if (okBtn.css("bottom") === "5px") {
        okBtn.css("bottom", "90px");
        addBtn.css("transform", "rotate(45deg)");
        inputInterface.show(300);
        inputTitle.focus();
        var timer = setInterval("typing()", 500);
    } else {
        okBtn.css("bottom", "5px");
        addBtn.css("transform", "rotate(0deg)");
        inputInterface.hide(300);
        clearInterval(timer);
    }

}

/****************************************
 * 显示键为completed的LocalStorage中的数据*
 * *************************************/
function showCompleted() {
    appendToDOM("completed");
}

/**********************************************
 * 获取标题,内容,时间,写入LocalStorage的todo类别中*
 * ********************************************/
function writeToTODOLocalStorage() {
    var TODOValue = {
        "title": "title",
        "content": "content",
        "time": "time"
    };
    var TODOLocalStorage = [];

    // TODOValue = JSON.stringify(TODOValue);
    // TODOValue = JSON.parse(TODOValue);

    //获取标题和内容
    TODOValue.title = $("#inputTitle").val();
    TODOValue.content = $("#inputContent").val();
    var date = new Date();
    TODOValue.time = date.toLocaleString();

    TODOLocalStorage = JSON.parse(localStorage.getItem("todo"));//读取
    // console.log( TODOLocalStorage[2].time + "是TODOLocalStorage[2].time的值");
    TODOLocalStorage.push(TODOValue);//添加
    localStorage.setItem("todo", JSON.stringify(TODOLocalStorage));//写入

}

/************************************************************************
 * 将键为todo的LocalStorage中第index个删除,存入键为completed的LocalStorage中*
 * **********************************************************************/
function writeToCompletedLocalStorage(index) {//将某个todo事项转为completed事项
    var completedValue = {
        "title": "title",
        "content": "content",
        "time": "time"
    };
    var temp;
    var TODOLocalStorage;
    var completedLocalStorage = [];
    completedLocalStorage = JSON.parse(localStorage.getItem("completed"));//读取
    TODOLocalStorage = JSON.parse(localStorage.getItem("todo"));//读取
    //删除todo里的某项,存到completed里
    temp = TODOLocalStorage[index];
    completedLocalStorage.push(temp);//添加
    localStorage.setItem("completed", JSON.stringify(completedLocalStorage));//写入
    deleteLS(who, index);//从todo里删除
}

/********************************************
 * 功能:将键为type的LocalStorage中第index个删除*
 * ******************************************/
function deleteLS(type, index) {
    var TODOLocalStorage = [];
    TODOLocalStorage = JSON.parse(localStorage.getItem(type));//读取
    TODOLocalStorage.splice(index, 1);//删除

    localStorage.setItem(type, JSON.stringify(TODOLocalStorage));//写入
}


/********************************************
 * 功能:将LocalStorage中的数据读取出来并写入DOM*
 * 参数:type:"todo"/"completed"             *
 * *****************************************/
function appendToDOM(type) {
    var TODOLocalStorage = [];
    $(".list").empty();
    TODOLocalStorage = JSON.parse(localStorage.getItem(type));//读取
    for (var i = 0; i < TODOLocalStorage.length; i++) {
        var html = "";
        var itemTitle = TODOLocalStorage[i].title;
        var itemContent = TODOLocalStorage[i].content;
        var itemTime = TODOLocalStorage[i].time;
        html = '<li class="list-item"><h4 class="title">';
        if (type === "completed") {
            html += '<s>' + itemTitle + '</s>';
        } else {
            html += itemTitle;
            // '<li class="list-item"><h4 class="title">' + itemTitle +
        }
        html += '</h4><div class="content">' + itemContent + '</div><div class="createdTime">' + itemTime + '</div><div class="clear"><svg width="128px" height="128.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M885.960599 229.332129 139.025868 229.332129c-13.322423 0-24.092721-10.770298-24.092721-24.092721 0-13.302981 10.770298-24.097838 24.092721-24.097838l746.93473 0c13.323447 0 24.092721 10.794857 24.092721 24.097838C910.05332 218.561831 899.284045 229.332129 885.960599 229.332129L885.960599 229.332129zM645.010875 132.956128l-265.036305 0c-13.323447 0-24.097838-10.770298-24.097838-24.097838 0-13.297864 10.774391-24.093744 24.097838-24.093744l265.036305 0c13.328563 0 24.098861 10.796904 24.098861 24.093744C669.109736 122.186853 658.340461 132.956128 645.010875 132.956128L645.010875 132.956128zM404.06729 759.409856 404.06729 349.805968c0-13.301957 10.769274-24.097838 24.092721-24.097838 13.328563 0 24.097838 10.79588 24.097838 24.097838l0 409.603889c0 13.32754-10.769274 24.097838-24.097838 24.097838C414.837588 783.507694 404.06729 772.738419 404.06729 759.409856L404.06729 759.409856zM572.728618 759.409856 572.728618 349.805968c0-13.301957 10.773368-24.097838 24.097838-24.097838 13.323447 0 24.092721 10.79588 24.092721 24.097838l0 409.603889c0 13.32754-10.769274 24.097838-24.092721 24.097838C583.501986 783.507694 572.728618 772.738419 572.728618 759.409856L572.728618 759.409856zM235.406986 301.615409c13.32447 0 24.093744 10.796904 24.093744 24.092721l0 28.528754 0 91.946109 0 385.510144c0 26.600845 21.590737 48.192605 48.190559 48.192605l409.603889 0c26.599821 0 48.190559-21.591761 48.190559-48.192605l0-385.510144 0-91.946109 0-28.528754c0-13.296841 10.769274-24.092721 24.093744-24.092721 13.32754 0 24.097838 10.796904 24.097838 24.092721l0 96.383164 0 24.091698 0 409.609005c0 39.924291-32.361035 72.285327-72.284303 72.285327L283.593452 928.077324c-39.923268 0-72.284303-32.361035-72.284303-72.285327L211.309148 490.398006l0-44.215014 0-24.091698 0-96.383164C211.309148 312.412312 222.083539 301.615409 235.406986 301.615409L235.406986 301.615409zM235.406986 301.615409"></path></svg></div>';
        if (type === "todo") {
            html += '<div class="finish"><svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css">@font-face{font-family: ifont; src: url("//at.alicdn.com/t/font_1442373896_4754455.eot?#iefix") format("embedded-opentype"), url("//at.alicdn.com/t/font_1442373896_4754455.woff") format("woff"), url("//at.alicdn.com/t/font_1442373896_4754455.ttf") format("truetype"), url("//at.alicdn.com/t/font_1442373896_4754455.svg#ifont") format("svg");}</style></defs><g class="transform-group"><g transform="scale(0.015625, 0.015625)"><path d="M511.174192 67.649749c-244.689908 0-443.046558 198.358697-443.046558 443.046558 0 244.689908 198.35665 443.046558 443.046558 443.046558 244.686838 0 443.046558-198.35665 443.046558-443.046558C954.22075 266.00947 755.862054 67.649749 511.174192 67.649749zM511.174192 909.437801c-220.22061 0-398.741493-178.522929-398.741493-398.741493s178.520883-398.741493 398.741493-398.741493c220.218564 0 398.741493 178.522929 398.741493 398.741493S731.392756 909.437801 511.174192 909.437801zM708.859553 372.923478 475.452619 606.334505 357.927949 488.807788c-9.389858-9.387811-25.415856-8.580422-35.798321 1.802042-10.379395 10.377348-11.184737 26.405393-1.796926 35.793204l135.981021 135.983067c4.920056 4.916986 11.660574 7.03216 18.457374 6.442736 7.535627 0.639566 15.292288-1.917676 21.057595-7.684006L746.4548 410.518724c10.382465-10.382465 10.382465-27.212782 0-37.595246C736.074382 362.544083 719.240995 362.544083 708.859553 372.923478z"></path></g></g></svg></div><s style="display: none">todo</s>'
        }
        html += '<i>' + i + '</i></li>';
        $(".list").append(html);


    }
}

/******************************
 * 监听滚动条,滚动时收起顶栏和按钮*
 * ****************************/
$(window).scroll(function () {
    var before = $(window).scrollTop();
    var direction;
    $(window).scroll(function () {
        var after = $(window).scrollTop();
        if (before > after) {
            // console.log('上');
            before = after;
            direction = "up"
        }
        if (before < after) {
            // console.log('下');
            before = after;
            direction = "down"
        }
        if (direction === "up") {
            $(".nav").css("top", 0);
            $(".btnBox").css("bottom", "3%");
        }
        if (direction === "down") {
            if ($(document).scrollTop() > 100) {
                $(".nav").css("top", "-60px");
                $(".btnBox").css("bottom", "-60px");
            }
            if ($(document).scrollTop() <= 100) {
                $(".nav").css("top", 0);
            }
        }
    });
});


/**********************************
 * 检查标题框中是否有值,有则确认键变色*
 * ********************************/
function typing() {
    var inputTitle = $("#inputTitle");
    if (inputTitle.val()) {
        $(".okBtn").css("background-color", "green");
    } else {
        $(".okBtn").css("background-color", "#bfbfbf");
    }
}
