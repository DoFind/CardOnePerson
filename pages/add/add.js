
// 即使没有东西也需要写 page({})
// 不然报错：pages/add/add 出现脚本错误或者未正确调用 Page()

Page({
    data:{

    },

    onLoad(e){
        var id = e.id;
        // console.log(id);

        if(id){
            getData(id, this);
        }
        else{
            this.setData({
                id: Date.now()
            })
        }
    },

    change(e){
        // 输入的内容  
        var con = e.detail.value;

        this.setData({
            content: con
        })
    },

    cancel(){
        // 不做操作，直接返回上一级。其实可以没有
        wx.navigateBack();
    },

    sure(){

        // 正则，是否为空字符的判断?

        var re = /^\s*$/g;
        if(!this.data.content || re.test(this.data.content)){
            return;
        }

        this.setData({
            time: Date.now()
        })

        setValue(this);
        wx.navigateBack();
    }
})

function getData(id, page){
    var arr = wx.getStorageSync('txt');
    if(arr.length){
        arr.forEach((item)=>{
            if(item.id == id){
                page.setData({
                    id:item.id,
                    content:item.content
                })
            }
        })
    }
}

function setValue(page){
    var arr = wx.getStorageSync('txt');

    // console.log('setvalue:' + arr);
    var data  = [], flag = true;

    if(arr.length){
        arr.forEach((item)=>{
            if(item.id == page.data.id){
                //修改
                item.time = Date.now();
                item.content = page.data.content;
                flag = false;
            }
            data.push(item);
        })  
    }

    if(flag){
        data.push(page.data);
    }
    

    // console.log(arr);
    wx.setStorageSync('txt', data);
}