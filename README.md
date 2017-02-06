# Base-Js-Project

基础前端gulp的构建项目，用作开始编写js插件/工具的时候。

下载后，一般的本地化修改如下:

* package.json

    根据项目情况修改信息，如 `name`、`author` 和 `description` 等。

* gulpfile.js

    最主要是修改 `projectName`，会用作发布包的基础名字。而 `gulpfile.js
` 内置的是最基础的构建任务，更多需求当然是自己编写。

开发目录说明

```
    src
    ├── html            # 存放使用的html文件，例如demo.html等。暂时未创建。
    ├── images
    ├── javascript      # js源码
    ├── libs            # 存放第三方工具包，例如jQeury，暂时未创建。
    └── styles
        ├── css         # css文件
        └── scss        # scss文件
```

注意事项:

* css 和 sass 构建后会统一存放到 `styles` 目录下,因为这两者是等价的,只是后者需要编译。
* 除了根目录的 `.gitignore` 文件,其他都是可以删除的,存放多余的 `.gitignore` 仅仅是为了提交空目录。
