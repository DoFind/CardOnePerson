var types = ['default', 'primary', 'warn']
var pageObject = {
  data: {
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false
  },
  setDisabled: function (e) {
    this.setData({
      disabled: !this.data.disabled
    })
  },
  setPlain: function (e) {
    this.setData({
      plain: !this.data.plain
    })
  },
  setLoading: function (e) {
    this.setData({
      loading: !this.data.loading
    })
  }
}

// for (var i = 0; i < types.length; ++i) {
//   (function (type) {
//     pageObject[type] = function (e) {
//       var key = type + 'Size'
//       var changedData = {}
//       changedData[key] =
//         this.data[key] === 'default' ? 'mini' : 'default'
//       this.setData(changedData)
//     }
//   })(types[i])
// }

Page(pageObject)


// Page({
//   data: {
//     objectArray: [
//       {id: 5, unique: 'unique_5'},
//       {id: 4, unique: 'unique_4'},
//       {id: 3, unique: 'unique_3'},
//       {id: 2, unique: 'unique_2'},
//       {id: 1, unique: 'unique_1'},
//       {id: 0, unique: 'unique_0'},
//     ],
//     numberArray: [1, 2, 3, 4]
//   },
//   switch: function(e) {
//     const length = this.data.objectArray.length
//     for (let i = 0; i < length; ++i) {
//       const x = Math.floor(Math.random() * length)
//       const y = Math.floor(Math.random() * length)
//       const temp = this.data.objectArray[x]
//       this.data.objectArray[x] = this.data.objectArray[y]
//       this.data.objectArray[y] = temp
//     }
//     this.setData({
//       objectArray: this.data.objectArray
//     })
//   },
//   addToFront: function(e) {
//     const length = this.data.objectArray.length
//     this.data.objectArray = [{id: length, unique: 'unique_' + length}].concat(this.data.objectArray)
//     this.setData({
//       objectArray: this.data.objectArray
//     })
//   },
//   addNumberToFront: function(e){
//     this.data.numberArray = [ this.data.numberArray.length + 1 ].concat(this.data.numberArray)
//     this.setData({
//       numberArray: this.data.numberArray
//     })
//   }
// })

// Page({
//   onLoad: function(options) {
//     this.setData({
//       title: options.title
//     })
//   }
// })


// var order = ['red', 'yellow', 'blue', 'green', 'red']
// Page({
//   data: {
//     toView: 'red',
//     scrollTop: 100
//   },
//   upper: function(e) {
//     console.log(e)
//   },
//   lower: function(e) {
//     console.log(e)
//   },
//   scroll: function(e) {
//     console.log(e)
//   },
//   tap: function(e) {
//     for (var i = 0; i < order.length; ++i) {
//       if (order[i] === this.data.toView) {
//         this.setData({
//           toView: order[i + 1]
//         })
//         break
//       }
//     }
//   },
//   tapMove: function(e) {
//     this.setData({
//       scrollTop: this.data.scrollTop + 10
//     })
//   }
// })


// 图片模式
// Page({
//   data: {
//     array: [{
//       mode: 'scaleToFill',
//       text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
//     }, { 
//       mode: 'aspectFit',
//       text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
//     }, { 
//       mode: 'aspectFill',
//       text: 'aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来'
//     }, { 
//       mode: 'widthFix',
//       text: 'widthFix：宽度不变，高度自动变化，保持原图宽高比不变'
//     }, { 
//       mode: 'top',
//       text: 'top：不缩放图片，只显示图片的顶部区域' 
//     }, {      
//       mode: 'bottom',
//       text: 'bottom：不缩放图片，只显示图片的底部区域'
//     }, { 
//       mode: 'center',
//       text: 'center：不缩放图片，只显示图片的中间区域'
//     }, { 
//       mode: 'left',
//       text: 'left：不缩放图片，只显示图片的左边区域'
//     }, { 
//       mode: 'right',
//       text: 'right：不缩放图片，只显示图片的右边边区域'
//     }, { 
//       mode: 'top left',
//       text: 'top left：不缩放图片，只显示图片的左上边区域' 
//     }, { 
//       mode: 'top right',
//       text: 'top right：不缩放图片，只显示图片的右上边区域'
//     }, { 
//       mode: 'bottom left',
//       text: 'bottom left：不缩放图片，只显示图片的左下边区域'
//     }, { 
//       mode: 'bottom right',
//       text: 'bottom right：不缩放图片，只显示图片的右下边区域'
//     }],
//     src: '../../img/1.jpg'
//   },
//   imageError: function(e) {
//     console.log('image3发生error事件，携带值为', e.detail.errMsg)
//   }
// })
