# Validator-js

提供前端的验证工具，无其他包依赖无样式，可以适合任何环境。但也意味着提示信息需要根据自己环境反馈给用户。

### usage:

在 `input` 和 `select` 元素上，添加 `data-validator-options` 属性，然后编写json的配置信息，例如:

```
required:true,validType:['loginName','length[6,32]']
```

* required

    代表验证必填项。

* validType

    验证的规则组合，`string` 的数组，注意格式！其中 `length[6,32]` 的意思是，使用 `length` 验证规则，并且传入参数为 `6` 和 `32`。

更多使用例子：[参考](src/html/demo.html)


