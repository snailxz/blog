# vue-cli3 中使用 webpack-spritesmith 详解


### 安装

```bash
yarn add webpack-spritesmith
```

### 配置
```javascript
// vue.config.vue
const Spritesmith  = require('webpack-spritesmith')

module.exports = {
  chainWebpack: config => {
    // 雪碧图
    config.plugin().use(Spritesmith, [{
      src: { // 目标小图标
        cwd: path.join(__dirname, 'src/assets/sprite'), // 小图标路径
        glob: '*.png' // 匹配小图标文件后缀名
      },
      target: { // 生成目标配置
        image: path.join(__dirname, 'src/assets/images/sprite.png'), // 生成雪碧图(大图)文件存放路径
        css: [   // 对应的样式文件存放路径 也可以是 css
          [path.join(__dirname, 'src/assets/styles/sprites.scss'), {
            format: 'handlebars_based_template'  // 使用下边 customTemplates 配置的模版
          }]
        ]
      },
      apiOptions: { // 生成样式文件中图片的引用地址
        cssImageRef: '../../../assets/images/sprite.png'
      },
      customTemplates: {
        'handlebars_based_template': path.join(__dirname, 'scss_template.handlebars')
      },
      spritesmithOptions: { // 雪碧图生成算法
        algorithm: 'binary-tree', // 生成方形图 有多种模式 详情请看文档
        padding: 6 // 每个小图标之间的间隙
      }
    }])
  }, 
}

```

### 模版文件
```
{
  // Default options
  'functions': true,
  'variableNameTransforms': ['dasherize']
}

{{#block "sprites-comment"}}
// SCSS variables are information about icon's compiled state, stored under its original file name
//
// .icon-home {
//   width: $icon-home-width;
// }
//
// The large array-like variables contain all information about a single icon
// $icon-home: x y offset_x offset_y width height total_width total_height image_path;
//
// At the bottom of this section, we provide information about the spritesheet itself
// $spritesheet: width height image $spritesheet-sprites;
{{/block}}
{{#block "sprites"}}
{{#each sprites}}
${{strings.name}}: ({{px.x}}, {{px.y}}, {{px.offset_x}}, {{px.offset_y}}, {{px.width}}, {{px.height}}, {{px.total_width}}, {{px.total_height}}, '{{{escaped_image}}}', '{{name}}', );
{{/each}}
{{/block}}
{{#block "spritesheet"}}
${{spritesheet_info.strings.name_width}}: {{spritesheet.px.width}};
${{spritesheet_info.strings.name_height}}: {{spritesheet.px.height}};
${{spritesheet_info.strings.name_image}}: '{{{spritesheet.escaped_image}}}';
${{spritesheet_info.strings.name_sprites}}: ({{#each sprites}}${{strings.name}}, {{/each}});
${{spritesheet_info.strings.name}}: ({{spritesheet.px.width}}, {{spritesheet.px.height}}, '{{{spritesheet.escaped_image}}}', ${{spritesheet_info.strings.name_sprites}}, );
{{/block}}

{{#block "sprite-functions-comment"}}
{{#if options.functions}}
// The provided mixins are intended to be used with the array-like variables
//
// .icon-home {
//   @include sprite-width($icon-home);
// }
//
// .icon-email {
//   @include sprite($icon-email);
// }
//
// Example usage in HTML:
//
// `display: block` sprite:
// <div class="icon-home"></div>
//
// To change `display` (e.g. `display: inline-block;`), we suggest using a common CSS class:
//
// // CSS
// .icon {
//   display: inline-block;
// }
//
// // HTML
// <i class="icon icon-home"></i>
{{/if}}
{{/block}}
{{#block "sprite-functions"}}
{{#if options.functions}}
@mixin sprite-width($sprite) {
  width: nth($sprite, 5);
}

@mixin sprite-height($sprite) {
  height: nth($sprite, 6);
}

@mixin sprite-position($sprite) {
  $sprite-offset-x: nth($sprite, 3);
  $sprite-offset-y: nth($sprite, 4);
  background-position: $sprite-offset-x  $sprite-offset-y;
  background-size: nth($sprite, 7) nth($sprite, 8);
}

@mixin sprite-image($sprite) {
  $sprite-image: nth($sprite, 9);
  background-image: url(#{$sprite-image});
}

@mixin sprite($sprite) {
  @include sprite-width($sprite);
  @include sprite-height($sprite);
  @include sprite-image($sprite);
  @include sprite-position($sprite);
}
{{/if}}
{{/block}}

{{#block "spritesheet-functions-comment"}}
{{#if options.functions}}
// The `sprites` mixin generates identical output to the CSS template
//   but can be overridden inside of SCSS
//
// @include sprites($spritesheet-sprites);
{{/if}}
{{/block}}
{{#block "spritesheet-functions"}}
{{#if options.functions}}
@mixin sprites($sprites) {
  @each $sprite in $sprites {
    $sprite-name: nth($sprite, 10);
    .#{$sprite-name} {
      @include sprite($sprite);
    }
  }
}
{{/if}}
{{/block}}
```
更多模版类型参照[spritesheet-templates/templates](https://github.com/twolfson/spritesheet-templates/tree/master/lib/templates)

### 使用
首先将需要合成的雪碧图放在配置的文件夹中，启动服务会自动生成雪碧图 `sprite.png`，生成效果如下：

![image](/images/notes/2020-03-18-001.png)

同时会生成 `sprites.scss`

之后我们就可以在自己的 css 或 scss 文件中中引入使用了：

```scss
<!--index.scss-->
@import "@/assets/styles/sprites.scss";

.box {
    @include sprite($haiwangxing);
}
```

