# Validator-js

前端的验证工具，无其他包依赖无样式，可以适合任何环境，可根据项目环境自行组装提示信息反馈给用户。

### usage:

在 `input` 和 `select` 元素上，添加 `data-validator-options` 属性，然后编写json的验证器配置信息，例如:

```html
<input id="login_name" name="login_name"
    data-validator-options="required:true,validType:['loginName','length[6,32]']" >
```

* required

    代表验证必填项。

* validType

    验证的规则组合，`string` 的数组，注意格式！其中 `length[6,32]` 的意思是，使用 `length` 验证规则，并且传入参数为 `6` 和 `32`。

**更多验证规则可自行扩展**，详细使用例子：[参见](src/html/demo.html)

在线体验: [http://jsrun.net/PYiKp](http://jsrun.net/PYiKp)
